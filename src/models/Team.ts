import BaseModel from "./BaseModel";
import Membership from "./Membership";

export type WorkRole = {
  name: string;
  description?: string;
  rate: number;
};

export default class Team extends BaseModel<Team, Membership> {
  name: string;
  isDeleted: boolean;
  workRoles: WorkRole[];
  connections: Record<string, any>;
  history: any[];
  constructor(data: any = {}) {
    super(data._id);
    this.name = data.name ?? "";
    this.isDeleted = data.isDeleted ?? false;
    this.workRoles = data.workRoles ?? [];
    this.connections = data.connections ?? {};
    this.history = data.history ?? [];
  }

  rename(name: string, membership: Membership) {
    this._update({ name }, membership);
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

  addWorkRole(workRole: WorkRole, membership: Membership) {
    this.workRoles.push(workRole);
    this.history.push({
      ts: Date.now(),
      action: "addWorkRole",
      membershipId: membership.getId(),
    });
    return this;
  }

  removeWorkRole(workRoleName: string, currentMembership: Membership) {
    this.workRoles = this.workRoles.filter(
      (role) => role.name !== workRoleName
    );
    this.history.push({
      ts: Date.now(),
      action: "removeWorkRole",
      membershipId: currentMembership.getId(),
    });
    return this;
  }

  updateWorkRole(
    workRoleName: string,
    newData: Partial<WorkRole>,
    currentMembership: Membership
  ) {
    const workRole = this.workRoles.find((role) => role.name === workRoleName);
    if (!workRole) {
      return this;
    }

    Object.assign(workRole, newData);
    this.history.push({
      ts: Date.now(),
      action: "updateWorkRole",
      membershipId: currentMembership.getId(),
      changes: { workRoleName, newData },
    });
    return this;
  }

  hasWorkRole(workRole: WorkRole): boolean {
    return this.workRoles.some((role) => role.name === workRole.name);
  }
}
