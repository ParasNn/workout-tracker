import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

function About() {
    return (
        <>
            <h1>About</h1>
            <p style={{ margin: "0.2em 0" }}>This is a simple workout tracking app built with React and Node.js.</p>
            <p style={{ margin: "0.2em 0" }}>The OpenAI API is utilized to assist with planning workouts!</p>
            <p style={{ margin: "0.2em 0", marginBottom: "1.5em" }}>Workout information persists with MongoDB!</p>
            <Navbar />
            <div className="bubbles">
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
            </div>
        </>
    )
}

export default About;