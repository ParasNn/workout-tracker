import datetime
from pymongo import MongoClient, ReturnDocument
import sys
import json

def create_empty_workout_card_in_mongodb(date=None, mongo_uri="mongodb://localhost:27017/", db_name="workoutsdb"):
    if date is None:
        date = datetime.date.today().isoformat()
    workout = {
        "date": date,
        "exercises": []
    }
    client = MongoClient(mongo_uri)
    db = client[db_name]
    result = db.workouts.insert_one(workout)
    workout["_id"] = str(result.inserted_id)
    client.close()
    return workout


def add_exercise_to_workout(date, exercise_name, sets, reps, weight, mongo_uri="mongodb://localhost:27017/", db_name="workoutsdb"):
    client = MongoClient(mongo_uri)
    db = client[db_name]
    exercise = {
        "name": exercise_name,
        "sets": str(sets),
        "reps": str(reps),
        "weight": str(weight)
    }
    result = db.workouts.find_one_and_update(
        {"date": date},
        {"$push": {"exercises": exercise}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    if result and "_id" in result:
        result["_id"] = str(result["_id"])
    client.close()
    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 create_workouts.py create_empty_workout_card_in_mongodb [date]")
        print("  python3 create_workouts.py add_exercise_to_workout <date> <exercise_name> <sets> <reps> <weight>")
        sys.exit(1)

    func = sys.argv[1]
    if func == "create_empty_workout_card_in_mongodb":
        date = sys.argv[2] if len(sys.argv) > 2 else None
        result = create_empty_workout_card_in_mongodb(date)
        print(json.dumps(result, indent=2))
    elif func == "add_exercise_to_workout":
        if len(sys.argv) < 7:
            print("Not enough arguments for add_exercise_to_workout")
            sys.exit(1)
        date, exercise_name, sets, reps, weight = sys.argv[2:7]
        result = add_exercise_to_workout(date, exercise_name, sets, reps, weight)
        print(json.dumps(result, indent=2, default=str))
    else:
        print("Unknown function:", func)
        sys.exit(1)

