import React from "react";

const style = {
  color: "white",
  fontSize: "25px",
  width: "400px",
  height: "110px",
  cursor: "pointer",
  border: "none",
};

function JoinButton({classlist}) {
  return (
    <>
      <input
        type="button"
        name="button"
        style={style}
        className={classlist}
        />
    </>
  );
}

export default JoinButton;
