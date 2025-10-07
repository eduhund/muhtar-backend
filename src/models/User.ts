import BaseModel from "./BaseModel";
import { createHash } from "../utils/hash";

export default class User extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  _password: { hash: string; salt: string } | null;
  createdAt: Date;
  isBatch: boolean;
  constructor(data: any) {
    super(data._id, "users");
    this.firstName = data.firstName ?? "";
    this.lastName = data.lastName ?? "";
    this.email = data.email ?? "";
    this._password = data._password ?? null;
    this.createdAt = data.createdAt ?? new Date();
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

  changeEmail(newEmail: string) {
    this.email = newEmail ? newEmail : this.email;
    this.saveChanges("email");
    return this;
  }

  changeName(firstName: string, lastName: string) {
    this.firstName = firstName ? firstName : this.firstName;
    this.lastName = lastName ? lastName : this.lastName;
    this.saveChanges(["firstName", "lastName"]);
    return this;
  }

  async changePassword(newPassword: string) {
    this._password = createHash(newPassword);
    this.saveChanges("_password");
    return this;
  }
}
