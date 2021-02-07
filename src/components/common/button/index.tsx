import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import './style.scss';

const Button = (props: any) => {
  const {
    className = '',
    buttonType = '',
    label = '',
    loading = false,
    ...remainProps
  } = props;
  const mainClass = 'button';

  return (
    <button
      className={`${mainClass} ${className} ${mainClass}--${buttonType}`}
      {...remainProps}
    >
      {label}
      {loading && (
        <span className={`${mainClass}__loading`}>
          <CircularProgress size={30} />
        </span>
      )}
    </button>
  );
};

export default Button;