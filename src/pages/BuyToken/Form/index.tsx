import React, { useState } from 'react';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import { Tooltip } from '@material-ui/core';
import Button from '../../../components/Base/Button';
import SelectUnit from './SelectUnit';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import {
  checkNumberByASCIIC,
  formatToNumber,
  getShortNumberBuyDecimals,
} from '../../../utils/formatNumber';
import { getShortTokenSymbol } from '../../../utils/token';

const Form = (props : any) => {
  const {
    classNamePrefix = '',
    submitBuyToken,
    campaignDetail = {},
    onUsdtAllowance,
    usdtAllowance,
    buyLoading,
    usdtApproveLoading,
    usdtAllowanceLoading,
    balance = {},
    usdtDetail = {},
  } = props;

  const ethRate = _.get(campaignDetail, 'ethRate', '');
  const usdtRate = _.get(campaignDetail, 'erc20ConversionRate', '');
  const tokenSymbol = _.get(campaignDetail, 'tokenSymbol', '');
  const tokenName = _.get(campaignDetail, 'tokenName', '');
  const tokenLeft = _.get(campaignDetail, 'tokenLeft', '');
  const tokenDecimals = _.get(campaignDetail, 'tokenDecimals', '');
  const usdtDecimals = _.get(usdtDetail, 'decimals', '');

  const minAmount = new BigNumber(`1e-${tokenDecimals}`);
  const minUsdtAmount = new BigNumber(`1e-${usdtDecimals}`);

  const ethRateNumber = ethRate ? new BigNumber(ethRate).toNumber() : '';
  const usdtRateNumber = usdtRate ? new BigNumber(usdtRate).toNumber() : '';

  const ethBalance = _.get(balance, 'eth', '');
  const usdtBalance = _.get(balance, 'usdt', '');

  const [unit, setUnit] = useState('eth');
  const [isSubmitForm, setIsSubmitForm] = useState(false);

  const { register, setValue, getValues, errors, handleSubmit } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const renderError = (errors: any, fieldName: string) => {
    const errorType = _.get(errors, `[${fieldName}.type]`, '');
    if (!errorType) {
      return;
    }

    switch (errorType) {
      case 'required':
        return 'This field is required';
      case 'amountIsNumber':
        return 'Amount has to a number';
      case 'maxLength':
        return 'Amount should not exceed 30 characters';
      case 'maxAmount':
        return `You can only buy ${getShortNumberBuyDecimals(tokenLeft)} ${getShortTokenSymbol(tokenSymbol)} more from this campaign`;
      case 'minAmount':
        const minAmountBuyUnit = unit === 'eth' ? minAmount : minUsdtAmount;
        return `Amount can not smaller than ${minAmountBuyUnit.toString()}`;
      case 'maxDecimals':
        const decimalsBuyUnit = unit === 'eth' ? 18 : usdtDecimals;
        return `Decimals can not greater than ${decimalsBuyUnit}`;
      default:
        return '';
    }
  };

  const getTokenConvert = (rate: string, amount: string) => {
    if (!amount || !rate || isNaN(Number(amount))) {
      return '';
    }
    const rateNumber = new BigNumber(rate);
    const amountNumber = new BigNumber(amount);
    return rateNumber.multipliedBy(amountNumber);
  };

  const onAmountChange = (event: any) => {
    const value = event.target.value;
    const rate = unit === 'eth' ? ethRate : usdtRate;
    const newTokenConvert = getTokenConvert(rate, value);

    setValue('tokenConvert', newTokenConvert, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setIsSubmitForm(false);

    if (unit === 'usdt' && value) {
      onUsdtAllowance(value);
    }
  };

  const onAmountBlur = (event: any) => {
    const value = event.target.value;
    if (value.length > 30) {
      return;
    }
    const valueConvert = formatToNumber(value);
    setValue('amount', valueConvert);
  };

  const onSelectedUnit = (value: any = 'eth') => {
    setValue('unit', value);
    setUnit(value);
    setIsSubmitForm(false);

    const formValues = getValues();
    const { amount = '' } = formValues;

    const rate = value === 'eth' ? ethRate : usdtRate;
    const newTokenConvert = getTokenConvert(rate, amount);

    setValue('tokenConvert', newTokenConvert, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (value === 'usdt' && amount) {
      onUsdtAllowance(amount);
    }
  };

  const onSubmit = (data: any) => {
    setIsSubmitForm(true);
    submitBuyToken(data);
  };

  const isStartTimeValid = () => {
    const startTime = _.get(campaignDetail, 'startTime', '');
    let startTimeValid = false;

    if (startTime) {
      const startTimeDate = moment.unix(parseInt(startTime)).toDate();
      const currentDate = new Date();
      if (currentDate >= startTimeDate) {
        startTimeValid = true;
      }
    }
    return startTimeValid;
  };

  const isCloseTimeValid = () => {
    const closeTime = _.get(campaignDetail, 'closeTime', '');
    let closeTimeValid = false;

    if (closeTime) {
      const closeTimeDate = moment.unix(parseInt(closeTime)).toDate();
      const currentDate = new Date();
      if (currentDate <= closeTimeDate) {
        closeTimeValid = true;
      }
    }
    return closeTimeValid;
  };

  const getReasonNotShowBuyButton = () => {
    if (!isStartTimeValid()) {
      return 'This campaign has not started yet.';
    }

    if (!isCloseTimeValid()) {
      return 'This campaign has ended.';
    }

    if (!isTokenValid()) {
      return (
        <span>
          This campaign has sold out
          <Tooltip title={<p style={{ fontSize: 15 }}>{tokenSymbol}</p>}>
            <span>
              {` ${getShortTokenSymbol(tokenSymbol)}`}
            </span>
          </Tooltip>
        </span>
      ) ;
    }
  };

  const isTokenValid = () => {
    let tokenValid = false;
    const tokenLeft = _.get(campaignDetail, 'tokenLeft', '');
    if (tokenLeft) {
      const tokenLeftToNumber = parseFloat(tokenLeft);
      tokenValid = tokenLeftToNumber > 0;
    }

    return tokenValid;
  };

  const checkMaxAmount = (tokenConvert: any) => {
    if (!tokenConvert) {
      return;
    }
    const compareResult = (new BigNumber(tokenLeft)).comparedTo(new BigNumber(tokenConvert));
    return compareResult === 0 || compareResult === 1;
  };

  const checkMinAmount = (amount: any) => {
    const minAmountBuyUnit = unit === 'eth' ? minAmount : minUsdtAmount;
    const compareResult = (new BigNumber(amount)).comparedTo(minAmountBuyUnit);
    return compareResult === 0 || compareResult === 1;
  };

  const checkMaxAmountDecimals = (amount: any) => {
    let validMaxAmountDecimals = true;
    const decimalsAmountBuyUnit = unit === 'eth' ? 18 : parseInt(usdtDecimals);
    if (amount.includes('.')) {
      const amountSplit = amount.split('.');
      const amountDecimals = amountSplit.pop();
      if (amountDecimals.length > decimalsAmountBuyUnit) {
        validMaxAmountDecimals = false;
      }
    }

    return validMaxAmountDecimals;
  };

  const checkAmountIsNumber = (amount: any) => {
    return !isNaN(Number(amount));
  };

  const isShowSubmitButton = () => {
    return isStartTimeValid() && isCloseTimeValid() && isTokenValid();
  };

  const rate = unit === 'eth' ? ethRateNumber : usdtRateNumber;
  const buttonText = unit === 'usdt' && !usdtAllowance ? 'Approve' : 'Buy now';

  let buttonLoading = false;
  if (isSubmitForm) {
    buttonLoading = unit === 'usdt' && !usdtAllowance ? usdtApproveLoading : buyLoading;
  } else {
    buttonLoading = unit === 'usdt' && !usdtAllowance && usdtAllowanceLoading;
  }

  return (
    <form
      className={`${classNamePrefix}__form`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={`${classNamePrefix}__form-wrapper`}>
        <div className={`${classNamePrefix}__balance`}>
          <div className={`${classNamePrefix}__balance-title`}>
            My wallet balance
          </div>
          <div className={`${classNamePrefix}__balance-content`}>
            {ethBalance && (
              <div className={`${classNamePrefix}__balance-item`}>
                {getShortNumberBuyDecimals(ethBalance)} <span>ETH</span>
              </div>
            )}

            {usdtBalance && (
              <div className={`${classNamePrefix}__balance-item usdt`}>
                {usdtBalance} <span>USDT</span>
              </div>
            )}
          </div>
        </div>
        <div className={`${classNamePrefix}__form-amount-unit`}>
          <div className={`${classNamePrefix}__form-amount`}>
            <div className={`${classNamePrefix}__input-wrapper`}>
              <label className={`${classNamePrefix}__input-label`}>You send</label>
              <input
                name="amount"
                className={`${classNamePrefix}__input`}
                type="text"
                onChange={onAmountChange}
                ref={register({
                  required: true,
                  maxLength: 40,
                  validate: {
                    amountIsNumber: checkAmountIsNumber,
                    maxDecimals: checkMaxAmountDecimals,
                    minAmount: checkMinAmount,
                  }
                })}
                onKeyDown={(e: any) => {
                  if (!checkNumberByASCIIC(e)) {
                    e.preventDefault();
                  }
                  return true;
                }}
                onBlur={onAmountBlur}
              />
            </div>
            {errors.amount && (
              <p className={`${classNamePrefix}__input-error text-danger`}>
                {renderError(errors, 'amount')}
              </p>
            )}
          </div>

          <input
            type="hidden"
            name="unit"
            ref={register({})}
          />
          <SelectUnit
            defaultValue="eth"
            options= {[
              {
                label: 'Ether',
                value: 'eth',
              },
              ...(usdtRate && usdtRate !== '0'  ? [
                {
                  label: 'Tether',
                  value: 'usdt',
                }
              ] : []),
            ]}
            onChange={onSelectedUnit}
            value={unit}
          />
        </div>

        <div className={`${classNamePrefix}__form-exchange`}>
          <SwapHorizIcon />
          <span>1 <span className="text-uppercase">{unit}</span> ~ {rate}
          <Tooltip
            title={<p style={{ fontSize:15 }}>{tokenSymbol}</p>}
          >
            <span>{getShortTokenSymbol(tokenSymbol)}</span>
          </Tooltip></span>
        </div>

        <div className={`${classNamePrefix}__form-token-convert-unit`}>
          <div className={`${classNamePrefix}__form-token-convert-unit-wrap`}>
            <div className={`${classNamePrefix}__form-token-convert ${classNamePrefix}__input-wrapper`}>
              <label className={`${classNamePrefix}__input-label`}>You get approximately</label>
              <input
                name="tokenConvert"
                className={`${classNamePrefix}__input`}
                type="text"
                disabled
                ref={register({
                  validate: {
                    maxAmount: checkMaxAmount,
                  }
                })}
              />
            </div>
            <SelectUnit
              defaultValue={tokenSymbol}
              options= {[
                {
                  label: tokenName,
                  value: tokenSymbol,
                },
              ]}
              disabled
            />
          </div>
          {errors.tokenConvert && (
            <p className={`${classNamePrefix}__input-error text-danger`}>
              {renderError(errors, 'tokenConvert')}
            </p>
          )}
        </div>
      </div>

      {isShowSubmitButton() ? (
        <div className={`${classNamePrefix}__form-token-button`}>
          <Button
            label={buttonText}
            buttonType="primary"
            loading={buttonLoading}
            disabled={buttonLoading}
          />
        </div>
      ): (
        <div className={`${classNamePrefix}__form-reason-not-show-button`}>
          {getReasonNotShowBuyButton()}
        </div>
      )}
    </form>
  );
};

export default Form;
