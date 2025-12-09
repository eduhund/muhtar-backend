import BaseModel from "./BaseModel";
import Membership from "./Membership";

export type ProjectContractRole = {
  key: string;
  name: string;
  resources: {
    type: string;
    costPerUnit: {
      amount: number;
      currency: string;
    };
  }[];
};

export default class ProjectContract extends BaseModel<
  ProjectContract,
  Membership
> {
  teamId: string;
  projectId: string;
  version: number;
  date: string;
  startDate: string;
  deadline: string;
  budget: {
    amount: number;
    currency: string;
  };
  roles: ProjectContractRole[];
  history: any[];
  isDeleted: boolean;
  constructor(data: any = {}) {
    super(data._id);
    this.teamId = data.teamId;
    this.projectId = data.projectId;
    this.version = data.version ?? 1;
    this.date = data.date ?? "";
    this.startDate = data.startDate ?? null;
    this.deadline = data.deadline ?? null;
    this.budget = data.budget ?? { amount: 0, currency: "USD" };
    this.roles = data.roles ?? [];
    this.history = data.history ?? [];
    this.isDeleted = data.isDeleted ?? false;
  }

  update(data: Partial<ProjectContract>, membership: Membership) {
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
    return `Contract ${this.version} from ${this.date} `;
  }
}
