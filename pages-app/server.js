import 'dotenv/config';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";


// Read the workouts.csv file once at startup
const csvPath = path.resolve("src/assets/workouts.csv");
const workoutsCSV = fs.readFileSync(csvPath, "utf-8");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/workoutsdb");

// Define your Workout schema/model
const workoutSchema = new mongoose.Schema({
    date: String,
    exercises: [{ name: String, weight: String, sets: String, reps: String }]
});
const Workout = mongoose.model("Workout", workoutSchema);

app.post("/api/chat", async (req, res) => {
    const { prompt } = req.body;

    // 1. Fetch workouts from MongoDB
    let workouts = await Workout.find();

    // 2. Format workouts as CSV string
    // Header
    let csv = "date,exercise,weight,sets,reps\n";
    // Rows
    workouts.forEach(w => {
        w.exercises.forEach(ex => {
            csv += `${w.date},${ex.name || ""},${ex.weight || ""},${ex.sets || ""},${ex.reps || ""}\n`;
        });
    });

    // 3. Use the CSV as context for the assistant
    const messages = [
        {
            role: "system",
            content: `Here is the user's workout log in CSV format:\n${csv}\nUse this as context for any questions. 
                     Consider exercises from the same date to be part of the same workout`
        },
        { role: "user", content: prompt }
    ];

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            max_tokens: 512,
            temperature: 0,
            messages: messages,
        });

        res.json(response.choices[0].message);
    } catch (error) {
        console.error("Error in OpenAI API call:", error);
        res.status(500).json({ error: "Failed to fetch response from OpenAI" });
    }
});

// Your new MongoDB workout endpoints
app.get("/api/workouts", async (req, res) => {
    const workouts = await Workout.find();
    res.json(workouts);
});

app.post("/api/workouts", async (req, res) => {
    const workout = new Workout(req.body);
    await workout.save();
    res.json(workout);
});

// Update a workout
app.put("/api/workouts/:id", async (req, res) => {
    try {
        const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(workout);
    } catch (err) {
        res.status(400).json({ error: "Failed to update workout" });
    }
});

// Delete a workout
app.delete("/api/workouts/:id", async (req, res) => {
    try {
        await Workout.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: "Failed to delete workout" });
    }
});

const PORT = 8020;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});