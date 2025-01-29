import React from "react";

const Result = ({ success, message }) => {
    return (
        <div className={`
                mt-4
                p-4
                rounded-lg
                text-center
                ${success ? 
                    'bg-green-500 text-white' : 
                    'bg-red-500 text-white'}
            `}
        >
            <p>{message}</p>
        </div>
    );
};

export default Result;