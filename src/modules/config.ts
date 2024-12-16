// Load Environment Variables
export const authKey = process.env.AuthKey;
export const port = parseInt(process.env.Port || "3000");
export const environment = process.env.Environment || "Testing";

// Database
export const DB_ENABLED = false;
export const MONGO_URL = process.env.MongoUrl || "mongodb://localhost:27017";
export const DB_NAME = "database";
