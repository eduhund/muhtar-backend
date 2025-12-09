import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import Membership from "../models/Membership";
import ProjectContract from "../models/ProjectContract";

export default class ProjectContractService extends Service {
  async createContract(data: any, currentMembership: Membership) {
    const currentMembershipId = currentMembership.getId();

    const contract = new ProjectContract({
      ...data,
      _id: uuidv7(),
      teamId: currentMembership.teamId,
      version: data.version || 1,
      date: data.date || new Date().toISOString(),
      isDeleted: false,
      history: [
        {
          ts: Date.now(),
          action: "create",
          membershipId: currentMembershipId,
        },
      ],
    });
    await this._create(contract);
    return contract;
  }

  async save(contract: ProjectContract) {
    await this._update(contract.getId(), contract);
    return contract;
  }

  async getContractById(_id: string) {
    const data = await this._findOne({ _id });
    return data ? new ProjectContract(data) : null;
  }

  async getContractsByTeam(teamId: string) {
    const data = await this._findMany({ teamId });
    return data.map((contract: any) => new ProjectContract(contract));
  }

  async getContractsByProject(projectId: string) {
    const data = await this._findMany({ projectId });
    return data.map((contract: any) => new ProjectContract(contract));
  }
}
