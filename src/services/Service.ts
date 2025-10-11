import { getBinaryUUID } from "../utils/id";

export default class Service {
  _dbAdapter: any;
  _collection: string | undefined;
  constructor(adapter?: any, collection?: string) {
    this._dbAdapter = adapter;
    this._collection = collection;
  }

  async _create(data: any) {
    if (!this._collection) throw new Error("Collection not defined");
    if (!data._id) data._id = getBinaryUUID();
    await this._dbAdapter.insert(this._collection, data);
    return data;
  }

  async _findOne(query: any, returns: string[] = []) {
    return this._dbAdapter.findOne(this._collection, query, returns);
  }

  async _findMany(query: any, returns: string[] = []) {
    return this._dbAdapter.findMany(this._collection, query, returns);
  }

  async _update(id: string, update: any) {
    return this._dbAdapter.update(this._collection, getBinaryUUID(id), update);
  }
}
