import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import Task from "../models/Time";

type TaskParams = {
  teamId: string;
  name: string;
  assignedMembershipId?: string | null;
  assignedProjectId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  duration?: number | null;
  notes?: string | null;
  history?: any[];
};

type TaskQueryParams = {
  id?: string;
  teamId: string;
  assignedProjectId?: string;
  assignedMembershipId?: string;
  startDate?: string;
  dueDate?: string;
  duration?: number;
  notes?: string;
  withArchived?: boolean;
};

type TaskQuery = {
  id?: string;
  teamId: string;
  assignedProjectId?: string;
  assignedMembershipId?: string;
  startDate?: string;
  dueDate?: string;
  duration?: number;
  notes?: string;
  isDeleted?: boolean;
};

function buildQuery({
  id,
  teamId,
  assignedProjectId,
  assignedMembershipId,
  startDate,
  dueDate,
  withArchived,
}: TaskQueryParams): Partial<TaskQuery> {
  if (id) return { id };
  const query: Partial<TaskQuery> = {
    teamId,
  };
  if (assignedProjectId) query.assignedProjectId = assignedProjectId;
  if (assignedMembershipId) query.assignedMembershipId = assignedMembershipId;
  if (startDate) {
    query.startDate = startDate;
  }
  if (dueDate) {
    query.dueDate = dueDate;
  }
  if (withArchived !== undefined) query.isDeleted = false;
  return query;
}

export default class TaskService extends Service {
  async create(
    {
      teamId,
      name,
      assignedMembershipId = null,
      assignedProjectId = null,
      startDate = null,
      dueDate = null,
      duration = 0,
      notes = "",
      history = [],
    }: TaskParams,
    currentMembership: any
  ) {
    const time = new Task({
      _id: uuidv7(),
      ts: Date.now(),
      teamId,
      name,
      assignedMembershipId,
      assignedProjectId,
      startDate,
      dueDate,
      duration,
      notes,
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
    await this._create(time);
    return time;
  }

  async save(task: Task) {
    await this._update(task.getId(), task);
    return task;
  }

  async getTaskList(params: TaskQueryParams) {
    const query = buildQuery(params);
    const data = await this._findMany(query);
    return data.map((task: any) => new Task(task));
  }

  async getTaskById(id: string) {
    const data = await this._findOne({ _id: id });
    return data ? new Task(data) : null;
  }

  async getTaskByTimestamp({ ts }: { ts: number }) {
    const data = await this._findOne({ ts });
    return data ? new Task(data) : null;
  }

  async getTasksByMembership(assignedMembershipId: string) {
    const data = await this._findMany({ assignedMembershipId });
    return data.map((task: any) => new Task(task));
  }

  async getTasksByProject(assignedProjectId: string) {
    const data = await this._findMany({ assignedProjectId });
    return data.map((task: any) => new Task(task));
  }

  async getTasksByTeam(teamId: string) {
    const data = await this._findMany({ teamId, isDeleted: false });
    return data.map((task: any) => new Task(task));
  }

  async getRichTask({ task, membership, project, team, memberships }: any) {
    const richTask = { ...task.toJSON() };

    //richTask.history = await getRichHistory(task.history, memberships);
    return richTask;
  }
}
