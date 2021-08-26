import React, {useEffect} from "react";
import BlueBlock from "../images/blueteam.svg";
import "../css/waitinglobby.css";
import BackButton from "../images/back_button.svg";
import RedBlock from "../images/redteam.svg";
import ImageButton from "../components/ImageButton";
import { useSelector, useDispatch } from 'react-redux'
import { useHistory,useLocation } from "react-router-dom";
import { socket } from "../services/socket";
import { update_team } from "../store/mainstore";

const WaitingLobby = () => {
  const startgame = () => {
    alert("game started...");
  };
  const copyGameCode = () => {
    navigator.clipboard.writeText(localStorage.getItem("roomid"))
  }
  useEffect(() => {
   document.querySelector(".lobby__code").innerHTML = localStorage.getItem("roomid")
  }, [])

  //store
  const mstore = useSelector((state) => state.mainstore)
  const dispatch = useDispatch()
  console.log(mstore)
  const history = useHistory();
  const location = useLocation();
  function teamselection(e){
    socket.emit('guessingTeam', 0);
    dispatch(update_team(e))
    //console.log(location.state)
    history.push({
      pathname: "/play"
    })
  }
  
  return (
    <div className="lobby">
      <div className="bg"></div>
      <div className="lobby__back">
        <img src={BackButton} alt="back" />
      </div>
      <div className="lobby__teamtable">
        <div className="lobby__code" onClick={copyGameCode}></div>
        <input type="button" name="button" className="lobby__redteam" onClick={()=>{teamselection('blue')}}/>
        <img src={RedBlock} alt="" srcset="" />
        <input type="button" name="button" className="lobby__blueteam" onClick={()=>{teamselection('red')}} />
        <img src={BlueBlock} alt="" srcset="" />
        <ImageButton
          clickMe={startgame}
          classlist="lobby__startbtn mx-auto"
          value="START"
        />
      </div>
    </div>
  );
};

export default WaitingLobby;
