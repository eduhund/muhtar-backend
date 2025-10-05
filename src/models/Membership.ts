import BaseModel from "./BaseModel";

type MembershipAccessRole = "owner" | "admin" | "manager" | "member" | "guest";
type MembershipStatus =
  | "active"
  | "pending"
  | "declined"
  | "invited"
  | "archived";

const ACCESS_ROLES = ["guest", "user", "manager", "admin", "owner"];

export default class Membership extends BaseModel {
  userId: string;
  teamId: string;
  accessRole: MembershipAccessRole;
  workRole: string;
  status: MembershipStatus;
  connections: Record<string, any>;
  history: Array<{
    ts: number;
    action: string;
    membershipId?: string;
    changes?: Record<string, any>;
  }>;
  contract: Record<string, any>;
  constructor(data: any = {}) {
    super(data._id, "memberships");
    this.userId = data.userId;
    this.teamId = data.teamId;
    this.accessRole = data.accessRole ?? "member";
    this.workRole = data.workRole ?? "staff";
    this.status = data.status ?? data.userId ? "active" : "pending";
    this.connections = data.connections ?? {};
    this.history = data.history ?? [];
    this.contract = data.contract ?? {};
  }

  changeStatus(status: MembershipStatus) {
    this.status = status;
    this.saveChanges("status");
    return this;
  }

  changeAccessRole(
    accessRole: MembershipAccessRole,
    actorMembership: Membership
  ) {
    this.history.push({
      ts: Date.now(),
      action: "update",
      membershipId: actorMembership.getId(),
      changes: { from: this.accessRole, to: accessRole },
    });
    this.accessRole = accessRole;
    this._save(this.toJSON());
    return this;
  }

  invite() {
    return this.changeStatus("pending");
  }

  accept() {
    return this.changeStatus("active");
  }

  decline() {
    return this.changeStatus("declined");
  }

  archive(currentMembership: Membership) {
    Object.assign(this, { status: "archived" });
    this.history.push({
      ts: Date.now(),
      action: "archive",
      membershipId: currentMembership.getId(),
    });

    return this._save(this.toJSON());
  }

  connectTo(
    service: any,
    { userId, teamId }: { userId: string; teamId: string }
  ) {
    switch (service) {
      case "slack":
        this.connections.slack = {
          userId,
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

  isConnectedTo(service: string) {
    return Object.keys(this.connections).includes(service);
  }

  isInvited() {
    return this.status === "invited";
  }

  isPending() {
    return this.status === "pending";
  }

  isDeclined() {
    return this.status === "declined";
  }

  isActive() {
    return this.status === "active";
  }

  isArchived() {
    return this.status === "archived";
  }

  isMembershipOfTeam(teamId: string) {
    return this.teamId === teamId && this.status !== "declined";
  }

  isOwner() {
    return this.accessRole === "owner" && this.status !== "declined";
  }

  isAdmin() {
    return this.accessRole === "admin" && this.status !== "declined";
  }

  isManager() {
    return this.accessRole === "manager" && this.status !== "declined";
  }

  isMember() {
    return this.accessRole === "member" && this.status !== "declined";
  }

  getAccessRoleIndex() {
    const index = ACCESS_ROLES.indexOf(this.accessRole);
    if (index === -1) {
      this.accessRole = "guest";
      this.saveChanges("accessRole");
      return 0;
    }
    return index;
  }
}
