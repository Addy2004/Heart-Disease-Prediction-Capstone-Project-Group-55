import React, { useState } from "react";
import "./App.css";
import Form from "./components/Form";
import LoadingSpinner from "./components/LoadingSpinner";
import Result from "./components/Result";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [modelData, setModelData] = useState(null);

  const handleResponse = (data, message, errors = []) => {
    console.log("handleResponse received:", { data, message, errors });
    if (data && data.models) {
      setModelData(data.models);
      setResponseMessage({
        success: true,
        message: "Prediction complete!",
        errors: [],
      });
    } else {
      setModelData(null);
      setResponseMessage({
        success: false,
        message: message || "An unknown error occurred.",
        errors: errors,
      });
    }
  };

  // To reset the form
  const resetForm = () => {
    setResponseMessage(null);
    setModelData(null);
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#436b16] flex flex-col items-center justify-center">
      <h1 className="text-2xl text-[#ebe778] font-semibold text-center my-6">
        Heart Disease Predictor
      </h1>
      <p>IN DEVELOPMENT</p>

      {isLoading ? (
        <LoadingSpinner />
      ) : responseMessage ? (
        <Result
          success={responseMessage.success}
          message={responseMessage.message}
          errors={responseMessage.errors}
          modelData={modelData}
          onBack={resetForm}
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
