import express from "express";
import Project from "../models/projects.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, description, isPreview, link } = req.body;
    const project = new Project({
      name,
      description,
      isPreview,
      link,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    // Mapeia _id -> id
    const formattedProjects = projects.map((project) => ({
      id: project._id, // 🔹 cria id
      name: project.name,
      description: project.description,
      isPreview: project.isPreview,
      link: project.link,
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isPreview, link } = req.body;
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, isPreview, link },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
