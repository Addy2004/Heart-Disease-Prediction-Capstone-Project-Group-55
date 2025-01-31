import React, { useState } from "react";
import "./App.css";
import Form from "./components/Form";
import LoadingSpinner from "./components/LoadingSpinner";
import Result from "./components/Result";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [modelData, setModelData] = useState(null);

  const handleResponse = (data) => {
    if (data && data.models) {
      setModelData(data.models);
    }
    setResponseMessage({
      success: true,
      message: "Prediction complete!",
    });
  };

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
          modelData={modelData}
        />
      ) : (
        <Form
          setIsLoading={setIsLoading}
          setResponseMessage={setResponseMessage}
          handleResponse={handleResponse}
        />
      )}
    </div>
  );
};

export default App;
