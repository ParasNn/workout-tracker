export const create_empty_workout_card_schema = {
    type: "function",
    function: {
        name: "create_empty_workout_card_in_mongodb",
        description: "Create a new workout card with a date and no exercises in MongoDB.",
        parameters: {
            type: "object",
            properties: {
                date: {
                    type: "string",
                    description: "The date of the workout in YYYY-MM-DD format. If not provided, uses today's date."
                }
            },
            required: []
        }
    }
};


export const add_exercise_to_workout_schema = {
    type: "function",
    function: {
        name: "add_exercise_to_workout",
        description: "Add an exercise to a workout on a specific date in MongoDB. If the workout does not exist, it will be created.",
        parameters: {
            type: "object",
            properties: {
                date: {
                    type: "string",
                    description: "The date of the workout in YYYY-MM-DD format."
                },
                exercise_name: {
                    type: "string",
                    description: "The name/type of the exercise."
                },
                sets: {
                    type: "integer",
                    description: "The number of sets for the exercise."
                },
                reps: {
                    type: "integer",
                    description: "The number of reps per set."
                },
                weight: {
                    type: "integer",
                    description: "The weight used for the exercise."
                }
            },
            required: ["date", "exercise_name", "sets", "reps", "weight"]
        }
    }
};