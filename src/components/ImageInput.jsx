import React from 'react';
import './css/imageinput.css';

function ImageInput({ text, change, classList }) {
  return (
    <div>
      <input
        type="text"
        placeholder={text}
        onChange={change}
        maxLength="15"
        id="ImageInput"
        className={classList}
      />
    </div>
  );
}

export default ImageInput;
