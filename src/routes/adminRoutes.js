import express from "express";
import Adm from "../models/adm.js";
import bcryptjs from "bcryptjs";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rota para autenticação do administrador
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o email existe
    const admin = await Adm.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcryptjs.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Gerar token aleatório
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Definir data de expiração (1 dia)
    const tokenExpiration = new Date();
    tokenExpiration.setDate(tokenExpiration.getDate() + 1);

    // Salvar token e data de expiração
    admin.token = token;
    admin.tokenExpiration = tokenExpiration;
    await admin.save();

    // Autenticação bem-sucedida
    res.json({
      message: "Autenticação bem-sucedida",
      admin: {
        id: admin._id,
        email: admin.email,
      },
      token: token,
      expiresIn: tokenExpiration,
    });
  } catch (error) {
    console.error("Erro na autenticação:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para obter todos os administradores (protegida)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await Adm.find().select("-password -token -tokenExpiration");
    res.json(users);
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Rota para criar novo administrador (protegida)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Verificar se já existe admin com esse email
    const existingAdm = await Adm.findOne({ email });
    if (existingAdm) {
      return res.status(400).json({ error: "Administrador já existe" });
    }

    // Criptografar senha
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Criar admin
    const newAdm = new Adm({
      email,
      password: hashedPassword,
    });

    await newAdm.save();

    res.status(201).json({
      id: newAdm._id,
      email: newAdm.email,
    });
  } catch (error) {
    console.error("Error creating admin:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Rota para atualizar um administrador (protegida)
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    // Preparar objeto de atualização
    const updateData = {};
    if (email) updateData.email = email;

    // Se a senha foi fornecida, criptografá-la
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      updateData.password = await bcryptjs.hash(password, salt);
    }

    const updatedAdm = await Adm.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedAdm) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Retornar o admin atualizado sem a senha
    res.json({
      id: updatedAdm._id,
      email: updatedAdm.email,
    });
  } catch (error) {
    console.error("Error updating admin:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Rota para logout (protegida)
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // Limpar o token do administrador atual
    req.admin.token = null;
    req.admin.tokenExpiration = null;
    await req.admin.save();

    res.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Erro no logout:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para deletar um administrador (protegida)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdm = await Adm.findByIdAndDelete(id);
    if (!deletedAdm) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
