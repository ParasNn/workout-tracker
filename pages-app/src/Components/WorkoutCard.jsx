import React, { useState } from "react";

function WorkoutCard({ initialDate = "", initialExercises = [], editing, onEdit, onDone, onDelete, onSave }) {
    const [date, setDate] = useState(initialDate);
    const [exercises, setExercises] = useState(initialExercises);

    const handleExerciseChange = (idx, field, value) => {
        setExercises(exs =>
            exs.map((ex, i) =>
                i === idx ? { ...ex, [field]: value } : ex
            )
        );
    };

    const addExercise = () => {
        setExercises([...exercises, { name: "", weight: "", sets: "", reps: "" }]);
    };

    const removeExercise = (idx) => {
        setExercises(exs => exs.filter((_, i) => i !== idx));
    };

    return (
        <div
            style={{
                background: "rgba(40,40,40,0.9)",
                border: "1px solid #888",
                borderRadius: "10px",
                padding: "1em",
                margin: "1em 0",
                minWidth: "320px",
                color: "#e0e0e0",
                cursor: editing ? "default" : "pointer",
                position: "relative"
            }}
            onClick={() => !editing && onEdit && onEdit()}
        >
            {/* X button in top right to delete the card, only visible in edit mode */}
            {editing && typeof onDelete === "function" && (
                <button
                    onClick={e => { e.stopPropagation(); onDelete(); }}
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
                    title="Delete card"
                >
                    ×
                </button>
            )}
            {editing ? (
                <>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        style={{
                            background: "#23272a",
                            color: "#e0e0e0",
                            border: "1px solid #888",
                            borderRadius: "5px",
                            padding: "0.3em",
                            marginBottom: "1em"
                        }}
                    />
                    <div>
                        {exercises.map((ex, idx) => (
                            <div key={idx} style={{ marginBottom: "0.7em", display: "flex", gap: "0.5em", alignItems: "center" }}>
                                <input
                                    type="text"
                                    placeholder="Exercise"
                                    value={ex.name}
                                    onChange={e => handleExerciseChange(idx, "name", e.target.value)}
                                    style={{ width: "100px" }}
                                />
                                <input
                                    type="number"
                                    placeholder="Weight"
                                    value={ex.weight}
                                    onChange={e => handleExerciseChange(idx, "weight", e.target.value)}
                                    style={{ width: "70px" }}
                                />
                                <input
                                    type="number"
                                    placeholder="Sets"
                                    value={ex.sets}
                                    onChange={e => handleExerciseChange(idx, "sets", e.target.value)}
                                    style={{ width: "50px" }}
                                />
                                <input
                                    type="number"
                                    placeholder="Reps"
                                    value={ex.reps}
                                    onChange={e => handleExerciseChange(idx, "reps", e.target.value)}
                                    style={{ width: "50px" }}
                                />
                                <button
                                    onClick={() => removeExercise(idx)}
                                    style={{
                                        background: "#a33",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "3px",
                                        cursor: "pointer",
                                        fontSize: "0.8em",
                                        width: "22px",
                                        height: "22px",
                                        padding: "0",
                                        lineHeight: "1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button onClick={addExercise} style={{ background: "#333", color: "#fff", border: "none", borderRadius: "5px", padding: "0.3em 1em", marginTop: "0.5em", cursor: "pointer" }}>Add Exercise</button>
                    </div>
                    <div style={{ marginTop: "1em" }}>
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                if (onSave) onSave(date, exercises);
                            }}
                            style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: "5px", padding: "0.4em 1.2em", cursor: "pointer" }}
                        >
                            Done
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div style={{ fontWeight: "bold", fontSize: "1.1em" }}>{date || "No Date"}</div>
                    <ul style={{ margin: "0.7em 0 0 0", padding: 0, listStyle: "none" }}>
                        {exercises.length === 0 && <li style={{ color: "#aaa" }}>No exercises</li>}
                        {exercises.map((ex, idx) => (
                            <li key={idx} style={{ marginBottom: "0.3em" }}>
                                <span style={{ fontWeight: "bold" }}>{ex.name || "Exercise"}</span>
                                {ex.weight && <> | <span>Weight: {ex.weight}</span></>}
                                {ex.sets && <> | <span>Sets: {ex.sets}</span></>}
                                {ex.reps && <> | <span>Reps: {ex.reps}</span></>}
                            </li>
                        ))}
                    </ul>
                    <div style={{ color: "#888", fontSize: "0.9em", marginTop: "0.7em" }}>(Click to edit)</div>
                </>
            )}
        </div>
    );
}

export default WorkoutCard;