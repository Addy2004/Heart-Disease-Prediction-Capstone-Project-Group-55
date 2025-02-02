import React from "react";
import RiskBar from "./RiskBar";
import BackButton from "./BackButton";

const formatModelName = (name) => {
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b(Svm|Knn|Rbf)\b/gi, (match) => match.toUpperCase())
    .replace(/\b(Ai|Ml|Mn)\b/gi, (match) => match.toUpperCase())
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bXgboost\b/gi, "XGBoost")
    .trim();
};

const Result = ({ success, message, errors = [], modelData, onBack }) => {
  console.log("Errors in Result.jsx: ", errors);
  return (
    <div
      className={`
            w-full
            mx-auto
            mb-20
            rounded-4xl
            shadow-lg
            text-center
            overflow-hidden
            ${
              success
                ? "bg-[#7fa616] text-white max-w-4xl mt-6 sm:p-8 p-6"
                : "bg-[#A61637] text-[#ebe778] text-[20px] font-bold max-w-xl p-6"
            }
        `}
    >
      {/* Display Network Errors / General Errors (500) */}
      {!success && <p>{message}</p>}

      {/* Display Validation Errors (400) */}
      {errors && errors.length > 0 && (
        <div className="text-white p-3 rounded-2xl">
          <p className="font-semibold text-2xl">Validation Errors:</p>
          <ul className="list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index} className="text-base">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* If there are no error, show model results */}
      {success && modelData && Object.keys(modelData).length > 0 && (
        <div className="mt-6 space-y-6">
          {modelData.neuralNetwork && (
            <RiskBar
              label="Neural Network"
              probability={modelData.neuralNetwork.probability[0]}
            />
          )}
          {["nontree", "tree"].map((modelType) =>
            modelData[modelType]
              ? Object.entries(modelData[modelType]).map(
                  ([modelName, model]) => {
                    if (modelName === "svm") {
                      // Special handling for SVM Models inside nontree.svm
                      return Object.entries(model).map(
                        ([svmName, svmModel]) => (
                          <RiskBar
                            key={svmName}
                            label={formatModelName(svmName)}
                            probability={svmModel.probability[1]}
                          />
                        )
                      );
                    }

                    // Other remaining models
                    return (
                      <RiskBar
                        key={modelName}
                        label={formatModelName(modelName)}
                        probability={model.probability[1]}
                      />
                    );
                  }
                )
              : null
          )}
        </div>
      )}

      {/* Back Button */}
      <BackButton onClick={onBack} />
    </div>
  );
};

export default Result;
