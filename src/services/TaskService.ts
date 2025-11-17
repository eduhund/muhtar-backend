import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import Task from "../models/Task";
import {
  getRichMembership,
  getRichObject,
  getRichProject,
  getRichTeam,
} from "../utils/getRichObject";

type TaskParams = {
  teamId: string;
  name: string;
  assignedMembershipId?: string | null;
  workRoleKey?: string | null;
  jobId?: string | null;
  projectId: string;
  startDate?: string | null;
  dueDate?: string | null;
  duration?: number | [number, number] | null;
  notes?: string | null;
  history?: any[];
};

type TaskQueryParams = {
  id?: string;
  teamId: string;
  projectId: string;
  workRoleKey?: string;
  assignedMembershipId?: string;
  jobId?: string;
  startDate?: string;
  dueDate?: string;
  duration?: number | [number, number];
  notes?: string;
  withArchived?: boolean;
};

type TaskQuery = {
  id?: string;
  teamId: string;
  projectId: string;
  assignedMembershipId?: string;
  workRoleKey?: string;
  jobId?: string;
  startDate?: string;
  dueDate?: string;
  duration?: number | [number, number];
  notes?: string;
  isDeleted?: boolean;
};

function buildQuery({
  id,
  teamId,
  projectId,
  assignedMembershipId,
  startDate,
  dueDate,
  withArchived,
}: TaskQueryParams): Partial<TaskQuery> {
  if (id) return { id };
  const query: Partial<TaskQuery> = {
    teamId,
  };
  if (projectId) query.projectId = projectId;
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
      projectId,
      name,
      assignedMembershipId = null,
      workRoleKey = null,
      jobId = null,
      startDate = null,
      dueDate = null,
      duration = null,
      notes = "",
    }: TaskParams,
    currentMembership: any
  ) {
    const task = new Task({
      _id: uuidv7(),
      ts: Date.now(),
      teamId,
      projectId,
      name,
      assignedMembershipId,
      workRoleKey,
      jobId,
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
    await this._create(task);
    return task;
  }

  async save(task: Task) {
    await this._update(task.getId(), task);
    return task;
  }

  async getTasks(params: TaskQueryParams) {
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

  getRichTask({ task, membership, project, team }: any) {
    const richTask = {
      ...task.toJSON(),
      assignedMembership: task.assignedMembershipId
        ? {
            id: membership?.getId(),
            name: membership?.name,
          }
        : null,
      project: project ? { id: project.getId(), name: project.name } : null,
      team: team ? { id: team.getId(), name: team.name } : null,
    };

    delete richTask.assignedMembershipId;
    delete richTask.projectId;
    delete richTask.teamId;

    //richTask.history = await getRichHistory(task.history, memberships);
    return richTask;
  }
}
