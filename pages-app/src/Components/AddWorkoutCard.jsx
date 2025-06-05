import React from "react";

function AddWorkoutCard({ onAdd }) {
    // Get today's date in yyyy-mm-dd format
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    return (
        <button
            onClick={() => onAdd({ date: formattedDate, exercises: [] })}
            style={{
                border: "2px dashed #888",
                borderRadius: "10px",
                width: "60px",
                height: "60px",
                fontSize: "2em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.6em",
                marginTop: "0.3 em",
            }}
            title="Add Workout"
        >
            +
        </button>
    );
}

export default AddWorkoutCard;