import React from 'react';

const style = {
  fontFamily: 'PaytoneOne',
  width: '29.1rem',
  height: '3.75rem',
  padding: ' 5px 50px',
};

function ImageInput({ text, change, classList }) {
  return (
    <div>
      <input
        type='text'
        placeholder={text}
        onChange={change}
        maxLength='15'
        style={style}
        className={classList}
      />
    </div>
  );
}

export default ImageInput;
