const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const path = require("path");

const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });
const app = express();
const SECRET = "supersecretkey"; 

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  const csp = [
    "default-src 'self'",
    "connect-src 'self' http://localhost:5174 http://localhost:4000 ws://localhost:5174 ws://localhost:4000",
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  ].join('; ');
  res.setHeader('Content-Security-Policy', csp);
  next();
});

const uploadsDir = path.join(__dirname, "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, password: hashed } });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

app.post(
  "/api/medicine",
  authMiddleware,
  upload.fields([{ name: "profileImage" }, { name: "documentProof" }]),
  async (req, res) => {
    try {
        const { userName, age, contact, drugName, medicineType } = req.body;
        const toPublicPath = (p) => {
          if (!p) return null;
          const fname = path.basename(p);
          return `/uploads/${fname}`;
        };
        const profileImage = toPublicPath(req.files["profileImage"]?.[0]?.path) || null;
        const documentProof = toPublicPath(req.files["documentProof"]?.[0]?.path) || null;

      const item = await prisma.medicineItem.create({
        data: {
          userName,
          age: parseInt(age),
          contact,
          drugName,
          medicineType,
          profileImage,
          documentProof,
        },
      });
      res.json({ success: true, item });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

app.get("/api/medicine", authMiddleware, async (req, res) => {
  const items = await prisma.medicineItem.findMany();
  res.json(items);
});

app.put(
  "/api/medicine/:id",
  authMiddleware,
  upload.fields([{ name: "profileImage" }, { name: "documentProof" }]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { userName, age, contact, drugName, medicineType } = req.body;
        const toPublicPath = (p) => {
          if (!p) return undefined;
          const fname = path.basename(p);
          return `/uploads/${fname}`;
        };
        const profileImage = toPublicPath(req.files["profileImage"]?.[0]?.path);
        const documentProof = toPublicPath(req.files["documentProof"]?.[0]?.path);

      const item = await prisma.medicineItem.update({
        where: { id: parseInt(id) },
        data: {
          userName,
          age: parseInt(age),
          contact,
          drugName,
          medicineType,
          ...(profileImage && { profileImage }),
          ...(documentProof && { documentProof }),
        },
      });
      res.json({ success: true, item });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

app.delete("/api/medicine/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.medicineItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
