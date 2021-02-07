import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import BigNumber from 'bignumber.js';

import { convertDateTimeToUnix, convertUnixTimeToDateTime } from '../../utils/convertDate';
import { campaignActions } from '../constants/campaign';
import { alertActions } from '../constants/alert';
import { BaseRequest } from '../../request/Request';
import campaignFactoryABI from '../../abi/CampaignFactory.json';
import campaignABI from '../../abi/Campaign.json';
import erc20ABI from '../../abi/Erc20.json';
import ethLinkABI from '../../abi/Ethlink.json';
import { getContractInstance, getWeb3Instance } from '../../services/web3';
import { getAffiliateByCampaign } from './affiliate';
import { isReferral, isOwnerOfReferral } from '../../utils/affiliateCampaign';

const ETH_LINK_DEFAULT_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_ETHLINK_ADDRESS || "";
const USDT_LINK_DEFAULT_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_USDT_ADDRESS || "";

type campaignCreateProps = {
  title: string;
  token: string;
  startTime: Date;
  finishTime: Date;
  addressReceiver: string;
  affiliate: string;
  tokenByETH: string;
}

type campaignAffiliateCreateProps = {
  name: string;
  commission: number;
}

export const getCampaigns = (currentPage: number = 1, query: string = '', startTime: string, finishTime: string, filter: boolean = false) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    const baseRequest = new BaseRequest();
    const loginUser = getState().user.data;

    dispatch({ type: campaignActions.CAMPAIGNS_REQUEST });

    let url = `/campaigns?page=${currentPage}&title=${query}&start_time=${startTime}&finish_time=${finishTime}`;

    if (filter) url += `&registed_by=${loginUser}&page=1`;

    try {
      const response = await baseRequest.get(url) as any;
      const resObject = await response.json();

      if (resObject.status === 200) {
        const { total, page, lastPage, data } = resObject.data;
          
        dispatch({
          type: campaignActions.CAMPAIGNS_SUCCESS,
          payload: {
            total,
            page,
            lastPage,
            data
          } 
        })
      }
    } catch (err) {
      dispatch({
        type: campaignActions.CAMPAIGNS_FAIL,
        payload: err.message
      })
    }
  }
}

export const getLatestCampaign = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const baseRequest = new BaseRequest();

    dispatch({ type: campaignActions.CAMPAIGN_LATEST_GET_REQUEST });

    try {
      const response = await baseRequest.get('/campaign-new') as any;
      const resObject = await response.json();


      if (resObject.status === 200) {
        const { campaign_hash, decimals } = resObject.data;
        // Init ERC20 Contract By Token Address get from Campaign Contract
        const campaignContract = getContractInstance(campaignABI, campaign_hash);

        if (campaignContract) {
          let tokenSold = campaignContract.methods.tokenSold().call();
          const token = campaignContract.methods.token().call();

          const campaignDetail = await Promise.all([token, tokenSold]);

          const erc20Contract = getContractInstance(erc20ABI, campaignDetail[0]);

          const balance = await erc20Contract?.methods.balanceOf(campaign_hash).call();
          const tokenLeft = new BigNumber(balance).dividedBy(Math.pow(10, decimals)).toFixed();

          tokenSold = new BigNumber(campaignDetail[1]).dividedBy(Math.pow(10, decimals)).toFixed();

         dispatch({
           type: campaignActions.CAMPAIGN_LATEST_GET_SUCCESS,
           payload: {
             ...resObject.data,
             tokenLeft,
             totalTokens: new BigNumber(tokenLeft).plus(tokenSold).toFixed(),
             tokenSold
           }
         }) 
        }

      }
    } catch (err) {
      console.log(err.message);
      dispatch({
        type: campaignActions.CAMPAIGN_LATEST_GET_FAIL,
        payload: err.message
      })
    }
  }
}

