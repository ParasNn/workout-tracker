import React, { useState } from 'react';
import axios from 'axios';


function GPT() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    return (
        <>
            <h2>Chat with GPT</h2>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message here..."
                rows="4"
                cols="50"
            />
            <br />
            <button
                onClick={async () => {
                    try {
                        const res = await axios.post('http://localhost:8020/api/chat', { prompt });
                        setResponse(res.data.content);
                    } catch (error) {
                        console.error("Error fetching response:", error);
                        setResponse("Failed to fetch response from OpenAI");
                    }
                }}
            >
                Send
            </button>
            <div>
                <h3>Response:</h3>
                <div
                    style={{
                        minHeight: "80px",
                        maxHeight: "250px", // set max height
                        overflowY: "auto",  // make scrollable
                        background: "rgba(255, 255, 255, 0)", // transparent background
                        color: "#e0e0e0",
                        borderRadius: "3px",
                        padding: "0.5em",
                        marginTop: "0.5em",
                        marginBottom: "1.5em", // add spacing below the box
                        border: "1px solid rgb(150, 150, 150)", // light gray outline with specified RGB
                        fontFamily: "inherit",
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {response}
                </div>
            </div>
        </>
    );
}

export default GPT;