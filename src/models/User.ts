import BaseModel from "./BaseModel";
import { createHash } from "../utils/hash";

export default class User extends BaseModel<User, User> {
  firstName: string;
  lastName: string;
  email: string;
  _password: { hash: string; salt: string } | null;
  createdAt: Date;
  activeTeamId: string;
  isBatch: boolean;
  constructor(data: any) {
    super(data._id);
    this.firstName = data.firstName ?? "";
    this.lastName = data.lastName ?? "";
    this.email = data.email ?? "";
    this._password = data._password ?? null;
    this.createdAt = data.createdAt ?? new Date();
    this.activeTeamId = data.activeTeam ?? null;
    this.isBatch = data.isBatch ?? false;
  }

  getPassword() {
    return this._password;
  }

  getFullName() {
    let fullName = this.firstName;
    if (this.lastName) {
      fullName += ` ${this.lastName}`;
    }
    return fullName;
  }

  changeEmail(email: string) {
    this._update({ email }, this);
    return this;
  }

  changeName({
    firstName,
    lastName,
  }: {
    firstName?: string;
    lastName?: string;
  }) {
    this._update({ firstName, lastName }, this);
    return this;
  }

  async changePassword(password: string) {
    const hashedPassword = createHash(password);
    this._update({ _password: hashedPassword }, this);
    return this;
  }

  async setActiveTeam(teamId: string) {
    this._update({ activeTeamId: teamId }, this);
    return this;
  }
}
