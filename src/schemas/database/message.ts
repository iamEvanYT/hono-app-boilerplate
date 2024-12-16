import Mongoose, { Schema } from "mongoose";

// Schema
const schema = new Schema({
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
schema.index({ userId: -1 }, { name: "userId" });
schema.index({ createdAt: -1 }, { name: "createdAt" });

// Model
const model = Mongoose.model("Message", schema);
export default model;
