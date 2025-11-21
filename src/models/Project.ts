import { AccessRole } from "../utils/accessRoles";
import BaseModel from "./BaseModel";
import Membership from "./Membership";

type ProjectMembership = {
  membershipId: string;
  accessRole: AccessRole;
  workRole: string;
  multiplier: number;
};

type ProjectRole = {
  key: string;
  name: string;
  accessRole: AccessRole;
  cost: number;
};

type ProjectPlanResource = {
  type: string;
  value: number;
};

type ProjectPlanRole = {
  key: string;
  resources: ProjectPlanResource[];
};

type ProjectPlanJob = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  taskIds: string[];
  roles: ProjectPlanRole[];
  children: ProjectPlanJob[];
};

type ProjectPlan = {
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalResources: ProjectPlanResource[];
  jobs: ProjectPlanJob[];
};

type ProjectContract = {
  currency: string;
};

export default class Project extends BaseModel<Project, Membership> {
  name: string;
  description: string;
  customer: string | null;
  teamId: string;
  status?: "draft" | "active" | "completed" | "terminated";
  isDeleted: boolean;
  connections: Record<string, any>;
  roles: ProjectRole[];
  memberships: ProjectMembership[];
  visibility?: "private" | "team";
  history: any[];
  contract: ProjectContract;
  plan: ProjectPlan;
  constructor(data: any = {}) {
    super(data._id);
    this.name = data.name ?? "";
    this.description = data.description ?? "";
    this.customer = data.customer ?? null;
    this.teamId = data.teamId;
    this.status = data.status ?? "draft";
    this.isDeleted = data.isDeleted ?? false;
    this.connections = data.connections ?? {};
    this.roles = data.roles ?? [];
    this.memberships = data.memberships ?? [];
    this.visibility = data.visibility ?? "private";
    this.history = data.history ?? [];
    this.contract = data.contract ?? { currency: "USD" };
    this.plan = data.plan ?? null;
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
    accessRole = "member",
    workRole = "staff",
    multiplier = 1,
  }: ProjectMembership) {
    const index = this.memberships.findIndex(
      (membership) => membership.membershipId === membershipId
    );
    if (index === -1) {
      const membershipData: ProjectMembership = {
        membershipId,
        accessRole,
        workRole,
        multiplier,
      };
      this.memberships.push(membershipData);
    }
    return this;
  }

  updateMembership(
    membershipId: string,
    update: { accessRole?: AccessRole; workRole?: string; multiplier?: number },
    currentMembership: Membership
  ) {
    const index = this.memberships.findIndex(
      (membership) => membership.membershipId === membershipId
    );
    if (index !== -1) {
      const membership = this.memberships[index];
      if (update.accessRole !== undefined) {
        membership.accessRole = update.accessRole;
      }
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
      this.memberships.splice(index, 1);
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
    return !!membership;
  }

  isProjectAdmin(membershipId: string) {
    const membership = this.getProjectMembership(membershipId);
    return membership?.accessRole === "admin";
  }

  getProjectMembershipRole(membershipId: string) {
    return this.getProjectMembership(membershipId)?.accessRole || null;
  }

  toString() {
    return this.name;
  }
}
