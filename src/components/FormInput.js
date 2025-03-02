import React, {useState} from 'react';

function FormInput(props) {
    const{label, errorMessage, onChange, id, ...inputProps} = props
    const[focused, setFocused] = React.useState(false);

    function handleFocus(){
        setFocused(true);
    }


    
    return (
        <div className='inputDiv'>
            <label htmlFor={label} >{label}</label>
            <input {...inputProps} onChange={onChange} onBlur={handleFocus} 
                onFocus={() => inputProps.name === "confirmPassword" && setFocused(true)}
                focused={focused.toString()}/>
            <span>{errorMessage}</span>
        </div>
    );
}

export default FormInput;