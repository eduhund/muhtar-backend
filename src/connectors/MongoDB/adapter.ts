import { Binary } from "mongodb";
import { parse as uuidParse } from "uuid";

import { getProjection } from "./utils";

export function getBinaryString(uuid: string) {
  const uuidBuffer = Buffer.from(uuidParse(uuid));
  return new Binary(uuidBuffer, Binary.SUBTYPE_UUID);
}

function convertIdToBinary(obj: any) {
  if (!obj || typeof obj !== "object") return obj;
  if (typeof obj["_id"] === "string" && /^[0-9a-fA-F-]{36}$/.test(obj["_id"])) {
    obj["_id"] = getBinaryString(obj["_id"]);
  }
  return obj;
}

export default class MongoAdapter {
  db: any;

  constructor(db: string) {
    this.db = db;
  }

  async findOne(collection: string, query: any, returns: string[]) {
    const convertedQuery = convertIdToBinary(query);
    return this.db.collection(collection).findOne(convertedQuery, {
      projection: getProjection(returns),
    });
  }

  async findMany(collection: string, query: any, returns: string[]) {
    const convertedQuery = convertIdToBinary(query);
    return this.db
      .collection(collection)
      .find(convertedQuery, {
        projection: getProjection(returns),
      })
      .toArray();
  }

  async insert(collection: string, doc: any) {
    const convertedDoc = convertIdToBinary({ ...doc });
    await this.db.collection(collection).insertOne(convertedDoc);
  }

  async update(collection: string, _id: string, update: any) {
    const convertedId = getBinaryString(_id);
    await this.db
      .collection(collection)
      .updateOne({ _id: convertedId }, { $set: update }, { upsert: true });
  }

  async delete(collection: string, _id: string) {
    const convertedId = getBinaryString(_id);
    await this.db.collection(collection).deleteOne({ _id: convertedId });
  }
}
