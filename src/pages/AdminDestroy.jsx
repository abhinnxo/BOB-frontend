import React, { useState } from "react";
// import '../css/hostwaitinglobby.css';
import "../css/admindestroy.css";
import settingsImg from "../images/settings.svg";
import endGameImg from "../images/end_game.svg";
import pauseTimerImg from "../images/pause_timer.svg";
import nextRoundImg from "../images/next_round.svg";
import destroyButton from "../images/destroy_button.svg";

const AdminDestroy = ({ socket }) => {
  const [bluearr, setBluearr] = useState(['word1', 'word2']);
  const [redarr, setRedarr] = useState(['word3', 'word4']);
  const [round, setRound] = useState(1);
  const [guessingArr, setGuessingArr] = useState(round%2==0?redarr:bluearr);
  const [guessingTeam, setGuessingTeam] = useState(round%2==0?'red':'blue');
  //round%2==0?redisguessing:blue
  //remove enemy team checkboxes
  const destroyWords = () => {
    alert(`Are you sure you wants to destroy these words ${guessingArr}`);
    let allWords = document.querySelectorAll('.guessingTeam>input');
    allWords.forEach(word => {
        if(word.checked){
            setGuessingArr(guessingArr.filter(item=>word.value===item?null:item));
        }
    });
    // console.log(guessingArr);
  }

//   socket.on("Team-BlueWordList", (bluearr) => {
//     console.log(bluearr);
//     setBluearr(bluearr);
//   });

//   socket.on("Team-RedWordList", (redarr) => {
//     setRedarr(redarr);
//   });


  return (
    <section className="hostWaitingLobby">
      <div className="admindestroy__bg"></div>
      <div className="end_settings">
        <img src={settingsImg} alt="" className="settings" />
        <img src={endGameImg} className="endGame" alt="" />
      </div>
      <div className="timer_round">
        <p>01:30</p>
        <p>Round {round}</p>
      </div>
      <div className="pauseTimer_nextRound">
        <img src={pauseTimerImg} alt="" />
        <img src={nextRoundImg} alt="" />
      </div>
      <div className="players">
        <h2 className="mainWord">Main Word</h2>
        <div className="join">
          <span className="teamNameBlue">Team Blue</span>
          <div className="seperateBoard">
            <h4>Select the similar word and destroy them</h4>
            <div className="team">
              {/* Blue Team Words */}
              <div className="eachTeam">
                {bluearr.map((word) => {
                  return (
                    <div className={`word ${guessingTeam==='blue' ? 'guessingTeam' : ''}`}>
                      <label for={word}>{word}</label>
                      <input type="checkbox" name={word} id={word} value={word} />
                    </div>
                  );
                })}
              </div>
              {/* Red Team words*/}
              <div className="eachTeam">
                {redarr.map((word) => {
                  return (
                    <div className={`word ${guessingTeam==='red' ? 'guessingTeam' : ''}`}>
                      <label for={word}>{word}</label>
                      <input type="checkbox" name={word} id={word} value={word} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="destroyButton" onClick={()=>destroyWords()}>
              <img src={destroyButton} alt="" />
            </div>
          </div>
          <span className="teamNameRed">Team Red</span>
        </div>
      </div>
    </section>
  );
};

export default AdminDestroy;
