import React from 'react';
import { useForm } from 'react-hook-form';

const withReactHookForm = (config: any) => (Component: any) => {
  return (props: any) => {
    const formConfig = config || {mode: 'onChange'};
    const { handleSubmit, ...res } = useForm(formConfig);

    return (
      <Component
        handleSubmit={handleSubmit}
        {...res}
        {...props}
      />
    )
  };
};

export default withReactHookForm;