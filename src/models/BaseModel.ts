import { adapter } from "../connectors/MongoDB";
import { getBinaryUUID } from "../utils/id";

export default class BaseModel {
  [key: string]: any;
  _dbAdapter: any;
  _collection: string;
  _id: string;
  constructor(_id: string, collection: string) {
    this._dbAdapter = adapter;
    this._collection = collection;
    this._id = _id;
  }

  getId() {
    return this._id;
  }

  async _save(update: any) {
    return this._dbAdapter.update(
      this._collection,
      getBinaryUUID(this._id),
      update
    );
  }

  async saveChanges(params?: any) {
    if (!params) return this._save(this.toJSON());
    if (typeof params === "string")
      return this._save({ [params]: this[params] });
    if (Array.isArray(params)) {
      const update: Record<string, any> = {};
      for (const param of params) {
        update[param] = this[param];
      }
      return this._save(update);
    }
    return this;
  }

  toJSON() {
    const result: Record<string, any> = {};
    for (const key of Object.keys(this)) {
      if (!key.startsWith("_") && typeof this[key] !== "function") {
        result[key] = this[key];
      }
    }
    return result;
  }

  toPublicJSON() {
    const result = this.toJSON();
    result.id = this._id;
    return result;
  }
}
