import { v4 as uuidv7 } from "uuid";

import Service from "./Service";
import ApiKey, { ApiKeyParams } from "../models/ApiKey";

export default class ApiKeyService extends Service {
  constructor(adapter: any, collection: string) {
    super(adapter, collection);
  }
  async createApiKey(data: ApiKeyParams) {
    const apiKey = new ApiKey({
      ...data,
      _id: uuidv7(),
    });
    return apiKey;
  }

  async findApiKey(id: string) {
    const data = await this._findOne({ _id: id });
    if (!data) {
      return null;
    }
    return new ApiKey(data);
  }
}
