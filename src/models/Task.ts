import BaseModel from "./BaseModel";
import Membership from "./Membership";

export default class Task extends BaseModel<Task, Membership> {
  ts: number;
  teamId: string;
  projectId: string;
  name: string;
  assignedMembershipId: string | null;
  jobId: string | null;
  startDate: string | null;
  dueDate: string | null;
  duration: number | null;
  notes: string;
  isDeleted: boolean;
  history: any[] = [];

  constructor({
    _id,
    ts,
    teamId,
    projectId,
    name,
    assignedMembershipId = null,
    jobId = null,
    startDate = null,
    dueDate = null,
    duration = 0,
    notes = "",
    isDeleted = false,
    history = [],
  }: any = {}) {
    super(_id);
    this.ts = ts;
    this.teamId = teamId;
    this.projectId = projectId;
    this.name = name;
    this.assignedMembershipId = assignedMembershipId;
    this.jobId = jobId;
    this.startDate = startDate;
    this.dueDate = dueDate;
    this.duration = duration;
    this.notes = notes;
    this.isDeleted = isDeleted;
    this.history = history;
  }

  update(data: Partial<Task>, membership: Membership) {
    this._update(data, membership);
    return this;
  }

  rename(name: string, membership: Membership) {
    this._update({ name }, membership);
    return this;
  }

  changeNotes(notes: string, membership: Membership) {
    this._update({ notes }, membership);
    return this;
  }

  changeProject(projectId: string, membership: Membership) {
    this._update({ projectId }, membership);
    return this;
  }

  changeAssignedMembership(
    assignedMembershipId: string,
    membership: Membership
  ) {
    this._update({ assignedMembershipId }, membership);
    return this;
  }

  changeJob(jobId: string | null, membership: Membership) {
    this._update({ jobId }, membership);
    return this;
  }

  changeStartDate(startDate: string | null, membership: Membership) {
    this._update({ startDate }, membership);
    return this;
  }

  changeDueDate(dueDate: string | null, membership: Membership) {
    this._update({ dueDate }, membership);
    return this;
  }

  changeDuration(duration: number, membership: Membership) {
    this._update({ duration }, membership);
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
