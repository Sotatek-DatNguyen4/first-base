import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from './store/constants/user';
import { getWeb3Instance, isMetaMaskInstalled } from './services/web3';
import { withRouter } from 'react-router-dom';
import InstallMetameask from './components/Base/InstallMetamask';
import BigNumber from 'bignumber.js';
import _ from 'lodash';
BigNumber.config({ EXPONENTIAL_AT: 50 });

const NETWORK_ID = process.env.REACT_APP_NETWORK_ID as string;

const AppContainer = (props: any) => {
  const dispatch = useDispatch();

  const onLoginWithoutLoginPage = async () => {
    if (isMetaMaskInstalled()) {
      const { history } = props;
      const windowObj = window as any;
      const currentNetworkId = _.get(windowObj, 'ethereum.networkVersion', '');
      if (currentNetworkId && currentNetworkId !== NETWORK_ID) {
        if (history) {
          history.push('/network-change');
        }
        return;
      }
      const pathname = _.get(history, 'location.pathname', '');

      const web3Instance = getWeb3Instance();
      if (web3Instance) {
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length) {
          dispatch({
            type: userActions.USER_LOGIN_SUCCESS,
            payload: accounts[0]
          });
          if (pathname === '/network-change') {
            history.push('/');
          }
        } else {
          dispatch({
            type: userActions.USER_LOGIN_SUCCESS,
            payload: '',
          });
          if (history) {
            history.push('/login');
          }
        }
      }
    }
  };

  useEffect(()  => {
    onLoginWithoutLoginPage();
  }, [props.location.pathname, props.history]);

  useEffect(() => {
    const windowObj = window as any;
    const { ethereum } = windowObj;
    if (ethereum) {
      ethereum.on('accountsChanged', function (accounts: any) {
        const account = accounts.length ? accounts[0] : '';
        if (account) {
          dispatch({
            type: userActions.USER_LOGIN_SUCCESS,
            payload: account,
          });
        } else {
          dispatch({
            type: userActions.USER_LOGOUT,
          });
        }
      });

      ethereum.on('networkChanged', (newNetworkId: string) => {
        const { history } = props;
        if (NETWORK_ID !== newNetworkId) {
          if (history) {
            history.push('/network-change');
          }
        } else {
          onLoginWithoutLoginPage();
        }
      });
    }
  });

  if (!isMetaMaskInstalled()) {
    return (
      <InstallMetameask />
    );
  }

  return (
    <div>
      {props.children}
    </div>
  );
};

export default withRouter(AppContainer);
