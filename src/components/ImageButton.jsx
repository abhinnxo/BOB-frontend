import React from 'react'

const style = {
    color: "white",
    fontFamily: "caesar",
    fontSize: "25px",
    width: "400px",
    height: "110px",
    cursor: "pointer",
    border: "none",
  };

const ImageButton = ({ value, clickMe, classlist }) => {
    return (
           
       <div>
             <input
              type="button"
              name="button"
              value={value}
              style={style}
              onClick={clickMe}
              className={classlist}
            />
       </div> 
    )
}

export default ImageButton