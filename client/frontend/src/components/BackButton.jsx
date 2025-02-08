import React, { useState } from "react";

const BackButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const backButtonStyles = {
    backgroundColor: isHovered ? "#C94FA8" : "#704FC9",
    color: "#E8E778",
    borderRadius: "2.00rem",
    fontWeight: "700",
    fontSize: isHovered ? "30px" : "18px",
    padding: "10px 0",
    width: isHovered ? "40%" : "30%",
    textAlign: "center",
    transition:
      "background-color 0.3s ease, transform 0.3s ease, font-size 0.3s ease, width 0.6s ease",
    display: "block",
    cursor: "pointer",
    transform: isHovered ? "scale(1.07)" : "scale(1)",
  };

  return (
    <button
      className="w-full py-2 mt-2 mx-auto"
      style={backButtonStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      // disabled={!isValid}
    >
      Go back
    </button>
  );
};

export default BackButton;
