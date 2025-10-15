import { ACCESS_ROLES, AccessRole } from "../utils/accessRoles";
import BaseModel from "./BaseModel";

export type MembershipStatus =
  | "active"
  | "pending"
  | "declined"
  | "invited"
  | "archived";

export default class Membership extends BaseModel<Membership, Membership> {
  userId: string;
  teamId: string;
  name: string;
  accessRole: AccessRole;
  status: MembershipStatus;
  connections: Record<string, any>;
  contract: Record<string, any>;
  constructor(data: any = {}) {
    super(data._id);
    this.userId = data.userId;
    this.teamId = data.teamId;
    this.name = data.name;
    this.accessRole = data.accessRole ?? "user";
    this.status = data.status ?? data.userId ? "active" : "pending";
    this.connections = data.connections ?? {};
    this.history = data.history ?? [];
    this.contract = data.contract ?? {};
  }

  changeStatus(status: MembershipStatus, membership: Membership) {
    this._update({ status }, membership);
    return this;
  }

  changeAccessRole(accessRole: AccessRole, membership: Membership) {
    this._update({ accessRole }, membership);
    return this;
  }

  invite(membership: Membership) {
    return this.changeStatus("pending", membership);
  }

  accept(membership: Membership) {
    return this.changeStatus("active", membership);
  }

  decline(membership: Membership) {
    return this.changeStatus("declined", membership);
  }

  connectTo(
    service: string,
    { userId, teamId }: { userId: string; teamId: string },
    membership: Membership
  ) {
    this._update(
      { connections: { [service]: { userId, teamId } } },
      membership
    );
    return this;
  }

  disconnectFrom(service: string, membership: Membership) {
    this._update({ connections: { [service]: undefined } }, membership);
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
    return (
      this.getId() === this.history[0]?.actorId && this.status !== "declined"
    );
  }

  isAdmin() {
    return this.accessRole === "admin" && this.status !== "declined";
  }

  isMember() {
    return this.accessRole === "user" && this.status !== "declined";
  }

  isGuest() {
    return this.accessRole === "guest" && this.status !== "declined";
  }

  getAccessRoleIndex() {
    const index = ACCESS_ROLES.indexOf(this.accessRole);
    if (index === -1) {
      this._systemUpdate({ accessRole: ACCESS_ROLES[0] });
      return 0;
    }
    return index;
  }
}