export const getCampaignDetail = (id: string) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: campaignActions.CAMPAIGN_DETAIL_REQUEST });

    try {
      const loginUser = getState().user.data;

      const web3Instance = getWeb3Instance();
      const campaignContract = getContractInstance(campaignABI, id);

      if (web3Instance && campaignContract) {
        // Check if this campaign is owned by this account
        const campaignOwner = await campaignContract.methods.owner().call();
        const isCampaignOwner = campaignOwner.toLowerCase() === loginUser.toLowerCase();

        const title = campaignContract.methods.name().call();

        // Get All information of selected campaign
        const fundingWallet = campaignContract.methods.fundingWallet().call();
        const tokenSold = campaignContract.methods.tokenSold().call();
        const weiRaised = campaignContract.methods.weiRaised().call();
        const startTime = campaignContract.methods.openTime().call();
        const closeTime = campaignContract.methods.closeTime().call();
        const token = campaignContract.methods.token().call();
        const owner = campaignContract.methods.owner().call();
        const isSuspend = campaignContract.methods.paused().call();
        const etherRate = campaignContract.methods.getEtherConversionRate().call();
        const ethLink = campaignContract.methods.ethLink().call();
        const erc20ConversionRate = campaignContract.methods.getErc20TokenConversionRate(USDT_LINK_DEFAULT_ADDRESS).call();

        const campaignDetail = await Promise.all([title, tokenSold, weiRaised, ethLink, etherRate, startTime, closeTime, fundingWallet, token, owner, erc20ConversionRate, isSuspend]);

        // Init ERC20 Contract By Token Address get from Campaign Contract
        const erc20Contract = getContractInstance(erc20ABI, campaignDetail[8]);
        const usdtContract = getContractInstance(erc20ABI, USDT_LINK_DEFAULT_ADDRESS);

        if (erc20Contract && usdtContract) {
          const tokenName = erc20Contract.methods.name().call();
          const tokenSymbol = erc20Contract.methods.symbol().call();
          const tokenDecimals = erc20Contract.methods.decimals().call();
          const totalTokens = erc20Contract.methods.balanceOf(id).call();

          const tokenDetail = await Promise.all([tokenName, tokenSymbol, tokenDecimals, totalTokens]);
          
          const affiliate = await isReferral(campaignDetail[3], campaignDetail[8], id);

          let isOwnerReferral = false;

          if (Number(campaignDetail[3] != 0)) {
            isOwnerReferral = await isOwnerOfReferral(campaignDetail[3], campaignDetail[8], loginUser) as boolean;
          }    

          const tokenLeft = new BigNumber(tokenDetail[3]).dividedBy(Math.pow(10, tokenDetail[2]));
          const tokenSold = new BigNumber(campaignDetail[1]).dividedBy(Math.pow(10, tokenDetail[2]));

          const usdtDecimal = await usdtContract.methods.decimals().call();

          const erc20ConversionRate = new BigNumber(campaignDetail[10]).dividedBy(Math.pow(10, (18 - Number(usdtDecimal)))).toFixed();

          const refundable = isCampaignOwner && tokenLeft.gt(0) && new Date(convertUnixTimeToDateTime(campaignDetail[6])) < new Date();

          dispatch({
            type: campaignActions.CAMPAIGN_DETAIL_SUCCESS,
            payload: {
              title: campaignDetail[0],
              tokenSold: tokenSold.toFixed(),
              tokenLeft: tokenLeft.toFixed(),
              ethRaised: web3Instance.utils.fromWei(campaignDetail[2], 'ether'),
              totalTokens: tokenSold.plus(tokenLeft).toFixed(),
              affiliate, 
              ethLink: campaignDetail[3],
              ethRate: campaignDetail[4],
              startTime: campaignDetail[5],
              closeTime: campaignDetail[6],
              tokenName: tokenDetail[0],
              tokenSymbol: tokenDetail[1],
              tokenDecimals: tokenDetail[2],
              fundingWallet: campaignDetail[7],
              tokenAddress: campaignDetail[8],
              owner: campaignDetail[9],
              erc20ConversionRate,
              transactionHash: id,
              isCampaignOwner,
              isOwnerReferral,
              isSuspend: campaignDetail[11],
              refundable 
            }
          })
        }

      }
    } catch (err) {
      dispatch({
        type: campaignActions.CAMPAIGN_DETAIL_FAIL,
        payload: err.message
      });
    }
  }
}

export const registerICOCampaign = (website: string, history: any) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: campaignActions.CAMPAIGN_REGISTER_ICO_REQUEST });

      const { campaignDetail, user } = getState();
      const { transactionHash, tokenAddress } = campaignDetail.data;

      const ethLinkContract = getContractInstance(ethLinkABI, ETH_LINK_DEFAULT_ADDRESS);

      if (ethLinkContract) {
        const icoCampaignWithToken = await ethLinkContract.methods.tokens(tokenAddress).call();
        const { icoCampaign } = icoCampaignWithToken;

        if (Number(icoCampaign) !== 0 && (icoCampaign.toLowerCase() !== transactionHash.toLowerCase())) {
          await ethLinkContract.methods.setIcoCampaign(tokenAddress, transactionHash).send({
            from: user.data
          });
        } else {
          await ethLinkContract.methods.registerICO(tokenAddress, website, transactionHash).send({
            from: user.data 
          });
        }       

        dispatch({ type: campaignActions.CAMPAIGN_REGISTER_ICO_SUCCESS });

        dispatch(getCampaignDetail(transactionHash));

        dispatch({
          type: alertActions.SUCCESS_MESSAGE,
          payload: 'Register ICO Campaign Successful'
        })

      }

    } catch (err) {
      dispatch({
        type: campaignActions.CAMPAIGN_REGISTER_ICO_FAIL,
        payload: err.message
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message
      });
    }
  }
}

