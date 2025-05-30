import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import ChatBot from './Pages/ChatBot'


function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/ChatBot" element={<ChatBot />} />
            </Routes>
        </Router>
    )
}

export default App
