import { getProjection } from "./utils";

export default class MongoAdapter {
  db: any;

  constructor(db: string) {
    this.db = db;
  }

  async findOne(collection: string, query: any, returns: string[]) {
    return this.db.collection(collection).findOne(query, {
      projecion: getProjection(returns),
    });
  }

  async findMany(collection: string, query: any, returns: string[]) {
    return this.db
      .collection(collection)
      .find(query, {
        projecion: getProjection(returns),
      })
      .toArray();
  }

  async insert(collection: string, doc: any) {
    await this.db.collection(collection).insertOne(doc);
  }

  async update(collection: string, _id: string, update: any) {
    await this.db
      .collection(collection)
      .updateOne({ _id }, { $set: update }, { upsert: true });
  }

  async delete(collection: string, _id: string) {
    await this.db.collection(collection).deleteOne({ _id });
  }
}
