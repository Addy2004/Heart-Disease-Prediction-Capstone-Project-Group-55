import React from "react";
import './App.css';
import Form from "./Form";

const App = () => {
  return (
    <div className="min-h-screen min-w-screen bg-[#436b16] flex flex-col items-center justify-center">
      <h1 className="text-2xl text-[#ebe778] font-semibold text-center my-6">Cardio fucky-wucky checker :3</h1>
      <p>im going to have cardio with your mom</p>
      <Form />
    </div>
  );
};

export default App;