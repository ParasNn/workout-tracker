import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {

    return (
        <>
            <Link to="/"><button>Home</button></Link>
            <span style={{ display: "inline-block", width: "0.5em" }}></span>
            <Link to="/About"><button>About</button></Link>
            <span style={{ display: "inline-block", width: "0.5em" }}></span>
            <Link to="/ChatBot"><button>ChatGPT</button></Link>
        </>
    )
}

export default Navbar;