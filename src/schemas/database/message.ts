import Mongoose, { Schema } from "mongoose";

// Schema
type DocumentSchema = {
  userId: number;
  message: string;
  createdAt: Date;
};
const documentSchema = new Schema<DocumentSchema>({
  userId: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
// WARNING: Indexes will NOT be recreated when you update them. You will have to manually drop and recreate the indexes.
documentSchema.index({ userId: -1 }, { name: "userId" });
documentSchema.index({ createdAt: -1 }, { name: "createdAt" });

// Model
const model = Mongoose.model<DocumentSchema>("Message", documentSchema);
export default model;
