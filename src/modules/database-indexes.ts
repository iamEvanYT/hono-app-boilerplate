import { mainCollection } from "./database.js";
import { emptyHandler } from "./empty-handler.js";

export function createIndexes() {
  // MAIN COLLECTION //
  mainCollection.createIndex({ createdAt: -1 }, { name: "createdAt" }).catch(emptyHandler);
}
