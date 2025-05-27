import { Link } from "react-router-dom";

function Navbar() {

    return (
        <>
            <Link to="/"><button>Home</button></Link>
            <Link to="/About"><button>About</button></Link>
            <Link to="/Page1"><button>Page1</button></Link>
        </>
    )
}

export default Navbar;