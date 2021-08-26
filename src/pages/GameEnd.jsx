import React from 'react'
import { useHistory } from 'react-router'
import ImageButton from '../components/ImageButton'
import "../css/gameend.css"

const GameEnd = () => {

    const history = useHistory();

const gotoMainScreen = () => {
    history.push("/")
}

    return (
        <div>
         <div className="end__text text-center">
         <h3>Team <span>Red</span> Wins</h3>
            <h3>SCORE: <span>500</span></h3>
            <h3>Thank You for paying...</h3>
            <ImageButton value="Go to Main Screen" clickMe={gotoMainScreen} classlist="end__btn" />
         </div>
        </div>
    )
}

export default GameEnd
