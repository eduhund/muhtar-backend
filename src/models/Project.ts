import BaseModel from "./BaseModel";
import Membership from "./Membership";

export default class Project extends BaseModel {
  name: string;
  description: string;
  teamId: string;
  isDeleted: boolean;
  connections: Record<string, any>;
  memberships: any[];
  history: any[];
  constructor(data: any = {}) {
    super(data._id, "projects");
    this.name = data.name ?? "";
    this.description = data.description ?? "";
    this.teamId = data.teamId;
    this.isDeleted = data.isDeleted ?? false;
    this.connections = data.connections ?? {};
    this.memberships = data.memberships ?? [];
    this.history = data.history ?? [];
  }

  update(newData: any, currentMembership: Membership) {
    const cleanData = Object.fromEntries(
      Object.entries(newData).filter(([_, value]) => value !== undefined)
    );
    const changes: { [key: string]: any } = {};

    Object.keys(cleanData).forEach((key) => {
      const oldVal = this[key];
      const newVal = cleanData[key];

      if (oldVal === newVal) return;

      changes[key] = {
        from: oldVal ?? null,
        to: newVal ?? null,
      };
    });

    Object.assign(this, cleanData);
    this.history.push({
      ts: Date.now(),
      action: "update",
      membershipId: currentMembership.getId(),
      changes: changes,
    });
    this._save(this.toJSON());
  }

  rename(newName: string) {
    this.name = newName;
    this.saveChanges("name");
    return this;
  }

  changeDescription(newDescription: string) {
    this.description = newDescription;
    this.saveChanges("description");
    return this;
  }

  archive(currentMembership: Membership) {
    Object.assign(this, { isDeleted: true });
    this.history.push({
      ts: Date.now(),
      action: "archive",
      membershipId: currentMembership.getId(),
    });

    return this._save(this.toJSON());
  }

  restore(currentMembership: Membership) {
    Object.assign(this, { isDeleted: false });
    this.history.push({
      ts: Date.now(),
      action: "restore",
      membershipId: currentMembership.getId(),
    });

    return this._save(this.toJSON());
  }

  connectTo(
    service: any,
    { channelId, teamId }: { channelId: string; teamId: string }
  ) {
    switch (service) {
      case "slack":
        this.connections.slack = {
          channelId,
          teamId,
        };
        this.saveChanges("connections");
        return this;
      default:
        return this;
    }
  }

  disconnectFrom(service: string) {
    if (this.isConnectedTo(service)) {
      delete this.connections[service];
      this.saveChanges("connections");
    }
    return this;
  }

  addMembership({
    membershipId,
    isDeleted = false,
    workRole = "staff",
    multiplier = 1,
  }: {
    membershipId: string;
    isDeleted?: boolean;
    workRole?: string;
    multiplier?: number;
  }) {
    const index = this.memberships.findIndex(
      (membership) => membership.membershipId === membershipId
    );
    if (index !== -1) {
      this.memberships[index].isDeleted = isDeleted;
    } else {
      const membershipData = {
        membershipId,
        isDeleted,
        workRole,
        multiplier,
      };
      this.memberships.push(membershipData);
    }
    this.saveChanges("memberships");
    return this;
  }

  updateMembership(
    membershipId: string,
    update: { workRole?: string; multiplier?: number },
    currentMembership: Membership
  ) {
    const index = this.memberships.findIndex(
      (membership) => membership.membershipId === membershipId
    );
    if (index !== -1) {
      const membership = this.memberships[index];
      if (update.workRole !== undefined) {
        membership.workRole = update.workRole;
      }
      if (update.multiplier !== undefined) {
        membership.multiplier = update.multiplier;
      }
      this.history.push({
        ts: Date.now(),
        action: "updateMembership",
        membershipId: currentMembership.getId(),
        changes: { ...update },
      });
      this.saveChanges("memberships");
    }
    return this;
  }

  removeMembership(membershipId: string) {
    const index = this.memberships.findIndex(
      (membership) => membership.membershipId === membershipId
    );
    if (index !== -1) {
      this.memberships[index].isDeleted = true;
      this.saveChanges("memberships");
    }
    return this;
  }

  isConnectedTo(service: string) {
    return this.connections.hasOwnProperty(service);
  }

  getProjectMembership(membershipId: string) {
    return this.memberships.find(
      (membership) => membership.membershipId === membershipId
    );
  }

  isProjectMembership(membershipId: string) {
    return this.getProjectMembership(membershipId) !== undefined;
  }

  getProjectMembershipRole(membershipId: string) {
    return this.getProjectMembership(membershipId)?.accessRole || null;
  }

  setTotalHours(totalHours: number) {
    this.totalHours = totalHours;
    this.saveChanges("totalHours");
  }

  toString() {
    return this.name;
  }
}
