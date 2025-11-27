import BaseModel from "./BaseModel";
import Membership from "./Membership";

export type ResourceTarget = {
  type: "project" | "task";
  id: string;
};

export default class Time extends BaseModel<Time, Membership> {
  membershipId: string;
  teamId: string;
  projectId: string;
  ts: number;
  date: string;
  type: string;
  target: ResourceTarget | null;
  duration: number;
  comment: string;
  history: any[] = [];

  constructor({
    _id,
    membershipId,
    teamId,
    projectId,
    ts,
    date,
    type = "time",
    target = null,
    duration = 0,
    comment = "",
    isDeleted = false,
    history = [],
  }: any = {}) {
    super(_id);
    this.membershipId = membershipId;
    this.teamId = teamId;
    this.projectId = projectId;
    this.ts = ts;
    this.date = date;
    this.type = type;
    this.target = target;
    this.duration = duration;
    this.comment = comment;
    this.isDeleted = isDeleted;
    this.history = history;
  }

  update(data: Partial<Time>, membership: Membership) {
    this._update(data, membership);
    return this;
  }

  changeMembership(membershipId: string, membership: Membership) {
    this._update({ membershipId }, membership);
    return this;
  }

  changeProject(projectId: string, membership: Membership) {
    this._update({ projectId }, membership);
    return this;
  }

  changeDate(date: string, membership: Membership) {
    this._update({ date }, membership);
    return this;
  }

  changeDuration(duration: number, membership: Membership) {
    this._update({ duration }, membership);
    return this;
  }

  changeComment(comment: string, membership: Membership) {
    this._update({ comment }, membership);
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
