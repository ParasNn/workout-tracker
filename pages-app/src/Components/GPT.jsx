import React, { useState, useEffect } from 'react';
import axios from 'axios';


function GPT() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState(() => {
        // Load saved response from localStorage on mount
        return localStorage.getItem("gpt_response") || '';
    });

    // Save response to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("gpt_response", response);
    }, [response]);

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
            <div style={{ position: "relative" }}>
                <h3>Response:</h3>
                <div
                    style={{
                        minHeight: "80px",
                        maxHeight: "250px",
                        overflowY: "auto",
                        background: "rgba(255, 255, 255, 0)",
                        color: "#e0e0e0",
                        borderRadius: "3px",
                        padding: "0.5em",
                        marginTop: "0.5em",
                        marginBottom: "1.5em",
                        border: "1px solid rgb(150, 150, 150)",
                        fontFamily: "inherit",
                        whiteSpace: "pre-wrap",
                        position: "relative"
                    }}
                >
                    {/* Clear button styled like WorkoutCard delete button */}
                    <button
                        onClick={() => setResponse("")}
                        style={{
                            position: "absolute",
                            top: "8px",
                            right: "10px",
                            background: "transparent",
                            border: "1px solid #fff",
                            borderRadius: "3px",
                            width: "20px",
                            height: "20px",
                            fontSize: "1em",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                            padding: 0,
                            lineHeight: 1
                        }}
                        title="Clear output"
                    >
                        ×
                    </button>
                    {response}
                </div>
            </div>
        </>
    );
}

export default GPT;