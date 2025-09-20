import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: Number,
  description: String,
  status: {
    type: String,
    enum: ["novo", "respondido"],
    default: "novo",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
