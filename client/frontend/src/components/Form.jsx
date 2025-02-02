import { useState } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

const Form = ({ setIsLoading, setResponseMessage, handleResponse }) => {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    chestPainType: "",
    restingBP: "",
    cholesterol: "",
    fastingBS: "",
    restingECG: "",
    maxHR: "",
    exerciseAngina: "",
    oldpeak: "",
    stSlope: "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false); // should be false by default
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (data) => {
    let newErrors = {};

    if (!data.age || isNaN(data.age) || data.age < 0 || data.age > 120) {
      newErrors.age =
        "Invalid or missing 'Age'. Must be an integer between 0 and 120.";
    }
    if (!data.sex || !["M", "F"].includes(data.sex)) {
      newErrors.sex = "Invalid or missing 'Sex'. Must be 'Male' or 'Female'.";
    }
    if (
      !data.chestPainType ||
      !["TA", "ATA", "NAP", "ASY"].includes(data.chestPainType)
    ) {
      newErrors.chestPainType =
        "Invalid or missing 'Chest Pain Type'. Must be 'Typical Angina', 'Atypical Angina', 'Non-Anginal Pain', or 'Asymptomatic'";
    }
    if (
      !data.restingBP ||
      isNaN(data.restingBP) ||
      data.restingBP < 0 ||
      data.restingBP > 250
    ) {
      newErrors.restingBP =
        "Invalid or missing 'Resting BP'. Must be an integer between 0 and 250.";
    }
    if (
      !data.cholesterol ||
      isNaN(data.cholesterol) ||
      data.cholesterol < 0 ||
      data.cholesterol > 600
    ) {
      newErrors.cholesterol =
        "Invalid or missing 'Cholesterol. Must be an integer between 0 and 600.'";
    }
    if (
      !data.fastingBS ||
      isNaN(data.fastingBS) ||
      data.fastingBS < 0 ||
      data.fastingBS > 1
    ) {
      newErrors.fastingBS = "Invalid or missing 'Fasting BS'. Must be 0 or 1.";
    }
    if (
      !data.restingECG ||
      !["Normal", "ST", "LVH"].includes(data.restingECG)
    ) {
      newErrors.restingECG =
        "Invalid or missing 'Resting ECG'. Must be 'Normal', 'ST', or 'LVH'.";
    }
    if (
      !data.maxHR ||
      isNaN(data.maxHR) ||
      data.maxHR < 30 ||
      data.maxHR > 250
    ) {
      newErrors.maxHR =
        "Invalid or missing 'Max HR'. Must be an integer between 30 and 250.";
    }
    if (!data.exerciseAngina || !["Y", "N"].includes(data.exerciseAngina)) {
      newErrors.exerciseAngina =
        "Invalid or missing 'Exercise Angina'. Must be 'Yes' or 'No'.";
    }
    if (!data.oldpeak || isNaN(data.oldpeak)) {
      newErrors.oldpeak =
        "Invalid or missing 'Oldpeak'. Must be a floating number.";
    }
    if (!data.stSlope || !["Up", "Flat", "Down"].includes(data.stSlope)) {
      newErrors.stSlope =
        "Invalid or missing 'ST Slope'. Must be 'Upsloping', 'Flat', 'Downsloping'.";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      validateForm(updatedData);
      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    console.log("Form submitted:", formData);
    setIsLoading(true);
    setResponseMessage({
      success: false,
      message: "",
      errors: [],
    });
    setErrors({});

    const requestData = {
      Age: parseInt(formData.age),
      Sex: formData.sex,
      ChestPainType: formData.chestPainType,
      RestingBP: parseInt(formData.restingBP),
      Cholesterol: parseInt(formData.cholesterol),
      FastingBS: parseInt(formData.fastingBS),
      RestingECG: formData.restingECG,
      MaxHR: parseInt(formData.maxHR),
      ExerciseAngina: formData.exerciseAngina,
      Oldpeak: parseFloat(formData.oldpeak),
      ST_Slope: formData.stSlope,
    };

    try {
      const response = await fetch(
        "http://flask-app-server-env.ap-south-1.elasticbeanstalk.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);
      if (response.ok) {
        setResponseMessage({
          success: true,
          message: "Prediction successful.",
          errors: [],
        });
        handleResponse(data, []);
      } else {
        const errorMessage = `Error ${response.status}`;
        const errorList = data.errors || [];
        setResponseMessage({
          success: false,
          message: errorMessage,
          errors: errorList,
        });
        handleResponse(null, errorMessage, errorList);
      }
    } catch (error) {
      console.error("Fetch error: ", error);

      let errorMessage = "Network error: Unable to reach the server.";
      let errorList = [];

      if (!navigator.onLine) {
        errorMessage = "No internet connection. Please check your network.";
      } else if (error.response) {
        try {
          const errorData = await error.response.json();
          if (Array.isArray(errorData.errors)) {
            errorList = errorData.errors;
          }
          errorMessage = errorData.message || "hmmmmm";
        } catch (parseError) {
          console.error("Error parsing JSON response: ", parseError);
        }
      }
      setResponseMessage({
        success: false,
        message: errorMessage,
        errors: errorList.length > 0 ? errorList : [errorMessage],
      });

      handleResponse(null, errorMessage, errorList);
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: "age", label: "Age", type: "number" },

    {
      name: "sex",
      label: "Sex",
      type: "select",
      options: [
        { value: "M", label: "Male" },
        { value: "F", label: "Female" },
      ],
    },

    {
      name: "chestPainType",
      label: "Chest Pain Type",
      type: "select",
      options: [
        { value: "TA", label: "Typical Angina" },
        { value: "ATA", label: "Atypical Angina" },
        { value: "NAP", label: "Non-Anginal Pain" },
        { value: "ASY", label: "Asymptomatic" },
      ],
    },

    { name: "restingBP", label: "Resting BP", type: "number" },

    { name: "cholesterol", label: "Cholesterol", type: "number" },

    { name: "fastingBS", label: "Fasting BS", type: "number" },

    {
      name: "restingECG",
      label: "Resting ECG",
      type: "select",
      options: [
        { value: "Normal", label: "Normal" },
        { value: "ST", label: "ST" },
        { value: "LVH", label: "LVH" },
      ],
    },

    { name: "maxHR", label: "Max HR", type: "number" },

    {
      name: "exerciseAngina",
      label: "Exercise Angina",
      type: "select",
      options: [
        { value: "Y", label: "Yes" },
        { value: "N", label: "No" },
      ],
    },

    { name: "oldpeak", label: "Oldpeak", type: "decimal" },

    {
      name: "stSlope",
      label: "ST Slope",
      type: "select",
      options: [
        { value: "Up", label: "Upsloping" },
        { value: "Flat", label: "Flat" },
        { value: "Down", label: "Downsloping" },
      ],
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto bg-[#7fa616] shadow-md rounded-4xl pr-10 pl-10 pt-6 pb-6 mb-20"
    >
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formFields.slice(0, 9).map(({ name, label, type, options }) => (
            <InputField
              key={name}
              label={label}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              options={options}
            />
          ))}
        </div>
      </div>
      <div className="md:col-span-3 flex justify-center">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Oldpeak"
            type="decimal"
            name="oldpeak"
            value={formData.oldpeak}
            onChange={handleChange}
          />

          <InputField
            label="ST Slope"
            type="select"
            name="stSlope"
            value={formData.stSlope}
            onChange={handleChange}
            options={[
              { value: "Up", label: "Upsloping" },
              { value: "Flat", label: "Flat" },
              { value: "Down", label: "Downsloping" },
            ]}
          />
        </div>
      </div>

      {/* Error Display */}
      {submitted && Object.keys(errors).length > 0 && (
        <div
          className="mt-8 p-2 rounded-2xl shadow-md mx-auto max-w-2xl max-h-xl overflow-auto flex flex-col items-center justify-center text-center"
          style={{
            color: "#EBE778",
            fontSize: "18px",
            fontWeight: "700",
            backgroundColor: "#A61637",
          }}
        >
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}

      <SubmitButton onSubmit={handleSubmit} isValid={isValid} />
    </form>
  );
};

export default Form;
