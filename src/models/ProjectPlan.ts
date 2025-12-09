import BaseModel from "./BaseModel";
import Membership from "./Membership";

type ProjectJobResource = {
  type: string;
  value: number;
};

type ProjectJobRole = {
  key: string;
  resources: ProjectJobResource[];
};

export type ProjectPlanJob = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  prevJobId: string | null;
  status: "backlog" | "active" | "completed" | "canceled";
  roles: ProjectJobRole[];
  resources: ProjectJobResource[];
  children: ProjectPlanJob[];
};

export default class ProjectPlan extends BaseModel<ProjectPlan, Membership> {
  teamId: string;
  projectId: string;
  version: number;
  date: string;
  approvedDate: string | null;
  planStart: string;
  planEnd: string;
  totalBudget: number;
  totalResources: ProjectJobResource[];
  roles: ProjectJobRole[];
  jobs: ProjectPlanJob[];
  history: any[];
  isDeleted: boolean;
  constructor(data: any = {}) {
    super(data._id);
    this.teamId = data.teamId;
    this.projectId = data.projectId;
    this.version = data.version ?? 1;
    this.date = data.date ?? null;
    this.approvedDate = data.approvedDate ?? null;
    this.planStart = data.planStart ?? null;
    this.planEnd = data.planEnd ?? null;
    this.totalBudget = data.totalBudget ?? 0;
    this.totalResources = data.totalResources ?? [];
    this.roles = data.roles ?? [];
    this.jobs = data.jobs ?? [];
    this.history = data.history ?? [];
    this.isDeleted = data.isDeleted ?? false;
  }

  update(data: Partial<ProjectPlan>, membership: Membership) {
    this._update(data, membership);
    return this;
  }

  archive(membership: Membership) {
    this._archive(membership);
    return this;
  }

  restore(membership: Membership) {
    this._restore(membership);
    return this;
  }

  updateJobStatus(
    jobId: string,
    status: "backlog" | "active" | "completed" | "canceled",
    membership: Membership
  ) {
    const updateJobStatusRecursively = (
      jobs: ProjectPlanJob[]
    ): ProjectPlanJob[] => {
      return jobs.map((job) => {
        if (job.id === jobId) {
          return { ...job, status };
        }
        if (job.children && job.children.length > 0) {
          return {
            ...job,
            children: updateJobStatusRecursively(job.children),
          };
        }
        return job;
      });
    };

    this.jobs = updateJobStatusRecursively(this.jobs);
    this._update({ jobs: this.jobs }, membership);
    return this;
  }

  toString() {
    return `Plan ${this.version} from ${this.date} `;
  }
}
