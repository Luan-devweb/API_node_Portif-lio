import User from "./models/users.js";
import app from "./server.js";
import express from "express";
const router = express.Router();
router.post("/users", async (req, res) => {
  try {
    const userlog = await User.create(req.body);
    res.json(userlog);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
