import React from 'react'
import '../css/hostwaitinglobby.css';
import settingsImg from '../images/settings.svg';
import endGameImg from '../images/end_game.svg';
import pauseTimerImg from '../images/pause_timer.svg'
import nextRoundImg from '../images/next_round.svg';
import ImageInput from '../components/ImageInput';
import Send from "../images/send.svg";

const HostWaitingLobby = () => {
    return (
        <section className="hostWaitingLobby">
            <div className="end_settings">
                <img src={settingsImg} alt="" className="settings" />
                <img src={endGameImg} className="endGame" alt="" />
            </div>
            <div className="timer_round">
                <p>01:30</p>
                <p>Round 2</p>
            </div>
            <div className="pauseTimer_nextRound">
                <img src={pauseTimerImg} alt="" />
                <img src={nextRoundImg} alt="" />
            </div>
            <div className="players">
                <h2 className="mainWord">Main Word</h2>
                <div className="join">
                    <span className="teamNameBlue">Team Name (E)</span>
                    <div className="teams">
                        <h3>Waiting for players to enter their words!</h3>
                        <div className="allPlayers">
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                            <div className="player">
                                <p>Player</p>
                                <div className="answered"></div>
                            </div>
                        </div>
                        <div className="msgInput">
                           <ImageInput text="Enter your message" />
                           <img src={Send} alt="send" className="pointSend" />
                        </div>
                    </div>
                    <span className="teamNameRed">Team Name (G)</span>
                </div>
            </div>
        </section>
    )
}

export default HostWaitingLobby
