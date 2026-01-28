import BaseModel from "./BaseModel";
import Membership from "./Membership";

export type BookedResourceTarget = {
  type: "worker" | "role";
  id: string;
};

export default class BookedResource extends BaseModel<
  BookedResource,
  Membership
> {
  teamId: string;
  projectId: string;
  date: string;
  resource: {
    type: "time";
    value: number;
  };
  target: BookedResourceTarget;
  history: any[] = [];

  constructor({
    _id,
    teamId,
    projectId,
    date,
    resource,
    target,
    isDeleted = false,
    history = [],
  }: any = {}) {
    super(_id);
    this.teamId = teamId;
    this.projectId = projectId;
    this.date = date;
    this.resource = resource;
    this.target = target;
    this.isDeleted = isDeleted;
    this.history = history;
  }

  update(data: Partial<BookedResource>, membership: Membership) {
    this._update(data, membership);
    return this;
  }

  changeValue(value: number, membership: Membership) {
    this._update({ resource: { type: this.resource.type, value } }, membership);
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
