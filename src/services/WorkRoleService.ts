import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import WorkRole from "../models/WorkRole";

type WorkRoleParams = {
  teamId: string;
  name: string;
  key: string;
};

export default class WorkRoleService extends Service {
  async create({ teamId, name, key }: WorkRoleParams, currentMembership: any) {
    const workRole = new WorkRole({
      _id: uuidv7(),
      ts: Date.now(),
      teamId,
      name,
      key,
      isDeleted: false,
      history: [
        {
          ts: Date.now(),
          action: "create",
          actorType: "membership",
          actorId: currentMembership.getId(),
        },
      ],
    });
    await this._create(workRole);
    return workRole;
  }

  async save(workRole: WorkRole) {
    await this._update(workRole.getId(), workRole);
    return workRole;
  }

  async getWorkRoles() {
    const data = await this._findMany({});
    return data.map((workRole: any) => new WorkRole(workRole));
  }

  async getWorkRoleById(id: string) {
    const data = await this._findOne({ _id: id });
    return data ? new WorkRole(data) : null;
  }

  async getWorkRoleByKey(key: string) {
    const data = await this._findOne({ key });
    return data ? new WorkRole(data) : null;
  }

  async getWorkRolesByProject(projectId: string) {
    const data = await this._findMany({ projectId });
    return data.map((workRole: any) => new WorkRole(workRole));
  }

  async getWorkRolesByTeam(teamId: string) {
    const data = await this._findMany({ teamId, isDeleted: false });
    return data.map((workRole: any) => new WorkRole(workRole));
  }
}
