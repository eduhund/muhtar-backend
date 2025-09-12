import { v4 as uuidv4 } from "uuid";

import Service from "./Service";
import Membership from "../models/Membership";
import UserService from "./UserService";
import TeamService from "./TeamService";

export default class MembershipService extends Service {
  userService: UserService;
  teamService: TeamService;
  constructor(adapter: any, collection: string, services: any) {
    super(adapter, collection);
    this.userService = services.users;
    this.teamService = services.teams;
  }
  async createMembership(data: any) {
    const membership = new Membership({
      _id: uuidv4(),
      ...data,
      createdAt: new Date(),
    });
    membership.saveChanges();
    return membership;
  }

  async getMembership({ userId, teamId }: { userId: string; teamId: string }) {
    const data = await this._findOne({ _id: userId, teamId });
    return data ? new Membership(data) : null;
  }

  async getAllActiveMemberships() {
    const data = await this._findMany({ isDeleted: false });
    return data.map((membership: any) => new Membership(membership));
  }

  async getActiveUserMembership(userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new Error("User not found");
    if (user.activeTeamId) {
      return this.getMembership({ userId, teamId: user.activeTeamId });
    } else {
      const memberships = await this.getMembershipsByUser(userId);
      return memberships[0] || null;
    }
  }

  async getMembershipById(_id: string) {
    const data = await this._findOne({ _id });
    return data ? new Membership(data) : null;
  }

  async getMembershipBySlackId(userId: string, teamId: string) {
    const data = await this._findOne({
      "connections.slack.userId": userId,
      "connections.slack.teamId": teamId,
    });
    return data ? new Membership(data) : null;
  }

  async getMembershipsByTeam(teamId: string) {
    const data = await this._findMany({ teamId });
    return data.map((membership: any) => new Membership(membership));
  }

  async getMembershipsByUser(userId: string) {
    const data = await this._findMany({ userId });
    return data.map((membership: any) => new Membership(membership));
  }
}
