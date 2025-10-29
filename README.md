# Workout Tracker with OpenAI Integration

A full-stack workout tracking application that uses React, Node.js, MongoDB, and OpenAI's GPT API to help users plan and track their workouts.

## Features

-  Track workouts with exercises, sets, reps, and weights
-  AI-powered workout planning using OpenAI's GPT API
-  Persistent storage using MongoDB
-  Interactive UI built with React and Vite
-  Responsive design with mobile support

## Tech Stack

- **Frontend**: React 18, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Integration**: OpenAI GPT-4 API
- **State Management**: React Hooks
- **Routing**: React Router v6

## Project Structure

```
pages-app/
├── src/
│   ├── Components/          # Reusable React components
│   │   ├── AddWorkoutCard  # Add new workouts
│   │   ├── GPT            # OpenAI chat interface
│   │   ├── Navbar         # Navigation component
│   │   └── WorkoutCard    # Workout display component
│   ├── Pages/             # Application pages
│   │   ├── About         # About page
│   │   ├── ChatBot       # AI chat interface
│   │   ├── Home          # Landing page
│   │   └── Workouts      # Workout management
│   └── tools/            # Backend tools
│       ├── create_workouts.py  # Python workout creation
│       └── schema.js          # OpenAI function schemas
├── server.js             # Express backend server
└── mongodb/             # MongoDB data directory
```

## Setup

### Prerequisites

- Node.js v16+
- MongoDB
- Python 3.9+
- OpenAI API key

### Installation

1. **Install dependencies**
```sh
npm install
pip install pymongo
```

2. **Start the application**
```sh
# Start MongoDB
mongod --dbpath ./mongodb/data

# Start backend (new terminal)
node server.js

# Start frontend (new terminal)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8020

## Features

### Workout Management
- Create, view, update, and delete workouts
- Track exercises with sets, reps, and weights
- Organize workouts by date

### AI Integration
- Get workout suggestions from GPT-4
- Natural language interaction for workout planning
- Context-aware responses based on workout history
- Python tool for AI to directly create workouts

### Data Persistence
- MongoDB storage for all workout data
- Automatic synchronization between frontend and backend

### Workout Endpoints
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create a new workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout

### AI Integration Endpoint
- `POST /api/chat` - Interact with OpenAI GPT
  - Accepts natural language prompts
  - Returns AI responses and/or creates workouts
  - Uses workout history for context
  - Supports multiple exercise creation in one request
