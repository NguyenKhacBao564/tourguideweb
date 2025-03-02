import React, { useState, useEffect } from "react";

function FormInput(props) {
    const { label, errorMessage, onChange, id,...inputProps } = props;
    const [focused, setFocused] = useState(false);
    const [errorType, setErrorType] = useState(errorMessage["Empty"]);

    const handleFocus = () => {
        setFocused(true);
    };

    const checkTypeError = (e) => {
        console.log(e.target.value);
        if (e.target.value === "") {
            setErrorType(errorMessage["Empty"]);
        } else {
            setErrorType(errorMessage["Constraint"]);
        }
    }

    return (
        <div className="inputDiv">
            <label htmlFor={id}>{label}</label>
            <input
                {...inputProps}
                id={id}
                onChange={(e) => {
                    onChange(e);
                    checkTypeError(e);
                }}
                onBlur={handleFocus}
                onFocus={() => inputProps.name === "confirmPassword" && setFocused(true)}
                focused={focused.toString()}
            />
            <span>{errorType}</span>
        </div>
    );
}

export default FormInput;
