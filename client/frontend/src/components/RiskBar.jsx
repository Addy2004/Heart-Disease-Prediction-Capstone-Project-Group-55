import React, { useState, useEffect } from "react";

const greenColor = [34, 197, 94];
const yellowColor = [234, 179, 8];
const redColor = [239, 68, 68];

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
      <div className="text-xl font-semibold mb-2 text-center">{label}</div>

      {/* Bar container */}
      <div className="relative w-full max-w-lg bg-gray-700 h-8 rounded-lg overflow-hidden flex items-center justify-center">
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
          }}
        />
        {/* Animated Probability Text */}
        <span className="relative text-lg font-bold text-white z-10">
          {displayedProbability}%
        </span>
      </div>
    </div>
  );
};

export default RiskBar;
