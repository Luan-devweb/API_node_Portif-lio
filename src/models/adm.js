import mongoose from "mongoose";

const admSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: {
    type: String,
    default: null
  },
  tokenExpiration: {
    type: Date,
    default: null
  }
});

export default mongoose.model("Adm", admSchema);
