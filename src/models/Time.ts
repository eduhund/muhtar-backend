import BaseModel from "./BaseModel";
import Membership from "./Membership";

export default class Time extends BaseModel<Time, Membership> {
  membershipId: string;
  teamId: string;
  projectId: string;
  taskId: string | null;
  ts: number;
  date: string;
  duration: number;
  comment: string;
  history: any[] = [];

  constructor({
    _id,
    membershipId,
    teamId,
    projectId,
    taskId = null,
    ts,
    date,
    duration = 0,
    comment = "",
    isDeleted = false,
    history = [],
  }: any = {}) {
    super(_id);
    this.membershipId = membershipId;
    this.teamId = teamId;
    this.projectId = projectId;
    this.taskId = taskId;
    this.ts = ts;
    this.date = date;
    this.duration = duration;
    this.comment = comment;
    this.isDeleted = isDeleted;
    this.history = history;
  }

  changeProject(projectId: string, membership: Membership) {
    this._update({ projectId }, membership);
    return this;
  }

  changeTaskId(taskId: string | null, membership: Membership) {
    this._update({ taskId }, membership);
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
