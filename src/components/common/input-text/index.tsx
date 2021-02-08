import React from 'react';
import './style.scss';

const InputText = (props: any) => {
  const {
    label = '',
    register = '',
    name = '',
    className = '',
    onChange,
    onBlur,
    placeholder = '',
    error = '',
    ...rest
  } = props;

  const onValueChange = (event: any) => {
    const value = event.target.value;
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  const onBlurChange = (event: any) => {
    const value = event.target.value;
    if (typeof onBlur === 'function') {
      onBlur(value);
    }
  };

  const mainClass = 'input-text';
  return (
    <div className={`${mainClass} ${className}`}>
      {label && (
        <label className={`${mainClass}__label`}>
          {label}
        </label>
      )}
      <input
        name={name}
        className={`${mainClass}__input`}
        type="text"
        ref={register}
        onChange={onValueChange}
        onBlur={onBlurChange}
        placeholder={placeholder}
        {...rest}
      />
      {error && (
        <div className={`${mainClass}__error`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default InputText;