import { MongoClient } from "mongodb";

import MongoAdapter from "./adapter";
import log from "../../utils/log";

const { DB_URL, DB_NAME } = process.env;

if (!DB_URL || !DB_NAME) {
  throw new Error(
    "Database credentials is not defined. Check DB_URL and DB_NAME env variables"
  );
}

const client = new MongoClient(DB_URL);
const mainDB: any = client.db(DB_NAME);

export const adapter = new MongoAdapter(mainDB);

export async function connect() {
  await client.connect();
  log.info("Connected to database");
}
