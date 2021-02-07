import _ from 'lodash';

export const renderFieldError = (errors: any, fieldName: string) => {
  return _.get(errors, `[${fieldName}.message]`, '');
};