import React, { useState } from "react";
import "./App.css";
import Form from "./Form";
import LoadingSpinner from "./LoadingSpinner";
import Result from "./Result";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  return (
    <div className="min-h-screen min-w-screen bg-[#436b16] flex flex-col items-center justify-center">
      <h1 className="text-2xl text-[#ebe778] font-semibold text-center my-6">
        Cardio fucky-wucky checker :3
      </h1>
      <p>im going to have cardio with your mom</p>

      {isLoading ? (
        <LoadingSpinner />
      ) : responseMessage ? (
        <Result
          success={responseMessage.success}
          message={responseMessage.message}
        />
      ) : (
        <Form
          setIsLoading={setIsLoading}
          setResponseMessage={setResponseMessage}
        />
      )}
    </div>
  );
};

export default App;
