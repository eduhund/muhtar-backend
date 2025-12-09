import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import Membership from "../models/Membership";
import ProjectPlan, { ProjectPlanJob } from "../models/ProjectPlan";
import { dateOnlyIsoString } from "../utils/date";

function createJobsWithId(jobs: ProjectPlanJob[]): ProjectPlanJob[] {
  return jobs.map((job) => ({
    ...job,
    id: job.id || uuidv7(),
    children: createJobsWithId(job.children || []),
  }));
}

export default class ProjectPlanService extends Service {
  async createPlan(data: any, currentMembership: Membership) {
    const currentMembershipId = currentMembership.getId();

    const plan = new ProjectPlan({
      ...data,
      _id: uuidv7(),
      teamId: currentMembership.teamId,
      version: data.version || 1,
      date: data.date || dateOnlyIsoString(new Date()),
      approvedDate: null,
      jobs: createJobsWithId(data.jobs || []),
      isDeleted: false,
      history: [
        {
          ts: Date.now(),
          action: "create",
          membershipId: currentMembershipId,
        },
      ],
    });
    await this._create(plan);
    return plan;
  }

  async save(plan: ProjectPlan) {
    await this._update(plan.getId(), plan);
    return plan;
  }

  async getPlanById(_id: string) {
    const data = await this._findOne({ _id });
    return data ? new ProjectPlan(data) : null;
  }

  async getPlansByTeam(teamId: string) {
    const data = await this._findMany({ teamId });
    return data.map((plan: any) => new ProjectPlan(plan));
  }

  async getPlansByProject(projectId: string) {
    const data = await this._findMany({ projectId });
    return data.map((plan: any) => new ProjectPlan(plan));
  }
}
