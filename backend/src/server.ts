import "dotenv/config";
import express from "express";
import { JSONDatabase } from "./database";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

type info = {
  age: number;
  fullName: string;
  educationDegree: string;
};

interface User {
  id: string;
  email: string;
  password: string;
  info: info;
  isVerified: boolean;
}

const app = express();

const db = new JSONDatabase<User>("users.json");

app.use(express.json());

app.post("/api/sign-up", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.sendStatus(400);
  }

  const user = db.getAll().find((u: User) => u.email === email);

  if (user) return res.sendStatus(409);

  const hashPassword = await bcrypt.hash(password, 10);

  const id = uuidv4();

  const newUser: User = {
    id,
    email,
    password: hashPassword,
    info: {
      age: 0,
      fullName: "",
      educationDegree: "",
    },
    isVerified: false,
  };

  if (!process.env.CLIENT_SECRET) {
    throw new Error("Missing CLIENT_SECRET in environment variables");
  }

  const secret = process.env.CLIENT_SECRET;

  jwt.sign(newUser, secret, { expiresIn: "2d" }, (err, token) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    res.json({ token });
  });

  db.addData(newUser);
});

app.post("/api/log-in", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ message: "Email and password is required" });
  }

  const user = db.getAll().find((u: User) => u.email === email);

  if (!user) return res.sendStatus(404);

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    if (!process.env.CLIENT_SECRET) {
      throw new Error("Missing CLIENT_SECRET in environment variables");
    }

    const secret = process.env.CLIENT_SECRET;

    jwt.sign(user, secret, { expiresIn: "2d" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }
      res.json({ token });
    });
  } else {
    res.sendStatus(401);
  }
});

app.listen(5000, () => console.log("Server start on port 5000"));
