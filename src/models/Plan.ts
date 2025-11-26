import BaseModel from "./BaseModel";
import Membership from "./Membership";

type ProjectPlanResource = {
  type: string;
  value: number;
};

type ProjectPlanRole = {
  key: string;
  resources: ProjectPlanResource[];
};

type ProjectPlanJob = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  prevJobId: string | null;
  roles: ProjectPlanRole[];
  resources: ProjectPlanResource[];
  children: ProjectPlanJob[];
};

export default class Plan extends BaseModel<Plan, Membership> {
  teamId: string;
  version: number;
  date: string;
  approvedDate: string | null;
  startDate: string;
  endDate: string;
  totalBudget: number;
  totalResources: ProjectPlanResource[];
  roles: ProjectPlanRole[];
  jobs: ProjectPlanJob[];
  history: any[];
  isDeleted: boolean;
  constructor(data: any = {}) {
    super(data._id);
    this.teamId = data.teamId;
    this.version = data.version ?? 1;
    this.date = data.date ?? "";
    this.approvedDate = data.approvedDate ?? null;
    this.startDate = data.startDate ?? "";
    this.endDate = data.endDate ?? "";
    this.totalBudget = data.totalBudget ?? 0;
    this.totalResources = data.totalResources ?? [];
    this.roles = data.roles ?? [];
    this.jobs = data.jobs ?? [];
    this.history = data.history ?? [];
    this.isDeleted = data.isDeleted ?? false;
  }

  update(data: Partial<Plan>, membership: Membership) {
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
