import "dotenv/config";
import express from "express";
import { JSONDatabase } from "./database";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import cors from "cors";

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

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

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

  jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
      info: newUser.info,
      isVerified: newUser.isVerified,
    },
    secret,
    { expiresIn: "2d" },
    (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }
      res.json({ token });
    }
  );

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

    jwt.sign(
      {
        id: user.id,
        email: user.email,
        info: user.info,
        isVerified: user.isVerified,
      },
      secret,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }
        res.json({ token });
      }
    );
  } else {
    res.status(401).json({ message: "Email or password incorrect!" });
  }
});

app.put("/api/profile/:userId", async (req, res) => {
  const { authorization } = req.headers;

  const { userId } = req.params;

  if (!authorization) {
    return res.status(401).json({ message: "No token sent" });
  }

  const token = authorization.split(" ")[1];

  const user: User = db.getAll().find((u: User) => u.id === userId);

  if (!user) return res.status(404).json({ messsage: "User not found!" });

  if (!process.env.CLIENT_SECRET) {
    throw new Error("Missing CLIENT_SECRET in environment variables");
  }

  const secret = process.env.CLIENT_SECRET;

  jwt.verify(token, secret, (error, decode) => {
    if (error)
      return res.status(401).json({ message: "Token is not verified!" });

    const { id } = decode as User;

    if (id !== userId)
      return res.status(403).json({ message: "Not Allowed to update!" });

    const { age, fullName, educationDegree } = req.body;

    const updatedInfo = { age, fullName, educationDegree };

    user.info.age = updatedInfo.age || user?.info.age;
    user.info.fullName = updatedInfo.fullName || user?.info.fullName;
    user.info.educationDegree =
      updatedInfo.educationDegree || user?.info.educationDegree;

    jwt.sign(
      {
        id: user.id,
        email: user.email,
        info: user.info,
        isVerified: user.isVerified,
      },
      secret,
      { expiresIn: "2d" },
      (err, token) => {
        if (err) {
          return res.status(500).json({ message: "Server error" });
        }
        res.json({ token });
      }
    );

    db.update(userId, user);
  });
});

app.listen(5000, () => console.log("Server start on port 5000"));
