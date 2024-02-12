import React from 'react';

import './FormInput.scss';

interface FormInputError {
  isError: boolean;
  message: string;
}

interface FormInputProps {
  id: string;
  labelText: string;
  type: string;
  placeholder?: string;
  isRequired: boolean;
  value: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputError: FormInputError;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  labelText,
  type,
  placeholder,
  isRequired,
  value,
  onChangeHandler,
  inputError,
}) => {
  return (
    <div className='input-contaier'>
      <div className='label-container'>
        <label htmlFor={id}>{labelText}</label>
        <p className={inputError.isError ? 'error' : ''}>
          {inputError.message}
        </p>
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChangeHandler}
      />
    </div>
  );
};

export default FormInput;
