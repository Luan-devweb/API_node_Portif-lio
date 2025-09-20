import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; //importar cors
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoute.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

//Middleware para parsear JSON
app.use(express.json());

//Configurar CORS (permite frontend acessar API)
app.use(
  cors({
    origin: "http://localhost:3000", // endereço do seu front
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.PORTIFOLIO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

//Rotas
app.use("/api/adm", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

//Subir servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
