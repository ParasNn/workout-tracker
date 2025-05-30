import 'dotenv/config';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/api/chat", async (req, res) => {
    const { prompt } = req.body;

    const messages = [
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

const PORT = 8020;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});