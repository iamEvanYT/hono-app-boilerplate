import { DB_NAME, DB_ENABLED, MONGO_URL } from "./config.js";
import MessageModel from "@/schemas/database/message.js";
import mongoose from "mongoose";

// Connect to MongoDB
if (DB_ENABLED) {
  await mongoose.connect(MONGO_URL, {
    dbName: DB_NAME
  });
}

export const Message = MessageModel;

if (DB_ENABLED) {
  console.log("Connected to MongoDB");
}
