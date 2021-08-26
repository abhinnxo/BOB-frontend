import React from "react";

function ImageInput({ text, change }) {
  return (
    <div>
      <input type="text" placeholder={text} onChange={change} />
    </div>
  );
}

export default ImageInput;
