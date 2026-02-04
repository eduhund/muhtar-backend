import BaseModel from "./BaseModel";
import Membership from "./Membership";

export default class WorkRole extends BaseModel<WorkRole, Membership> {
  teamId: string;
  name: string;
  description?: string;
  baseRate: {
    currency: string;
    amount: number;
  };
  isDeleted: boolean;
  history: any[] = [];

  constructor({
    _id,
    teamId,
    name,
    description,
    baseRate,
    isDeleted = false,
    history = [],
  }: any = {}) {
    super(_id);
    this.teamId = teamId;
    this.name = name;
    this.description = description;
    this.baseRate = baseRate;
    this.isDeleted = isDeleted;
    this.history = history;
  }

  update(data: Partial<WorkRole>, membership: Membership) {
    this._update(data, membership);
    return this;
  }

  rename(name: string, membership: Membership) {
    this._update({ name }, membership);
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
}
