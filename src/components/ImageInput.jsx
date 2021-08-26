import React from "react";

const style = {
  fontFamily: "PaytoneOne",
  width: "29.1rem", 
  height: "3.75rem"
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
