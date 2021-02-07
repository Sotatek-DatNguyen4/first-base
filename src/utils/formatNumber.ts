import BigNumber from 'bignumber.js';

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

export const formatToNumber = (yourNumber: any) => {
  if (yourNumber && !isNaN(Number(yourNumber))) {
    const yourNumberBig = new BigNumber(yourNumber).toString();
    if (yourNumberBig.length !== yourNumber.length) {
      return yourNumberBig;
    }
    return yourNumber;
  }
  return yourNumber;
};

export const getShortNumberBuyDecimals = (balance: any, decimals: number = 8) => {
  const balanceNumber = new BigNumber(balance).toString();
  if (balanceNumber.includes('.')) {
    const balanceSplit = balance.toString().split('.');
    const decimalsString = balanceSplit.pop();
    if (decimalsString.length > decimals) {
      return new BigNumber(balance).toFormat(decimals);
    }
    return balanceNumber;
  }

  return balanceNumber;
};

export const checkNumberByASCIIC = (event: any, isNotFloatNumber: boolean = false) => {
  const keyCode = event.keyCode || event.which;

  const keyCodeList = isNotFloatNumber ? INTEGER_NUMBER_KEY_CODE_LIST : FLOAT_NUMBER_KEY_CODE_LIST;
  if (keyCodeList.includes(keyCode)) {
    return true;
  }

  // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
  if ((keyCode === A_KEY_CODE || keyCode === V_KEY_CODE || keyCode === C_KEY_CODE) && (event.ctrlKey === true || event.metaKey === true)) {
    return true;
  }

  if (event.shiftKey) {
    return false;
  }

  if (keyCode < START_NUMBER_KEY_CODE || keyCode > END_NUMBER_KEY_CODE) {
    return false;
  }

  return true;
};