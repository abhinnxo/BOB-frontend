import React from 'react';

const ImageButton = ({ value, clickMe, classlist }) => {
  return (
    <div>
      <input
        type="button"
        name="button"
        value={value}
        onClick={clickMe}
        className={classlist}
      />
    </div>
  );
};

export default ImageButton;
