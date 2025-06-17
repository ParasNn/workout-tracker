import 'dotenv/config';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { create_empty_workout_card_schema, add_exercise_to_workout_schema } from "./src/tools/schema.js";
import { spawnSync } from "child_process";


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

    const tools = [
        create_empty_workout_card_schema,
        add_exercise_to_workout_schema
    ];

    try {
        let keepGoing = true;
        let lastResponse = null;

        while (keepGoing) {
            const response = await openai.chat.completions.create({
                model: "gpt-4-1106-preview",
                messages,
                max_tokens: 512,
                temperature: 0,
                tools
            });

            const choice = response.choices[0];
            lastResponse = choice.message;

            if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
                // Add the assistant's tool call message to the conversation
                messages.push({
                    role: "assistant",
                    content: null,
                    tool_calls: choice.message.tool_calls
                });

                // For each tool call, run the function and add the result as a tool message
                for (const toolCall of choice.message.tool_calls) {
                    let output = "";
                    if (toolCall.function.name === "create_empty_workout_card_in_mongodb") {
                        const args = [];
                        if (toolCall.function.arguments) {
                            const parsed = JSON.parse(toolCall.function.arguments);
                            if (parsed.date) args.push(parsed.date);
                        }
                        const pyResult = spawnSync(
                            "python3",
                            ["./src/tools/create_workouts.py", "create_empty_workout_card_in_mongodb", ...args],
                            { encoding: "utf-8" }
                        );
                        if (pyResult.error) throw pyResult.error;
                        output = pyResult.stdout.trim();
                    }
                    if (toolCall.function.name === "add_exercise_to_workout") {
                        const parsed = JSON.parse(toolCall.function.arguments);
                        const args = [
                            parsed.date,
                            parsed.exercise_name,
                            parsed.sets,
                            parsed.reps,
                            parsed.weight
                        ];
                        const pyResult = spawnSync(
                            "python3",
                            ["./src/tools/create_workouts.py", "add_exercise_to_workout", ...args],
                            { encoding: "utf-8" }
                        );
                        if (pyResult.error) throw pyResult.error;
                        output = pyResult.stdout.trim();
                    }
                    // Add the tool result to the conversation
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        name: toolCall.function.name,
                        content: output
                    });
                }
            } else {
                // No more tool calls, get a final message from OpenAI
                if (!lastResponse.content || lastResponse.content.trim() === "") {
                    // If the last response is empty, ask OpenAI for a summary message
                    messages.push({
                        role: "assistant",
                        content: null
                    });
                    messages.push({
                        role: "user",
                        content: "Please summarize what you just did for me."
                    });
                    const summaryResponse = await openai.chat.completions.create({
                        model: "gpt-4-1106-preview",
                        messages,
                        max_tokens: 256,
                        temperature: 0
                    });
                    lastResponse = summaryResponse.choices[0].message;
                }
                keepGoing = false;
            }
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