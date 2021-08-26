import React from "react";

function ImageInput({ text, change }) {
  return (
    <div>
      <input type="text" 
      placeholder={text} 
      onChange={change} 
      style={{width: "29.1rem", heught: "3.75rem"}}
      />
    </div>
  );
}

export default ImageInput;
