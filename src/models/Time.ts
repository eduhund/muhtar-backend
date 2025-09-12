import BaseModel from "./BaseModel";
import Membership from "./Membership";

export default class Time extends BaseModel {
  membershipId: string;
  teamId: string;
  projectId: string;
  subproject: string | null;
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
    subproject = null,
    ts,
    date,
    duration = 0,
    comment = "",
    isDeleted = false,
    history = [],
  }: any = {}) {
    super(_id, "time");
    this.membershipId = membershipId;
    this.teamId = teamId;
    this.projectId = projectId;
    this.subproject = subproject;
    this.ts = ts;
    this.date = date;
    this.duration = duration;
    this.comment = comment;
    this.isDeleted = isDeleted;
    this.history = history;
  }

  update(newData: any, actorMembership: Membership) {
    const cleanData = Object.fromEntries(
      Object.entries(newData).filter(([_, value]) => value !== undefined)
    );
    const changes: { [key: string]: any } = {};

    Object.keys(cleanData).forEach((key) => {
      const oldVal = this[key];
      const newVal = cleanData[key];

      if (oldVal === newVal) return;

      changes[key] = {
        from: oldVal ?? null,
        to: newVal ?? null,
      };
    });

    Object.assign(this, cleanData);
    this.history.push({
      ts: Date.now(),
      action: "update",
      membershipId: actorMembership.getId(),
      changes: changes,
    });
    this._save(this.toJSON());
  }

  changeProject(newProjectId: string) {
    this.projectId = newProjectId;
    this.saveChanges("projectId");
    return this;
  }

  changeSubproject(newSubproject: string | null) {
    this.subproject = newSubproject;
    this.saveChanges("subproject");
    return this;
  }

  changeDate(newDate: string) {
    this.date = newDate;
    this.saveChanges("date");
    return this;
  }

  changeDuration(newDuration: number) {
    this.duration = newDuration;
    this.saveChanges("duration");
    return this;
  }

  changeComment(newComment: string) {
    this.comment = newComment;
    this.saveChanges("comment");
    return this;
  }

  archive(actorMembership: Membership) {
    Object.assign(this, { isDeleted: true });
    this.history.push({
      ts: Date.now(),
      action: "archive",
      membershipId: actorMembership.getId(),
    });

    return this._save(this.toJSON());
  }

  restore(actorMembership: Membership) {
    Object.assign(this, { isDeleted: false });
    this.history.push({
      ts: Date.now(),
      action: "restore",
      membershipId: actorMembership.getId(),
    });

    return this._save(this.toJSON());
  }
}
