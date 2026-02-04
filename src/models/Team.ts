import BaseModel from "./BaseModel";
import Membership from "./Membership";

export default class Team extends BaseModel<Team, Membership> {
  name: string;
  isDeleted: boolean;
  connections: Record<string, any>;
  history: any[];
  constructor(data: any = {}) {
    super(data._id);
    this.name = data.name ?? "";
    this.isDeleted = data.isDeleted ?? false;
    this.connections = data.connections ?? {};
    this.history = data.history ?? [];
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
