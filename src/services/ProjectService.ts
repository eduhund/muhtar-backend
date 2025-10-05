import { v4 as uuidv4 } from "uuid";

import Service from "./Service";
import Project from "../models/Project";
import Membership from "../models/Membership";

export default class ProjectService extends Service {
  async createProject(data: any, currentMembership: Membership) {
    const currentMembershipId = currentMembership.getId();

    const project = new Project({
      _id: uuidv4(),
      ...data,
      teamId: currentMembership.teamId,
      memberships: [
        {
          membershipId: currentMembershipId,
          accessRole: "manager",
        },
      ],
      history: [
        {
          ts: Date.now(),
          action: "create",
          membershipId: currentMembershipId,
        },
      ],
    });
    project.saveChanges();
    return project;
  }

  async getProjects({ teamId, membershipId }: any) {
    const query: any = { teamId };
    if (membershipId) query["memberships.membershipId"] = membershipId;
    const data = await this._findMany(query);
    return data.map((project: any) => new Project(project));
  }

  async getProjectById(_id: string) {
    const data = await this._findOne({ _id });
    return data ? new Project(data) : null;
  }

  async getProjectBySlackId(channelId: string, teamId: string) {
    const data = await this._findOne({
      "connections.slack.channelId": channelId,
      "connections.slack.teamId": teamId,
    });
    return data ? new Project(data) : null;
  }

  async getProjectsByTeam(teamId: string) {
    const data = await this._findMany({ teamId });
    return data.map((project: any) => new Project(project));
  }

  async getProjectsByMembershipId(membershipId: string) {
    const data = await this._findMany({
      "memberships.membershipId": membershipId,
    });
    return data.map((project: any) => new Project(project));
  }

  async getProjectMemberships(projectId: string) {
    const project = await this.getProjectById(projectId);
    if (!project) return [];
    return project.memberships || [];
  }

  async isProjectMembership(projectId: string, membershipId: string) {
    const projectMemberships = await this.getProjectMemberships(projectId);
    return projectMemberships.some(
      (member: any) => member.membershipId === membershipId
    );
  }

  async getProjectMembershipAccessRole(
    projectId: string,
    membershipId: string
  ) {
    const projectMemberships = await this.getProjectMemberships(projectId);
    return (
      projectMemberships.find(
        (member: any) => member.membershipId === membershipId
      )?.accessRole || null
    );
  }

  async getProjectMembershipWorkRole(projectId: string, membershipId: string) {
    const projectMemberships = await this.getProjectMemberships(projectId);
    return (
      projectMemberships.find(
        (member: any) => member.membershipId === membershipId
      )?.workRole || null
    );
  }
}
