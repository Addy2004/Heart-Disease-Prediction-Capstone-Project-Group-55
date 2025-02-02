import React from "react";
import RiskBar from "./components/RiskBar";

const App = () => {
  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center p-4">
      <RiskBar label="i want yo momma's model" probability={0.0172} />
    </div>
  );
};

export default App;
