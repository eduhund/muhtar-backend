import { v4 as uuidv4 } from "uuid";

import Service from "./Service";
import User from "../models/User";

export default class UserService extends Service {
  constructor(adapter: any, collection: string) {
    super(adapter, collection);
  }
  async createUser(data: any) {
    const existingUser = await this.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const user = new User({
      _id: uuidv4(),
      _password: data.password,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date(),
      isBatch: false,
    });

    user.saveChanges();

    return user;
  }

  async createBatchUser(data: any) {
    const existingUser = await this.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const user = new User({
      _id: uuidv4(),
      _password: null,
      email: data.email,
      firstName: null,
      lastName: null,
      createdAt: null,
      isBatch: true,
    });

    user.saveChanges();

    return user;
  }

  async getUserById(_id: string) {
    const data = await this._findOne({ _id });
    return data ? new User(data) : null;
  }

  async getUserByEmail(email: string) {
    const data = await this._findOne({ email });
    return data ? new User(data) : null;
  }

  async getUsersByIds(Ids: string[]) {
    const data = await this._findMany({ _id: { $in: Ids } });
    return data.map((user: any) => new User(user));
  }

  async findAllUsers() {
    const data = await this._findMany({});
    return data.map((user: any) => new User(user));
  }

  async getUserCredentials(userId: string) {
    const user = await this.getUserById(userId);
    if (!user) throw new Error("User not found");
    return { password: user.getPassword() };
  }
}
