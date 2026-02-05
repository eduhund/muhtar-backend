import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import { BookedResourceTarget } from "../models/BookedResource";
import { getRichProject, getRichTeam } from "../utils/getRichObject";
import BookedResource from "../models/BookedResource";

type ResourceParams = {
  projectId: string;
  teamId: string;
  createdBy?: string;
  date: Date;
  period: "day" | "week" | "month";
  resource: {
    type: string;
    value: number;
  };
  target: BookedResourceTarget;
};

type BookedResourceQueryParams = {
  id?: string;
  teamId: string;
  projectId?: string;
  date?: string;
  period: "day" | "week" | "month";
  resource: {
    type: string;
    value: number;
  };
  target: BookedResourceTarget;
  withArchived?: boolean;
};

type BookedResourceQuery = {
  id?: string;
  teamId: string;
  projectId?: string;
  date?: string;
  period: "day" | "week" | "month";
  resource: {
    type: string;
    value: number;
  };
  target: BookedResourceTarget;
  isDeleted?: boolean;
};

function buildQuery({
  id,
  teamId,
  projectId,
  date,
  period,
  withArchived,
}: BookedResourceQueryParams): Partial<BookedResourceQuery> {
  if (id) return { id };
  const query: Partial<BookedResourceQuery> = {
    teamId,
  };
  if (projectId) query.projectId = projectId;
  if (date) {
    query.date = date;
  }
  if (withArchived !== undefined) query.isDeleted = false;
  if (period) query.period = period;
  return query;
}

export default class BookedResourceService extends Service {
  async create(
    { projectId, teamId, date, period, resource, target }: ResourceParams,
    currentMembership: any,
  ) {
    const bookedResource = new BookedResource({
      _id: uuidv7(),
      ts: Date.now(),
      isDeleted: false,
      projectId,
      teamId,
      date,
      period,
      resource,
      target,
      history: [
        {
          ts: Date.now(),
          action: "create",
          actorType: "membership",
          actorId: currentMembership.getId(),
        },
      ],
    });
    await this._create(bookedResource);
    return bookedResource;
  }

  async save(bookedResource: BookedResource) {
    await this._update(bookedResource.getId(), bookedResource);
    return bookedResource;
  }

  async getBookedResourceList(params: BookedResourceQueryParams) {
    const query = buildQuery(params);
    const data = await this._findMany(query);
    return data.map(
      (bookedResource: any) => new BookedResource(bookedResource),
    );
  }

  async getBookedResourceById(id: string) {
    const data = await this._findOne({ _id: id });
    return data ? new BookedResource(data) : null;
  }

  async getBookedResourcesByMembership(membershipId: string) {
    const data = await this._findMany({ membershipId });
    return data.map(
      (bookedResource: any) => new BookedResource(bookedResource),
    );
  }

  async getBookedResourcesByProject(projectId: string) {
    const data = await this._findMany({ projectId });
    return data.map(
      (bookedResource: any) => new BookedResource(bookedResource),
    );
  }

  async getBookedResourcesByTeam(teamId: string) {
    const data = await this._findMany({ teamId, isDeleted: false });
    return data.map(
      (bookedResource: any) => new BookedResource(bookedResource),
    );
  }

  async getBookedResourcesByPeriod(from: any, to: any, teamId: string) {
    const data = await this._findMany({
      teamId,
      date: { $gte: from, $lt: to },
    });
    return data.map(
      (bookedResource: any) => new BookedResource(bookedResource),
    );
  }

  async getRichBookedResource({ resource, project, team }: any) {
    const richResource = { ...resource.toJSON() };
    await getRichProject(richResource, project);
    await getRichTeam(richResource, team);

    return richResource;
  }
}
