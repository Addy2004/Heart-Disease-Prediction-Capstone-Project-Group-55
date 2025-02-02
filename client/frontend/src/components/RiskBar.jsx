import React, { useState, useEffect } from "react";

const greenColor = [157, 225, 0];
const yellowColor = [239, 199, 0];
const redColor = [188, 0, 0];

const barDuration = 3000;

const interpolateColor = (color1, color2, factor) => {
  return color1.map((c, i) => Math.round(c + (color2[i] - c) * factor));
};

const getInterpolatedColor = (currentWidth) => {
  const percentage = currentWidth / 100;

  let interpolatedRGB;

  if (percentage <= 0.33) {
    const factor = percentage / 0.33;
    interpolatedRGB = interpolateColor(greenColor, yellowColor, factor);
  } else if (percentage <= 0.66) {
    const factor = (percentage - 0.33) / 0.33;
    interpolatedRGB = interpolateColor(yellowColor, redColor, factor);
  } else {
    interpolatedRGB = redColor;
  }

  return `rgb(${interpolatedRGB.join(",")})`;
};

const RiskBar = ({ label, probability }) => {
  if (typeof probability !== "number" || probability < 0 || probability > 1) {
    return <div className="text-red-600 text-center">Invalid probability</div>;
  }

  const [displayedProbability, setDisplayedProbability] = useState(0);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [barColor, setBarColor] = useState("rgb(34, 197, 94)");
  const percentage = (probability * 100).toFixed(2);

  useEffect(() => {
    const totalTime = barDuration;
    const incrementInterval = 10;
    const incrementStep = (percentage / totalTime) * incrementInterval;

    let current = 0;
    const interval = setInterval(() => {
      current += incrementStep;
      const newWidth = Math.min(current, percentage);
      setCurrentWidth(newWidth);
      setDisplayedProbability(newWidth.toFixed(2));

      setBarColor(getInterpolatedColor(newWidth));

      if (current >= percentage) {
        clearInterval(interval);
      }
    }, incrementInterval);

    return () => clearInterval(interval);
  }, [percentage]);

  return (
    <div className="flex flex-col items-center mb-6">
      {/* Label */}
      <div className="text-xl font-semibold mb-2 text-[#ebe778] text-center">
        {label}
      </div>

      {/* Bar container */}
      <div className="relative w-full max-w-3xl bg-gray-700 h-8 rounded-2xl overflow-hidden flex items-center justify-center">
        {/* Animated Colored Bar */}
        <div
          className={`
            absolute 
            left-0 
            top-0 
            h-full 
            transition-all
            ease-out
         `}
          style={{
            width: `${currentWidth}%`,
            background: barColor,
            border: "2px solid rgba(94, 76, 85, 0.4)",
            boxSizing: "border-box",
            borderRadius: "1.00rem",
          }}
        />
        {/* Animated Probability Text */}
        <span
          className="relative text-lg font-bold transition-colors duration-900 z-10"
          style={{
            color: currentWidth > 45 ? "#FFFFFF" : "#C94FA8",
          }}
        >
          {displayedProbability}%
        </span>
      </div>
    </div>
  );
};

export default RiskBar;
