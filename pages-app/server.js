import 'dotenv/config';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { create_full_workout_schema } from "./src/tools/schema.js";


// Read the workouts.csv file once at startup
const csvPath = path.resolve("src/assets/workouts.csv");
const workoutsCSV = fs.readFileSync(csvPath, "utf-8");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/workoutsdb");

const workoutSchema = new mongoose.Schema({
    date: String,
    exercises: [{ name: String, weight: String, sets: String, reps: String }]
});
const Workout = mongoose.model("Workout", workoutSchema);

app.post("/api/chat", async (req, res) => {
    const { prompt } = req.body;

    let workouts = await Workout.find();

    let csv = "date,exercise,weight,sets,reps\n";
    workouts.forEach(w => {
        w.exercises.forEach(ex => {
            csv += `${w.date},${ex.name || ""},${ex.weight || ""},${ex.sets || ""},${ex.reps || ""}\n`;
        });
    });

    let messages = [
        {
            role: "system",
            content: `Here is the user's workout log in CSV format:\n${csv}\nUse this as context for any questions. 
                    Consider exercises from the same date to be part of the same workout`
        },
        { role: "user", content: prompt }
    ];

    // Only use the new schema
    const tools = [create_full_workout_schema];

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages,
            max_tokens: 512,
            temperature: 0,
            tools,
            tool_choice: "auto"
        });

        const choice = response.choices[0];
        let lastResponse = choice.message;

        if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
            // Only process the first tool call
            const toolCall = choice.message.tool_calls[0];
            let output = "";
            if (toolCall.function.name === "create_full_workout") {
                const parsed = JSON.parse(toolCall.function.arguments);
                const exercises = [];
                for (let i = 0; i < parsed.exercise_names.length; i++) {
                    exercises.push({
                        name: parsed.exercise_names[i],
                        sets: String(parsed.sets_list[i]),
                        reps: String(parsed.reps_list[i]),
                        weight: String(parsed.weights_list[i])
                    });
                }
                // Upsert workout in MongoDB
                const workout = await Workout.findOneAndUpdate(
                    { date: parsed.date },
                    { $push: { exercises: { $each: exercises } } },
                    { upsert: true, new: true }
                );
                output = JSON.stringify(workout);
            }
            // Add the tool result to the conversation
            messages.push({
                role: "assistant",
                content: null,
                tool_calls: [toolCall]
            });
            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                name: toolCall.function.name,
                content: output
            });

            // Get a final message from OpenAI after the tool call
            const summaryResponse = await openai.chat.completions.create({
                model: "gpt-4-1106-preview",
                messages,
                max_tokens: 256,
                temperature: 0
            });
            lastResponse = summaryResponse.choices[0].message;
        }

        res.json(lastResponse);
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