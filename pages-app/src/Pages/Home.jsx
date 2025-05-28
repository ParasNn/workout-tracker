import './Home.css';
import Navbar from "../Components/Navbar";

function Home() {
    return (
        <>
            <h1>This is the Home Page</h1>
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

export default Home;