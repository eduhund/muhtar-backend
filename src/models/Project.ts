import BaseModel from "./BaseModel";
import Membership from "./Membership";

export default class Project extends BaseModel<Project, Membership> {
  name: string;
  description: string;
  customer: string | null;
  teamId: string;
  isDeleted: boolean;
  connections: Record<string, any>;
  memberships: any[];
  history: any[];
  totalHours: number;
  constructor(data: any = {}) {
    super(data._id);
    this.name = data.name ?? "";
    this.description = data.description ?? "";
    this.customer = data.customer ?? null;
    this.teamId = data.teamId;
    this.isDeleted = data.isDeleted ?? false;
    this.connections = data.connections ?? {};
    this.memberships = data.memberships ?? [];
    this.history = data.history ?? [];
    this.totalHours = data.totalHours ?? 0;
  }

  update(data: Partial<Project>, membership: Membership) {
    this._update(data, membership);
    return this;
  }

  rename(name: string, membership: Membership) {
    this._update({ name }, membership);
    return this;
  }

  changeDescription(description: string, membership: Membership) {
    this._update({ description }, membership);
    return this;
  }

  archive(membership: Membership) {
    this._archive(membership);
    return this;
  }

  restore(membership: Membership) {
    this._restore(membership);
    return this;
  }

  connectTo(
    service: any,
    { channelId, teamId }: { channelId: string; teamId: string },
    membership: Membership
  ) {
    this._update(
      { connections: { [service]: { channelId, teamId } } },
      membership
    );
    return this;
  }

  disconnectFrom(service: string, membership: Membership) {
    this._update({ connections: { [service]: undefined } }, membership);
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
    }
    return this;
  }

  removeMembership(membershipId: string) {
    const index = this.memberships.findIndex(
      (membership) => membership.membershipId === membershipId
    );
    if (index !== -1) {
      this.memberships[index].isDeleted = true;
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
    const membership = this.getProjectMembership(membershipId);
    if (!membership || membership.isDeleted) return false;
    return membership.accessRole !== undefined;
  }

  isProjectAdmin(membershipId: string) {
    const membership = this.getProjectMembership(membershipId);
    if (!membership || membership.isDeleted) return false;
    return membership.accessRole === "admin";
  }

  getProjectMembershipRole(membershipId: string) {
    return this.getProjectMembership(membershipId)?.accessRole || null;
  }

  setTotalHours(totalHours: number) {
    this._systemUpdate({ totalHours });
    return this;
  }

  toString() {
    return this.name;
  }
}
