import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import Project from "../models/Project";
import Membership from "../models/Membership";
import {
  getRichHistory,
  getRichMembership,
  getRichProject,
  getRichTeam,
} from "../utils/getRichObject";

type ProjectQueryParams = {
  id?: string;
  teamId?: string;
  membershipId?: string;
  status?: string;
};

type ProjectQuery = {
  id?: string;
  teamId?: string;
  memberships?: { membershipId: string };
  status?: string;
};

function buildProjectQuery({
  id,
  teamId,
  membershipId,
  status,
}: ProjectQueryParams): Partial<ProjectQuery> {
  if (id) return { id };

  const query: Partial<ProjectQuery> = {
    teamId,
  };
  if (membershipId) {
    const memberships = { membershipId };
    query.memberships = memberships;
  }
  if (status) query.status = status;
  return query;
}

export default class ProjectService extends Service {
  async createProject(data: any, currentMembership: Membership) {
    const currentMembershipId = currentMembership.getId();

    const project = new Project({
      ...data,
      _id: uuidv7(),
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
    return project;
  }

  async save(project: Project) {
    await this._update(project.getId(), project);
    return project;
  }

  async getProjects(params: ProjectQueryParams) {
    const query = buildProjectQuery(params);
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

  async getRichProject({ project, memberships }: any) {
    const richProject = { ...project.toJSON() };
    delete richProject.teamId;

    //richProject.history = await getRichHistory(project.history, memberships);

    return richProject;
  }
}
