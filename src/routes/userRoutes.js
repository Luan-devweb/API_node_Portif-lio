import express from "express";
import User from "../models/users.js";
const router = express.Router();

// Rota para criar um novo usuário
router.post("/", async (req, res) => {
  try {
    const userlog = await User.create(req.body);
    res.json(userlog);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { status: "respondido" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// Rota para obter todos os usuários
router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    // Mapeia _id -> id
    const formattedUsers = users.map((user) => ({
      id: user._id, // 🔹 cria id
      name: user.name,
      email: user.email,
      phone: user.phone,
      description: user.description,
      status: user.status,
      createdAt: user.createdAt,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Rota para atualizar um usuário
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Rota para deletar um usuário
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
