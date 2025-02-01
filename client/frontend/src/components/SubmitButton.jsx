import React, { useState } from "react";

const SubmitButton = ({ onSubmit, isValid }) => {
  const [isHovered, setIsHovered] = useState(false);

  const submitButtonStyles = {
    backgroundColor: isValid ? (isHovered ? "#C94FA8" : "#704FC9") : "#605d5d",
    color: isValid ? "#E8E778" : "#9CA3AF",
    borderRadius: "2.00rem",
    fontWeight: "700",
    fontSize: isValid ? (isHovered ? "30px" : "18px") : "18px",
    padding: "10px 0",
    width: isValid ? (isHovered ? "60%" : "50%") : "50%",
    textAlign: "center",
    transition:
      "background-color 0.3s ease, transform 0.3s ease, font-size 0.3s ease, width 0.6s ease",
    display: "block",
    cursor: isValid ? "pointer" : "not-allowed",
    transform: isValid ? (isHovered ? "scale(1.07)" : "scale(1)") : "scale(1)",
  };

  return (
    <button
      type="submit"
      className="w-full py-2 mt-8 mx-auto"
      style={submitButtonStyles}
      onMouseEnter={() => isValid && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSubmit}
      // disabled={!isValid}
    >
      Predict
    </button>
  );
};

export default SubmitButton;
