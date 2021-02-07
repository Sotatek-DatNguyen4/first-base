import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getCampaignDetail } from '../../store/actions/campaign';
import { getUsdtAllowance } from '../../store/actions/usdt-allowance';
import { buyToken } from '../../store/actions/buy-token';
import { approveUsdt } from '../../store/actions/usdt-approve';
import Form from './Form';
import Campaign from './Campaign';
import _ from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { getBalance } from '../../store/actions/balance';
import { getUsdtDetail } from '../../store/actions/usdt-detail';
import useStyles from './style';

const queryString = require('query-string');
const byTokenLogo = '/images/logo-in-buy-page.png';

const BuyToken = (props: any) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { data: campaignDetail = {}, loading: campaignDetailLoading = false } = useSelector((state: any) => state.campaignDetail);
  const { loading: buyLoading } = useSelector((state: any) => state.buyToken);
  const { data: usdtAllowance = false, loading: usdtAllowanceLoading } = useSelector((state: any) => state.usdtAllowance);
  const { loading: usdtApproveLoading = false } = useSelector((state: any) => state.usdtApprove);
  const { data: loginUser = '' } = useSelector((state: any) => state.user);
  const { data: balance = {} } = useSelector((state: any) => state.balance);
  const { data: usdtDetail = {} } = useSelector((state: any) => state.usdtDetail);
  const { history } = props;

  const searchLocation = _.get(props, 'location.search');
  const parsed = queryString.parse(searchLocation);
  const { campaignId = '', referral = '', campaignIndex = '' } = parsed;

  if (campaignDetail && campaignDetail.isSuspend) {
    history.push(`/campaign-detail/${campaignId}`);
  }

  useEffect(() => {
    if (campaignId) {
      dispatch(getCampaignDetail(campaignId));
    }
  }, [campaignId, dispatch]);

  useEffect(() => {
    if (loginUser) {
      dispatch(getBalance(loginUser));
    }
  }, [loginUser, dispatch]);

  useEffect(() => {
    dispatch(getUsdtDetail());
  }, [dispatch]);

  const submitBuyToken = (data: any) => {
    const { amount = '', unit = '' } = data;
    const buyUnit = unit || 'eth';

    if (buyUnit === 'usdt' && !usdtAllowance) {
      dispatch(approveUsdt(amount, campaignId));
      return;
    }

    if (referral) {
      dispatch(buyToken(amount, campaignId, buyUnit, referral, campaignIndex));
    } else {
      dispatch(buyToken(amount, campaignId, buyUnit, '', ''));
    }
  };

   const onUsdtAllowance = (amount: string) => {
     dispatch(getUsdtAllowance(amount, campaignId));
   };

   if (campaignDetailLoading) {
     return (
       <div className={classes.buyToken}>
         <div className={`${classes.buyToken}__wrapper`}>
           <div className={`${classes.buyToken}__loading`}>
             <CircularProgress />
           </div>
         </div>
       </div>
     )
   }

  if (!campaignDetail) {
    return (
      <div className={classes.buyToken}>
        <div className={`${classes.buyToken}__wrapper`}>
          <div className={`${classes.buyToken}__logo`}>
            <img src={byTokenLogo} alt="logo" />
          </div>
          <div className={`${classes.buyToken}__campaign-not-found`}>
            <div className="text-center text-danger">
              Campaign not found
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.buyToken}>
      <div className={`${classes.buyToken}__wrapper`}>
        <div className={`${classes.buyToken}__logo`}>
          <img src={byTokenLogo} alt="logo" />
        </div>

        <Campaign
          classNamePrefix={classes.buyToken}
          data={campaignDetail}
        />

        <Form
          classNamePrefix={classes.buyToken}
          submitBuyToken={submitBuyToken}
          campaignDetail={campaignDetail}
          buyLoading={buyLoading}
          usdtAllowanceLoading={usdtAllowanceLoading}
          usdtApproveLoading={usdtApproveLoading}
          onUsdtAllowance={onUsdtAllowance}
          usdtAllowance={usdtAllowance}
          balance={balance}
          usdtDetail={usdtDetail}
        />

      </div>
    </div>
  );
};

export default withRouter(BuyToken);
