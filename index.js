import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("studentDB");
const students = db.collection("students");

// ➕ Add student
app.post("/students", async (req, res) => {
  const { name, email, phone, studentId } = req.body;
  if (!name || !email || !phone || !studentId) {
    return res.status(400).json({ message: "All fields required" });
  }

  const result = await students.insertOne({ name, email, phone, studentId });
  res.status(201).json(result);
});

// 📋 Get all students
app.get("/students", async (req, res) => {
  const allStudents = await students.find().toArray();
  res.json(allStudents);
});

// ✏️ Update student
app.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, studentId } = req.body;

  await students.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, email, phone, studentId } }
  );
  res.json({ message: "Student updated" });
});

// ❌ Delete student
app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;
  await students.deleteOne({ _id: new ObjectId(id) });
  res.json({ message: "Student deleted" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT);
});
