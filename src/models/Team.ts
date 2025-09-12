import BaseModel from "./BaseModel";
import Membership from "./Membership";

export type WorkRole = {
  name: string;
  description?: string;
  rate: number;
};

export default class Team extends BaseModel {
  name: string;
  isDeleted: boolean;
  workRoles: WorkRole[];
  connections: Record<string, any>;
  history: any[];
  constructor(data: any = {}) {
    super(data._id, "teams");
    this.name = data.name ?? "";
    this.isDeleted = data.isDeleted ?? false;
    this.workRoles = data.workRoles ?? [];
    this.connections = data.connections ?? {};
    this.history = data.history ?? [];
  }

  rename(newName: string) {
    this.name = newName;
    this.saveChanges("name");
    return this;
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

  addWorkRole(workRole: WorkRole, currentMembership: Membership) {
    this.workRoles.push(workRole);
    this.history.push({
      ts: Date.now(),
      action: "addWorkRole",
      membershipId: currentMembership.getId(),
    });
    return this._save(this.toJSON());
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
    return this._save(this.toJSON());
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
    return this._save(this.toJSON());
  }

  hasWorkRole(workRole: WorkRole): boolean {
    return this.workRoles.some((role) => role.name === workRole.name);
  }
}
