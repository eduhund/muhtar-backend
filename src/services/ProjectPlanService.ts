import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import Membership from "../models/Membership";
import Plan, { ProjectPlanJob } from "../models/ProjectPlan";

function createJobsWithId(jobs: ProjectPlanJob[]): ProjectPlanJob[] {
  return jobs.map((job) => ({
    ...job,
    id: job.id || uuidv7(),
    children: createJobsWithId(job.children || []),
  }));
}

export default class PlanService extends Service {
  async createProject(data: any, currentMembership: Membership) {
    const currentMembershipId = currentMembership.getId();

    const plan = new Plan({
      ...data,
      _id: uuidv7(),
      teamId: currentMembership.teamId,
      version: data.version || 1,
      date: data.date || new Date().toISOString(),
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
    return plan;
  }

  async save(plan: Plan) {
    await this._update(plan.getId(), plan);
    return plan;
  }

  async getPlanById(_id: string) {
    const data = await this._findOne({ _id });
    return data ? new Plan(data) : null;
  }

  async getPlansByTeam(teamId: string) {
    const data = await this._findMany({ teamId });
    return data.map((plan: any) => new Plan(plan));
  }
}
