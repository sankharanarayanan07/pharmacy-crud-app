const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const path = require("path");

const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./backend/dev.db' });//pointing to db
const prisma = new PrismaClient({ adapter });//client for db operations

const app = express();
const SECRET = "supersecretkey"; 

app.use(cors());//the browser would block the request due to same-origin policy.
app.use(express.json()); //Without it, if a client sends json in the request body, req.body would be undefined

app.use("/uploads", express.static(path.join(__dirname, "uploads")));//it make the uploaded files accessible through /uploads URL path

const uploadsDir = path.join(__dirname, "uploads");//builds the path to your uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),//cb->callback to set the filename
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
  authMiddleware,//middleware to check it is logged in user

  upload.fields([{ name: "profileImage" }, { name: "documentProof" }]),

  async (req, res) => {
    try {
        const { userName, age, contact, drugName, medicineType } = req.body;
        const toPublicPath = (p) => {
          if (!p) return null;                // If no path, return null
          const fname = path.basename(p);     // Extract just the filename from the full path
          return `/uploads/${fname}`;         // Build a public url pointing to /uploads
        };

        const profileImage = toPublicPath(req.files["profileImage"]?.[0]?.path) || null; // it gives the public url like /uploads/17012.png
        const documentProof = toPublicPath(req.files["documentProof"]?.[0]?.path) || null;// it gives the public url like /uploads/mydoc.pdf

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
