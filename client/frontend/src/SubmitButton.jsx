import React, { useState } from "react";

const SubmitButton = ({ onSubmit }) => {
    const [isHovered, setIsHovered] = useState(false);

    const submitButtonStyles = {
        backgroundColor: isHovered ? "#C94FA8" : "#704FC9", //"#704FC9"
        color: "#E8E778",
        borderRadius: "1.00rem",
        fontWeight: "700",
        fontSize: isHovered ? "30px" : "18px",
        padding: "10px 0",
        width: isHovered ? "45%" : "40%",
        textAlign: "center",
        transition: "background-color 0.3s ease, transform 0.3s ease, font-size 0.3s ease, width 0.6s ease",
        display: "block",
        cursor: "pointer",
        transform: isHovered ? "scale(1.07)" : "scale(1)",
    };

    return (
        <button
            type="submit"
            className="w-full py-2 mt-4 mx-auto"
            style={submitButtonStyles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSubmit}
        >
            Predict
        </button>
    );
}

export default SubmitButton;