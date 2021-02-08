import React from 'react';
import './style.scss';

const ARROW_LEFT_KEY_CODE = 37;
const ARROW_RIGHT_KEY_CODE = 39;
const BACKSPACE_KEY_CODE = 8;
const DELETE_KEY_CODE = 46;
const DECIMAL_KEY_CODE = 190;

const A_KEY_CODE = 65;
const V_KEY_CODE = 86;
const C_KEY_CODE = 67;

const START_NUMBER_KEY_CODE = 48;
const END_NUMBER_KEY_CODE = 57;

const INTEGER_NUMBER_KEY_CODE_LIST = [ARROW_LEFT_KEY_CODE, ARROW_RIGHT_KEY_CODE, BACKSPACE_KEY_CODE, DELETE_KEY_CODE];
const FLOAT_NUMBER_KEY_CODE_LIST = [...INTEGER_NUMBER_KEY_CODE_LIST, DECIMAL_KEY_CODE];
const COPY_KEY_CODE_LIST = [A_KEY_CODE, V_KEY_CODE, C_KEY_CODE];

const InputNumber = (props: any) => {
  const {
    label = '',
    register = '',
    name = '',
    className = '',
    onChange,
    onBlur,
    placeholder = '',
    error = '',
    type = 'integer',
    ...rest
  } = props;

  const isNumberByASCIIC = (event: any) => {
    const keyCode = event.keyCode || event.which;
    const keyCodeList = type === 'integer' ? INTEGER_NUMBER_KEY_CODE_LIST : FLOAT_NUMBER_KEY_CODE_LIST;
    if (keyCodeList.includes(keyCode)) {
      return true;
    }

    // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
    if (COPY_KEY_CODE_LIST.includes(keyCode) && (event.ctrlKey === true || event.metaKey === true)) {
      return true;
    }

    if (event.shiftKey) {
      return false;
    }

    return !(keyCode < START_NUMBER_KEY_CODE || keyCode > END_NUMBER_KEY_CODE);
  };

  const onKeyDown = (event: any) => {
    if (!isNumberByASCIIC(event)) {
      event.preventDefault();
    }
    return true;
  };

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

  return (
    <div className={`input-number ${className}`}>
      {label && (
        <label className="input-number__label">{label}</label>
      )}
      <input
        name={name}
        type="text"
        ref={register}
        onChange={onValueChange}
        onBlur={onBlurChange}
        placeholder={placeholder}
        className="input-number__input"
        onKeyDown={onKeyDown}
        {...rest}
      />
      {error && (
        <div className="input-number__error">
          {error}
        </div>
      )}
    </div>
  );
};

export default InputNumber;