import Adm from "../models/adm.js";

// Middleware para verificar se o token é válido
export const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Verifica se veio o Authorization no formato correto: "Bearer token"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Procura admin com este token
    const admin = await Adm.findOne({ token });
    if (!admin) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // ✅ Verifica expiração do token
    if (admin.tokenExpiration && new Date() > new Date(admin.tokenExpiration)) {
      // Limpa token expirado
      admin.token = null;
      admin.tokenExpiration = null;
      await admin.save();

      return res.status(401).json({ error: "Token expirado" });
    }

    // ✅ Tudo certo → passa admin adiante
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Erro na autenticação:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
