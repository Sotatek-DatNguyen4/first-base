import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { buyTokenActions } from '../constants/buy-token';
import {convertToWei, getContractInstance} from '../../services/web3';
import TradeABI from '../../abi/Trade.json';
import ErcABI from '../../abi/Erc20.json';
import { alertActions } from '../constants/alert';
import { isReferral } from '../../utils/affiliateCampaign';
import _ from 'lodash';
import { getCampaignDetail } from './campaign';
import { convertAmountToUsdt } from '../../utils/usdt';
import { getBalance } from './balance';

export const buyToken = (amount: any, campaignId: string, unit = 'eth', referral: string, campaignIndex: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: buyTokenActions.BUY_TOKEN_LOADING });
      const loginUser = getState().user.data;
      const campaignDetail = getState().campaignDetail.data;
      const ethLinkOfCampaignDetail = _.get(campaignDetail, 'ethLink', '');
      const tokenAddressOfCampaignDetail = _.get(campaignDetail, 'tokenAddress', '');
      const contract = getContractInstance(TradeABI, campaignId);
      const amountConvert = convertToWei(amount);

      if (contract) {
        if (unit === 'eth') {
          let buyResult;
          if (referral) {
            const hasReferral = await isReferral(ethLinkOfCampaignDetail, tokenAddressOfCampaignDetail, campaignId);
            if (hasReferral) {
              buyResult = await contract.methods.buyTokenByEtherWithEthLink(loginUser, referral, campaignIndex).send({
                from: loginUser,
                value: amountConvert,
              });
            } else {
              buyResult = await contract.methods.buyTokenByEther(loginUser).send({
                from: loginUser,
                value: amountConvert,
              });
            }
          } else {
            buyResult = await contract.methods.buyTokenByEther(loginUser).send({
              from: loginUser,
              value: amountConvert,
            });
          }

          if (buyResult) {
            dispatch({
              type: buyTokenActions.BUY_TOKEN_SUCCESS,
            });

            dispatch({
              type: alertActions.SUCCESS_MESSAGE,
              payload: 'Buy Token Successful!',
            });

            dispatch(getCampaignDetail(campaignId));
            dispatch(getBalance(loginUser));
          }
        } else {
          const USDT_TOKEN = process.env.REACT_APP_SMART_CONTRACT_USDT_ADDRESS as string;
           const ercContract = getContractInstance(ErcABI, USDT_TOKEN);
           if (ercContract) {
             const decimals  = await ercContract.methods.decimals().call();
             const usdtAmountConvert = convertAmountToUsdt(decimals, amount).toNumber();
             let buyResult;
             if (referral) {
               const hasReferral = await isReferral(ethLinkOfCampaignDetail, tokenAddressOfCampaignDetail, campaignId);
               if (hasReferral) {
                 buyResult = await contract.methods.buyTokenByTokenWithEthLink(
                   loginUser,
                   USDT_TOKEN,
                   referral,
                   campaignIndex,
                   usdtAmountConvert,
                 ).send({
                   from: loginUser,
                 });
               } else {
                 buyResult = await contract.methods.buyTokenByToken(
                   loginUser,
                   USDT_TOKEN,
                   usdtAmountConvert,
                 ).send({
                   from: loginUser,
                 });
               }
             } else {
               buyResult = await contract.methods.buyTokenByToken(
                 loginUser,
                 USDT_TOKEN,
                 usdtAmountConvert,
               ).send({
                 from: loginUser,
               });
             }

             if (buyResult) {
               dispatch({
                 type: buyTokenActions.BUY_TOKEN_SUCCESS,
               });

               dispatch({
                 type: alertActions.SUCCESS_MESSAGE,
                 payload: 'Buy Token Successful!',
               });

               dispatch(getCampaignDetail(campaignId));
               dispatch(getBalance(loginUser));
             }
           }
        }
      }
    } catch (error) {
      dispatch({
        type: buyTokenActions.BUY_TOKEN_FAILURE,
        payload: error.message,
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: error.message,
      });
    }
  }
};
