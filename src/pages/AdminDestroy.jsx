import React from 'react'
import '../css/hostwaitinglobby.css';
import settingsImg from '../images/settings.svg';
import endGameImg from '../images/end_game.svg';
import pauseTimerImg from '../images/pause_timer.svg'
import nextRoundImg from '../images/next_round.svg';
import destroyButton from '../images/destroy_button.svg';

const AdminDestroy = () => {
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
                    <div className="seperateBoard">
                        <h4>Select the similar word and destroy them</h4>
                        <div className="team">
                            <div className="eachTeam">
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                            </div>
                            <div className="eachTeam">
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                                <div className="word"><span>Word</span> <span></span></div>
                            </div>
                        </div>
                        <div className="destroyButton">
                           <img src={destroyButton} alt="" />
                        </div>
                    </div>
                    <span className="teamNameRed">Team Name (G)</span>
                </div>
            </div>
        </section>
    )
}

export default AdminDestroy
