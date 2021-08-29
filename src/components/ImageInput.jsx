import React from "react";

const style = {
  fontFamily: "PaytoneOne",
  width: "29.1rem", 
  height: "3.75rem",
  padding: " 5px 50px"
}

function ImageInput({ text, change }) {
  return (
    <div>
      <input type="text" 
      placeholder={text} 
      onChange={change} 
      style={style}
      />
    </div>
  );
}

export default ImageInput;
