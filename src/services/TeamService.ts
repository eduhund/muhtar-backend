import { v4 as uuidv4 } from "uuid";

import Service from "./Service";
import Team from "../models/Team";

export default class TeamService extends Service {
  async createTeam(data: any) {
    const team = new Team({
      _id: uuidv4(),
      ...data,
      createdAt: new Date(),
    });
    team.saveChanges();
    return team;
  }

  async getAllActiveTeams() {
    const data = await this._findMany({ isDeleted: false });
    return data.map((teamData: any) => new Team(teamData));
  }

  async getTeamById(_id: string) {
    const data = await this._findOne({ _id });
    return data ? new Team(data) : null;
  }

  async getTeamBySlackId(teamId: string) {
    const data = await this._findOne({ "connections.slack.teamId": teamId });
    return data ? new Team(data) : null;
  }
}
