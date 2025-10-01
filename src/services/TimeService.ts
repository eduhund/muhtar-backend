import { v4 as uuidv4 } from "uuid";

import Service from "./Service";
import Time from "../models/Time";
import { dateOnlyIsoString } from "../utils/date";

type TimeParams = {
  membershipId: string;
  createdBy?: string;
  teamId: string;
  projectId: string;
  taskId?: string | null;
  date: Date;
  duration?: number;
  comment?: string | null;
};

export default class TimeService extends Service {
  async addTime(
    {
      membershipId,
      teamId,
      projectId,
      taskId = null,
      date,
      duration = 0,
      comment = "",
    }: TimeParams,
    currentMembership: any
  ) {
    console.log(date);
    const time = new Time({
      _id: uuidv4(),
      ts: Date.now(),
      isDeleted: false,
      membershipId,
      teamId,
      projectId,
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
    time.saveChanges();
    return time;
  }

  async getTime({
    teamId,
    projectId,
    membershipId,
    date,
    from,
    to,
    withDeleted,
  }: any) {
    const data = await this._findMany({
      teamId,
      projectId,
      membershipId,
      date,
      from,
      to,
      isDeleted: withDeleted,
    });
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
}