export const setUSDTRate = (rate: number) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: campaignActions.CAMPAIGN_ERC20_RATE_REQUEST });

      const { data } = getState().campaignDetail;
      const loginUser = getState().user.data;

      if (data) {
        const { transactionHash } = data;
        const campaignContract = getContractInstance(campaignABI, transactionHash);
        const usdtContract = getContractInstance(erc20ABI, USDT_LINK_DEFAULT_ADDRESS);

        if (usdtContract && campaignContract) {

          const usdtDecimal = await usdtContract.methods.decimals().call();

          const erc20ConversionRate = Number(rate) * Math.pow(10, (18 - Number(usdtDecimal)));

          await campaignContract.methods.setErc20TokenConversionRate(USDT_LINK_DEFAULT_ADDRESS, erc20ConversionRate).send({
            from: loginUser
          });

          dispatch({
            type: campaignActions.CAMPAIGN_ERC20_RATE_SUCCESS
          });

          dispatch({
            type: alertActions.SUCCESS_MESSAGE,
            payload: "Set ERC20 Rate Successful!"
          });

          dispatch(getCampaignDetail(transactionHash));
        };
      }
    } catch (err) {
      dispatch({
        type: campaignActions.CAMPAIGN_ERC20_RATE_FAIL,
        payload: err.message
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message
      });
    }
  }
}

export const createAffiliateCampaign = (campaign: campaignAffiliateCreateProps, history: any) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: campaignActions.CAMPAIGN_AFFILIATE_CREATE_REQUEST });

      const ethLinkContract = getContractInstance(ethLinkABI, ETH_LINK_DEFAULT_ADDRESS);

      if (ethLinkContract) {
        const { name, commission } = campaign;
        const { tokenAddress } = getState().campaignDetail.data;
        const loginUser = getState().user.data;

        await ethLinkContract.methods.createCampaign(name, tokenAddress, commission).send({
          from: loginUser
        });

        dispatch({ type: campaignActions.CAMPAIGN_AFFILIATE_CREATE_SUCCESS });

        dispatch({
          type: alertActions.SUCCESS_MESSAGE,
          payload: 'Create Campaign Successful'
        });

        dispatch(getAffiliateByCampaign());
      }
    } catch (err) {
      dispatch({
        type: campaignActions.CAMPAIGN_AFFILIATE_CREATE_FAIL,
        payload: err.message
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message
      });
    }
  }
}

export const createCampaign = (campaign: campaignCreateProps, history: any) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: campaignActions.MY_CAMPAIGN_CREATE_REQUEST });

      const factorySmartContract = getContractInstance(campaignFactoryABI, process.env.REACT_APP_SMART_CONTRACT_FACTORY_ADDRESS || "");
      
      const { title, affiliate, startTime, finishTime, token, addressReceiver, tokenByETH } = campaign;
      const startTimeUnix = +convertDateTimeToUnix(startTime);
      const finishTimeUnix = +convertDateTimeToUnix(finishTime);

      const durationTime = finishTimeUnix - startTimeUnix;

      if (factorySmartContract) {
        let createdCampaign;

        if (affiliate === 'yes')  {
          createdCampaign = await factorySmartContract.methods.RegisterCampaignWithEthLink(title, token, durationTime, startTimeUnix, tokenByETH, addressReceiver, ETH_LINK_DEFAULT_ADDRESS).send({
            from: getState().user.data
          });
        } else {
          createdCampaign = await factorySmartContract.methods.registerCampaign(title, token, durationTime, startTimeUnix, tokenByETH, addressReceiver).send({
            from: getState().user.data
          });
        }

        if (createdCampaign) {
          dispatch({ type: campaignActions.MY_CAMPAIGN_CREATE_SUCCESS });

          history.push('/campaigns');

          dispatch({ type: alertActions.SUCCESS_MESSAGE, payload: 'Create Campaign Successful!'});
        }
      }
    } catch (err) {
      dispatch({
        type: campaignActions.MY_CAMPAIGN_CREATE_FAIL,
        payload: err.message
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message
      });
    }
  }
}

