import profilePic from './assets/banner.png'

function Card() {
    return (
        <div className="card">
            <img className="card-image" src={profilePic} alt="profile picture"></img>
            <h2 className="card-title">Paras Nijhawan</h2>
            <p className="card-text">I'm learning react</p>
        </div>
    );

}

export default Card;