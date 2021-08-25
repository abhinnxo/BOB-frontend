import React from "react";
import ImageButton from "../components/ImageButton";
import ImageInput from "../components/ImageInput";
import BackButton from "../images/back_button.svg"
import "../css/gusser.css";

const Gusser = () => {
  return (
    <div className="gusser">
      <div className="gusser__back"><img src={BackButton} alt="back" srcset="" /></div>
     <div className="gusser__hints">
      <div className="d-flex justify-content-around row1">
        <div>Hint 1</div>
        <div>Hint2 </div>
        <div>Hint 3</div>
      </div>
      <div className="d-flex justify-content-around row2">
        <div>Hint 4</div>
        <div>Hint 5</div>
        <div>Hint 6</div>
      </div>
     </div>
     <div className="gusser__enterdiv">
     <h3 className="fw-bold">Guess the Word</h3>
     <br />
     <ImageInput text="Enter your Guess"  />
     <ImageButton value="ENTER" classlist="mt-3 gusser__enterbtn" />
     </div>
    </div>
  );
};

export default Gusser;
