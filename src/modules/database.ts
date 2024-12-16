import { Collection, Db, MongoClient } from "mongodb";
import { DB_ENABLED, dbName, mainCollectionName, mongoUrl } from "./config.js";
import { MainDocument } from "@/types/mainDocument.js";

// Connect to MongoDB
export const client = new MongoClient(mongoUrl);

if (DB_ENABLED) {
  await client.connect();
}

export const database: Db = client.db(dbName);

export const mainCollection: Collection<MainDocument> = database.collection(mainCollectionName);

if (DB_ENABLED) {
  console.log("Connected to MongoDB");
}
