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
  startDate: string;
  endDate: string;
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
    this.startDate = data.startDate ?? null;
    this.endDate = data.endDate ?? null;
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

  toString() {
    return `Plan ${this.version} from ${this.date} `;
  }
}
