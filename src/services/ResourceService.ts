import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import Resource, { ResourceTarget } from "../models/Resource";
import {
  getRichHistory,
  getRichMembership,
  getRichProject,
  getRichTask,
  getRichTeam,
} from "../utils/getRichObject";

type TimeParams = {
  membershipId: string;
  projectId: string;
  teamId: string;
  taskId?: string | null;
  createdBy?: string;
  date: Date;
  type?: string;
  target?: ResourceTarget | null;
  duration?: number;
  comment?: string | null;
};

type TimeQueryParams = {
  id?: string;
  teamId: string;
  projectId?: string;
  membershipId?: string;
  date?: string;
  from?: string;
  to?: string;
  withArchived?: boolean;
};

type TimeQuery = {
  id?: string;
  teamId: string;
  projectId?: string;
  membershipId?: string;
  date?: string;
  from?: string;
  to?: string;
  isDeleted?: boolean;
};

function buildQuery({
  id,
  teamId,
  projectId,
  membershipId,
  date,
  from,
  to,
  withArchived,
}: TimeQueryParams): Partial<TimeQuery> {
  if (id) return { id };
  const query: Partial<TimeQuery> = {
    teamId,
  };
  if (projectId) query.projectId = projectId;
  if (membershipId) query.membershipId = membershipId;
  if (date) {
    query.date = date;
  } else {
    const dateQuery: any = {};
    if (from) dateQuery.$gte = from;
    if (to) dateQuery.$lt = to;
    if (Object.keys(dateQuery).length > 0) query.date = dateQuery;
  }
  if (withArchived !== undefined) query.isDeleted = false;
  return query;
}

export default class TimeService extends Service {
  async create(
    {
      membershipId,
      projectId,
      teamId,
      date,
      type = "time",
      target = null,
      duration = 0,
      comment = "",
    }: TimeParams,
    currentMembership: any
  ) {
    const resource = new Resource({
      _id: uuidv7(),
      ts: Date.now(),
      isDeleted: false,
      membershipId,
      projectId,
      teamId,
      date,
      type,
      target,
      duration,
      comment,
      history: [
        {
          ts: Date.now(),
          action: "create",
          actorType: "membership",
          actorId: currentMembership.getId(),
        },
      ],
    });
    await this._create(resource);
    return resource;
  }

  async save(resource: Resource) {
    await this._update(resource.getId(), resource);
    return resource;
  }

  async getResourceList(params: TimeQueryParams) {
    const query = buildQuery(params);
    const data = await this._findMany(query);
    return data.map((time: any) => new Resource(time));
  }

  async getResourceById(id: string) {
    const data = await this._findOne({ _id: id });
    return data ? new Resource(data) : null;
  }

  async getResourceByTimestamp({ ts }: { ts: number }) {
    const data = await this._findOne({ ts });
    return data ? new Resource(data) : null;
  }

  async getResourceByMembership(membershipId: string) {
    const data = await this._findMany({ membershipId });
    return data.map((resource: any) => new Resource(resource));
  }

  async getResourceByProject(projectId: string) {
    const data = await this._findMany({ projectId });
    return data.map((resource: any) => new Resource(resource));
  }

  async getResourceByTeam(teamId: string) {
    const data = await this._findMany({ teamId, isDeleted: false });
    return data.map((resource: any) => new Resource(resource));
  }

  async getResourceByPeriod(from: any, to: any, teamId: string) {
    const data = await this._findMany({
      teamId,
      date: { $gte: from, $lt: to },
    });
    return data.map((resource: any) => new Resource(resource));
  }

  async getRichResource({
    resource,
    membership,
    project,
    team,
    memberships,
  }: any) {
    const richResource = { ...resource.toJSON() };
    await getRichMembership(richResource, membership);
    await getRichProject(richResource, project);
    await getRichTeam(richResource, team);

    richResource.history = await getRichHistory(resource.history, memberships);
    return richResource;
  }
}
