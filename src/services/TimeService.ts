import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import Time from "../models/Time";
import { dateOnlyIsoString } from "../utils/date";
import { richHistory } from "../utils/getRichObject";

type TimeParams = {
  membershipId: string;
  projectId: string;
  teamId: string;
  taskId?: string | null;
  createdBy?: string;
  date: Date;
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
  withDeleted?: boolean;
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
  withDeleted,
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
  if (withDeleted !== undefined) query.isDeleted = false;
  return query;
}

export default class TimeService extends Service {
  async create(
    {
      membershipId,
      projectId,
      teamId,
      taskId = null,
      date,
      duration = 0,
      comment = "",
    }: TimeParams,
    currentMembership: any
  ) {
    const time = new Time({
      _id: uuidv7(),
      ts: Date.now(),
      isDeleted: false,
      membershipId,
      projectId,
      teamId,
      taskId,
      date: dateOnlyIsoString(date),
      duration,
      comment,
      history: [
        {
          ts: Date.now(),
          action: "create",
          membershipId: currentMembership.getId(),
        },
      ],
    });
    await this._create(time);
    return time;
  }

  async save(time: Time) {
    await this._update(time.getId(), time);
    return time;
  }

  async getTimeList(params: TimeQueryParams) {
    const query = buildQuery(params);
    const data = await this._findMany(query);
    return data.map((time: any) => new Time(time));
  }

  async getTimeById(id: string) {
    const data = await this._findOne({ _id: id });
    return data ? new Time(data) : null;
  }

  async getTimeByTimestamp({ ts }: { ts: number }) {
    const data = await this._findOne({ ts });
    return data ? new Time(data) : null;
  }

  async getTimeByMembership(membershipId: string) {
    const data = await this._findMany({ membershipId });
    return data.map((time: any) => new Time(time));
  }

  async getTimeByProject(projectId: string) {
    const data = await this._findMany({ projectId });
    return data.map((time: any) => new Time(time));
  }

  async getTimeByTeam(teamId: string) {
    const data = await this._findMany({ teamId, isDeleted: false });
    return data.map((time: any) => new Time(time));
  }

  async getTimeByPeriod(from: any, to: any, teamId: string) {
    const data = await this._findMany({
      teamId,
      date: { $gte: from, $lt: to },
    });
    return data.map((time: any) => new Time(time));
  }

  async getRichTime({ time, membership, project, team, teamMemberships }: any) {
    const richTime = { ...time.toJSON() };
    if (membership) {
      richTime.membership = {
        id: membership.getId(),
        name: membership.name,
      };
    } else {
      richTime.membership = {
        id: richTime.membershipId || null,
        name: "Unknown Membership",
      };
    }

    if (project) {
      richTime.project = {
        id: project.getId(),
        name: project.name,
      };
    } else {
      richTime.project = {
        id: richTime.projectId || null,
        name: "Unknown Project",
      };
    }

    if (team) {
      richTime.team = {
        id: team.getId(),
        name: team.name,
      };
    } else {
      richTime.team = {
        id: richTime.teamId || null,
        name: "Unknown Team",
      };
    }

    delete richTime.membershipId;
    delete richTime.projectId;
    delete richTime.teamId;

    richTime.history = await richHistory(time.history, teamMemberships);

    return richTime;
  }
}