export const toggleCampaignStatus = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: campaignActions.CAMPAIGN_STATUS_TOGGLE_REQUEST });

      const { campaignDetail, user } = getState();
      const { transactionHash, isSuspend } = campaignDetail.data;

      const campaignContract = getContractInstance(campaignABI, transactionHash);

      if (campaignContract) {
        isSuspend ? await campaignContract.methods.unpause().send({
          from: user.data
        }): await campaignContract.methods.pause().send({
          from: user.data
        })  

        dispatch({ type: campaignActions.CAMPAIGN_STATUS_TOGGLE_SUCCESS });

        if (isSuspend) {
          dispatch({
            type: alertActions.SUCCESS_MESSAGE,
            payload: 'Active Campaign Successful!'
          })
        } else {
          dispatch({
            type: alertActions.SUCCESS_MESSAGE,
            payload: 'Suspend Campaign Successful!'
          })
        }

        dispatch(getCampaignDetail(transactionHash));
      }
      
    } catch (err) {
      dispatch({
        type: campaignActions.CAMPAIGN_STATUS_TOGGLE_FAIL,
        payload: err.message
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message
      });
    }
  }
}

export const editCampaignWithProp = (prop: string, value: string, handleEditSuccess: () => void) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: campaignActions.CAMPAIGN_EDIT_REQUEST });

      const { campaignDetail, user } = getState();
      const { transactionHash } = campaignDetail.data;

      const campaignContract = getContractInstance(campaignABI, transactionHash);
        const usdtContract = getContractInstance(erc20ABI, USDT_LINK_DEFAULT_ADDRESS);

      if (campaignContract && usdtContract) {
        switch (prop) {
          case 'affiliate': {
            if (value === 'yes') {
              await campaignContract.methods.setEthLinkAddress(ETH_LINK_DEFAULT_ADDRESS).send({
                from: user.data 
              });
            } else {
              await campaignContract.methods.setEthLinkAddress("0x0000000000000000000000000000000000000000").send({
                from: user.data 
              });
            }

            break;
          }

          case 'USDT': {
            const usdtDecimal = await usdtContract.methods.decimals().call();
            const erc20ConversionRate = new BigNumber(value).multipliedBy(Math.pow(10, (18 - Number(usdtDecimal))));

            await campaignContract.methods.setErc20TokenConversionRate(USDT_LINK_DEFAULT_ADDRESS, erc20ConversionRate.toString()).send({
              from: user.data
            });

            break;
          }

          case 'ETH': {
            await campaignContract.methods.setEtherConversionRate(value).send({
              from: user.data
            });

            break;
          }

          case 'start time': {
            const unixTime = convertDateTimeToUnix(value);

            await campaignContract.methods.setOpenTime(unixTime).send({
              from: user.data
            });

            break;
          }

          case 'finish time': {
            const unixTime = convertDateTimeToUnix(value);

            await campaignContract.methods.setCloseTime(unixTime).send({
              from: user.data
            });

            break;
          }
        }

        dispatch({ type: campaignActions.CAMPAIGN_EDIT_SUCCESS });

        handleEditSuccess();

        dispatch({
          type: alertActions.SUCCESS_MESSAGE,
          payload: 'Update Campaign Successful!'
        });

        dispatch(getCampaignDetail(transactionHash));
      }

    } catch (err) {
      handleEditSuccess();

      dispatch({
        type: campaignActions.CAMPAIGN_EDIT_FAIL,
        payload: err.message
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message
      });
    }
  }
}

export const refundTokensForIcoOwner = (receiverAddress: string, amount: number) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    try {
      dispatch({ type: campaignActions.CAMPAIGN_TOKENS_REFUND_REQUEST });

      const { campaignDetail, user } = getState();
      const { transactionHash, tokenDecimals } = campaignDetail.data;

      const campaignContract = getContractInstance(campaignABI, transactionHash);

      const withDrawAmount = new BigNumber(amount).multipliedBy(Math.pow(10, tokenDecimals)).toString();

      if (campaignContract) {
        await campaignContract.methods.refundTokenForIcoOwner(receiverAddress, withDrawAmount.toString()).send({
          from: user.data
        });

        dispatch({ type: campaignActions.CAMPAIGN_TOKENS_REFUND_SUCCESS });

        dispatch({
          type: alertActions.SUCCESS_MESSAGE,
          payload: 'Refund Tokens Successful!'
        });

        dispatch(getCampaignDetail(transactionHash));
      }
      
    } catch (err) {
      dispatch({
        type: campaignActions.CAMPAIGN_TOKENS_REFUND_FAIL,
        payload: err.message
      });

      dispatch({
        type: alertActions.ERROR_MESSAGE,
        payload: err.message
      });
    }
  }
}
