import { v7 as uuidv7 } from "uuid";

import Service from "./Service";
import User from "../models/User";
import { createHash } from "../utils/hash";

type NewUserParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type NewBatchUserParams = {
  email: string;
};

export default class UserService extends Service {
  constructor(adapter: any, collection: string) {
    super(adapter, collection);
  }
  async create(data: NewUserParams) {
    const existingUser = await this.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPassword = createHash(data.password);
    const user = new User({
      _id: uuidv7(),
      _password: hashedPassword,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date(),
      isBatch: false,
    });
    await this._create(user);
    return user;
  }

  async createBatch(data: NewBatchUserParams) {
    const existingUser = await this.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const user = new User({
      _id: uuidv7(),
      _password: null,
      email: data.email,
      firstName: null,
      lastName: null,
      createdAt: null,
      isBatch: true,
    });
    await this._create(user);
    return user;
  }

  async save(user: User) {
    await this._update(user.getId(), user);
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
    return user.getPassword();
  }
}
