export const create_full_workout_schema = {
    type: "function",
    function: {
        name: "create_full_workout",
        description: "Add multiple exercises to a workout on a specific date in MongoDB. If the workout does not exist, it will be created.",
        parameters: {
            type: "object",
            properties: {
                date: {
                    type: "string",
                    description: "The date of the workout in YYYY-MM-DD format."
                },
                exercise_names: {
                    type: "array",
                    items: { type: "string" },
                    description: "A list of exercise names/types."
                },
                sets_list: {
                    type: "array",
                    items: { type: "integer" },
                    description: "A list of set counts for each exercise."
                },
                reps_list: {
                    type: "array",
                    items: { type: "integer" },
                    description: "A list of rep counts for each exercise."
                },
                weights_list: {
                    type: "array",
                    items: { type: "integer" },
                    description: "A list of weights for each exercise."
                }
            },
            required: ["date", "exercise_names", "sets_list", "reps_list", "weights_list"]
        }
    }
};