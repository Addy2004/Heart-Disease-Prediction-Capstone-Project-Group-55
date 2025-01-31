import React from "react";
import RiskBar from "./RiskBar";

const formatModelName = (name) => {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b(Svm|Knn|Xgboost)\b/gi, (match) => match.toUpperCase())
    .replace(/\b(Ai|Ml|Mn)\b/gi, (match) => match.toUpperCase())
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bXgboost\b/gi, "XGBoost")
    .trim();
};

const Result = ({ success, message, modelData }) => {
  if (!modelData || Object.keys(modelData).length === 0) {
    return (
      <div className="text-red-600 text-center">No model data available.</div>
    );
  }

  console.log("Model Data:", modelData);

  return (
    <div
      className={`
            w-full
            max-w-5xl
            mx-auto
            mt-6
            mb-20
            sm:p-8
            p-6
            rounded-lg
            shadow-lg
            text-center
            ${success ? "bg-[#7fa616] text-white" : "bg-red-500 text-white"}
        `}
    >
      <p className="text-xl font-semibold text-center">{message}</p>

      {/* Neural Network Model */}
      <div className="mt-6 space-y-6">
        {modelData.neuralNetwork && (
          <div>
            <RiskBar
              label="Neural Network"
              probability={modelData.neuralNetwork.probability[0]}
            />
          </div>
        )}
        {["nontree", "tree"].map((modelType) => {
          if (!modelData[modelType]) return null; // Skip if not present

          return Object.entries(modelData[modelType]).map(
            ([modelName, model]) => {
              if (modelName === "svm") {
                // Special handling for SVM Models inside nontree.svm
                return Object.entries(model).map(([svmName, svmModel]) => {
                  const probabilityValue = svmModel.probability[1];

                  return (
                    <div key={svmName} className="mb-4">
                      <RiskBar
                        label={formatModelName(svmName)}
                        probability={probabilityValue}
                      />
                    </div>
                  );
                });
              }

              // Other remaining models
              const probabilityValue = model.probability[1];
              return (
                <div key={modelName}>
                  <RiskBar
                    label={formatModelName(modelName)}
                    probability={probabilityValue}
                  />
                </div>
              );
            }
          );
        })}
      </div>
    </div>
  );
};

export default Result;
