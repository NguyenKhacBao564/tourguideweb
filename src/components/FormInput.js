import React, { useState, useEffect } from "react";

function FormInput(props) {
    const { label, errorMessage, onChange, id,...inputProps } = props;
    const [focused, setFocused] = useState(false);
   

    const handleFocus = () => {
        setFocused(true);
    };

    const hasErrorNotify =  Object.keys(errorMessage).length>1;
    
    const [errorType, setErrorType] = useState(hasErrorNotify ? "Default" : "");
    const checkTypeError = (e) => {
        // console.log(e.target.value);
        if(hasErrorNotify){
            if (e.target.value === "") {
                setErrorType("Default");
            } else {
                setErrorType("Constraint");
            }
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
            {hasErrorNotify && <span>{errorMessage[errorType]}</span>}
        </div>
    );
}

export default FormInput;
