import React, { useState, useEffect } from "react";
import WorkoutCard from "../Components/WorkoutCard";
import AddWorkoutCard from "../Components/AddWorkoutCard";
import Navbar from "../Components/Navbar";

function Workouts() {
    const [workouts, setWorkouts] = useState([]);
    const [editingIdx, setEditingIdx] = useState(null);

    // Fetch workouts from backend on mount
    useEffect(() => {
        fetch("http://localhost:8020/api/workouts")
            .then(res => res.json())
            .then(setWorkouts);
    }, []);

    const handleAddWorkout = async ({ date, exercises }) => {
        const res = await fetch("http://localhost:8020/api/workouts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, exercises }),
        });
        const newWorkout = await res.json();
        setWorkouts([...workouts, newWorkout]);
    };

    return (
        <>
            <h1>This is the Workouts Page</h1>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxHeight: "60vh",
                    overflowY: "auto",
                    width: "100%",
                }}
            >
                {workouts.map((w) => (
                    <WorkoutCard
                        key={w._id}
                        initialDate={w.date}
                        initialExercises={w.exercises}
                        editing={editingIdx === w._id}
                        onEdit={() => setEditingIdx(w._id)}
                        onDone={() => setEditingIdx(null)}
                        onDelete={() => {
                            fetch(`http://localhost:8020/api/workouts/${w._id}`, { method: "DELETE" })
                                .then(() => setWorkouts(workouts => workouts.filter(card => card._id !== w._id)));
                            setEditingIdx(null);
                        }}
                        onSave={(updatedDate, updatedExercises) => {
                            fetch(`http://localhost:8020/api/workouts/${w._id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ date: updatedDate, exercises: updatedExercises }),
                            })
                            .then(res => res.json())
                            .then(updatedWorkout => {
                                setWorkouts(workouts =>
                                    workouts.map(card =>
                                        card._id === w._id ? updatedWorkout : card
                                    )
                                );
                                setEditingIdx(null);
                            });
                        }}
                    />
                ))}
                <AddWorkoutCard onAdd={handleAddWorkout} />
            </div>
            <div style={{ marginTop: "1.5em" }}>
                <Navbar />
            </div>
        </>
    );
}

export default Workouts;