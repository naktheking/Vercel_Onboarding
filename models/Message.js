import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    message: String,
    person: String
  },
  {timestamps: true}
);

export default mongoose.model("Message", MessageSchema);
