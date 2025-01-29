import { useState } from "react";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";

const Form = () => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="max-w-wd mx-auto p-6 bg-[#7fa616] shadow-md rounded-lg"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                    label="Age"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                />

                <InputField
                    label="Sex"
                    type="select"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    options={[
                        {value: 'M', label: 'Male'},
                        {value: 'F', label: 'Female'}
                    ]}
                />

                <InputField
                    label="Chest Pain Type"
                    type="select"
                    name="chestPainType"
                    value={formData.chestPainType}
                    onChange={handleChange}
                    options={[
                        {value: 'TA', label: 'Typical Angina'},
                        {value: 'ATA', label: 'Atypical Angina'},
                        {value: 'NAP', label: 'Non-Anginal Pain'},
                        {value: 'ASY', label: 'Asymptomatic'},
                    ]}
                />

                <InputField
                    label="Resting BP"
                    type="number"
                    name="restingBP"
                    value={formData.restingBP}
                    onChange={handleChange}
                />

                <InputField
                    label="Cholesterol"
                    type="number"
                    name="cholesterol"
                    value={formData.cholesterol}
                    onChange={handleChange}
                />

                <InputField
                    label="Fasting BS"
                    type="number"
                    name="fastingBS"
                    value={formData.fastingBS}
                    onChange={handleChange}
                />

                <InputField
                    label="Resting ECG"
                    type="select"
                    name="restingECG"
                    value={formData.restingECG}
                    onChange={handleChange}
                    options={[
                        {value: 'Normal', label: 'Normal'},
                        {value: 'ST', label: 'ST'},
                        {value: 'LVH', label: 'LVH'},
                    ]}
                />

                <InputField
                    label="Max HR"
                    type="number"
                    name="maxHR"
                    value={formData.maxHR}
                    onChange={handleChange}
                />

                <InputField
                    label="Exercise Angina"
                    type="select"
                    name="exerciseAngina"
                    value={formData.exerciseAngina}
                    onChange={handleChange}
                    options={[
                        {value: 'Y', label: 'Yes'},
                        {value: 'N', label: 'No'},
                    ]}
                />
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
                            {value: 'Up', label: 'Upsloping'},
                            {value: 'Flat', label: 'Flat'},
                            {value: 'Down', label: 'Downsloping'}
                        ]}
                    />
                </div>
            </div>
            

            <SubmitButton
                onSubmit={handleSubmit}
            />
        </form>
    );
};

export default Form;