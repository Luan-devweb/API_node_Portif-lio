import mongoose from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  // Define se é um site (iframe) ou imagem
  isPreview: {
    type: Boolean,
    required: true,
    default: false, // false = imagem, true = site/iframe
  },

  // Link único (pode ser site ou imagem)
  link: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
