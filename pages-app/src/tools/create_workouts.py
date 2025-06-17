import datetime
from pymongo import MongoClient, ReturnDocument
import sys
import json


def create_full_workout(date, exercise_names, sets_list, reps_list, weights_list, mongo_uri="mongodb://localhost:27017/", db_name="workoutsdb"):
    """
    Adds multiple exercises to the workout with the given date in MongoDB.
    All exercise-related arguments should be lists of the same length.
    """
    client = MongoClient(mongo_uri)
    db = client[db_name]
    exercises = []
    for name, sets, reps, weight in zip(exercise_names, sets_list, reps_list, weights_list):
        exercises.append({
            "name": name,
            "sets": str(sets),
            "reps": str(reps),
            "weight": str(weight)
        })
    result = db.workouts.find_one_and_update(
        {"date": date},
        {"$push": {"exercises": {"$each": exercises}}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    if result and "_id" in result:
        result["_id"] = str(result["_id"])
    client.close()
    return result


if __name__ == "__main__":
    # Example usage:
    # python3 create_workouts.py 2025-06-18 '["Bench Press","Squat"]' '[3,3]' '[8,8]' '[135,185]'
    if len(sys.argv) < 6:
        print("Usage: python3 create_workouts.py <date> <exercise_names_json> <sets_json> <reps_json> <weights_json>")
        sys.exit(1)
    date = sys.argv[1]
    exercise_names = json.loads(sys.argv[2])
    sets_list = json.loads(sys.argv[3])
    reps_list = json.loads(sys.argv[4])
    weights_list = json.loads(sys.argv[5])
    result = create_full_workout(date, exercise_names, sets_list, reps_list, weights_list)
    print(json.dumps(result, indent=2, default=str))

