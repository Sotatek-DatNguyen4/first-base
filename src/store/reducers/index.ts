import { combineReducers } from 'redux';
import { campaignsReducer, campaignCreateReducer, campaignDetailReducer, campaignICORegisterReducer, campaignAffiliateCreateReducer, campaignErc20RateSetReducer, campaignLatestReducer, campaignEditReducer, campaignStatusToggleReducer, campaignRefundTokensReducer } from './campaign'
import { transactionCampaignReducer } from './transaction'
import { affiliateCampaignReducer, affiliateLinkGenerateReducer } from './affiliate'
import { getTokensReducer, createTokenReducer } from './token'
import { alertReducer } from './alert'
import userReducer from './user';
import { buyTokenReducer } from './buy-token';
import { usdtAllowanceReducer } from './usdt-allowance';
import { usdtApproveReducer } from './usdt-approve';
import { settingDetailReducer } from './setting-detail';
import { settingFeeRateReducer } from './setting-fee-rate';
import { settingRevenueAddressReducer } from './setting-revenue-address';
import { settingDeactivateReducer } from './setting-deactivate';
import { settingOwnerReducer } from './setting-owner';
import { balanceReducer } from './balance';
import { usdtDetailReducer } from './usdt-detail';
import { userActions } from '../constants/user';

const appReducer = combineReducers({
  user: userReducer,
  campaigns: campaignsReducer,
  campaignCreate: campaignCreateReducer,
  campaignEdit: campaignEditReducer,
  campaignDetail: campaignDetailReducer,
  campaignICORegister: campaignICORegisterReducer,
  campaignAffiliateCreate: campaignAffiliateCreateReducer,
  campaignErc20RateSet: campaignErc20RateSetReducer,
  campaignLatest: campaignLatestReducer,
  campaignStatusToggle: campaignStatusToggleReducer,
  campaignRefundTokens: campaignRefundTokensReducer,
  transactionCampaign: transactionCampaignReducer,
  affiliateCampaign: affiliateCampaignReducer,
  affiliateLinkGenerate: affiliateLinkGenerateReducer,
  buyToken: buyTokenReducer,
  usdtAllowance: usdtAllowanceReducer,
  usdtApprove: usdtApproveReducer,
  settingDetail: settingDetailReducer,
  settingFeeRate: settingFeeRateReducer,
  settingRevenueAddress: settingRevenueAddressReducer,
  settingOwner: settingOwnerReducer,
  settingDeactivate: settingDeactivateReducer,
  tokensByUser:  getTokensReducer,
  tokenCreateByUser: createTokenReducer,
  balance: balanceReducer,
  usdtDetail: usdtDetailReducer,
  alert: alertReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: any, action: any) => {
  if (action.type === userActions.USER_LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
