import React from 'react';
import DefaultLayout from '../../components/layout/default-layout';
import withReactHookForm from '../../hocs/withReactHookForm';
import InputText from '../../components/common/input-text';
import { renderFieldError } from '../../utils/formFields';

const Form = (props: any) => {
  const {errors, register, handleSubmit} = props;
  const onSubmit = (data: any) => {
    console.log(111, data);
  };

  return (
    <DefaultLayout>
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputText
          name="test"
          label="test"
          register={register({
            required: {
              value: true,
              message: 'required'
            },
            minLength: {
              value: 3,
              message: 'min length 3',
            }
          })}
          error={renderFieldError(errors, 'test')}
        />
        <button>submit</button>
      </form>
    </DefaultLayout>
  );
};

export default withReactHookForm({})(Form);
