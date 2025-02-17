import mongoose from "mongoose";
import cors from "cors";
import { env } from "./env.js";
import bcrypt from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";
import UserModel from "./models/user-model.js";
import express from "express";

const app = express();

const PORT = env.PORT || 3333;

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Dados ausentes." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = createId();

  const newUser = {
    id,
    name,
    email,
    password: hashedPassword,
  };

  const userCreated = await UserModel.create(newUser);

  return res
    .status(201)
    .json({ message: "Usuário criado com sucesso.", userCreated });
});

app.get("/", (_, res) => {
  return res.json({ message: "Hello, World!" });
});

const URI = `${env.MONGO_DB_URI}${env.MONGO_DB_NAME}${env.MONGO_DB_PARAMS}`;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connect to the MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connect error:", err);
  });
