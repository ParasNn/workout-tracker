import Navbar from "../Components/Navbar";
import GPT from "../Components/GPT";

function ChatBot() {
    return (
        <div style={{ minHeight: "90vh", maxHeight: "90vh", overflowY: "auto", flexDirection: "column" }}>
            <h1>This is the ChatBot Page</h1>
            <GPT />
            <Navbar />
            <div className="bubbles">
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
            </div>
        </div>
    )
}

export default ChatBot;