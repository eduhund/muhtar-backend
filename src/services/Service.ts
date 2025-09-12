export default class Service {
  _dbAdapter: any;
  _collection: string | undefined;
  constructor(adapter?: any, collection?: string) {
    this._dbAdapter = adapter;
    this._collection = collection;
  }

  async _findOne(query: any, returns: string[] = []) {
    return this._dbAdapter.findOne(this._collection, query, returns);
  }

  async _findMany(query: any, returns: string[] = []) {
    return this._dbAdapter.findMany(this._collection, query, returns);
  }
}
