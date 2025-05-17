import parasPic from './assets/banner.png'
import oreoPic from './assets/oreo.jpeg'
import Card from './Card.jsx'

function App() {

    return (
        <>
            <Card name="Paras Nijhawan" profilePic={parasPic} text="I'm learning react" />
            <Card name="Oreo" profilePic={oreoPic} text="I'm a dog" />
        </>

    );
}

export default App
