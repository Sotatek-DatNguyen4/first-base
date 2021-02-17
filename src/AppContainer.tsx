import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from './store/constants/user';
import { getWeb3Instance, isMetaMaskInstalled } from './blockchain/web3';
import { withRouter } from 'react-router-dom';
import InstallMetameask from './components/common/install-metamask';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: 50 });

const AppContainer = (props: any) => {
  const dispatch = useDispatch();

  const onLoginWithoutLoginPage = async () => {
    if (isMetaMaskInstalled()) {
      const { history } = props;

      const web3Instance = getWeb3Instance();
      if (web3Instance) {
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length) {
          dispatch({
            type: userActions.USER_LOGIN_SUCCESS,
            payload: accounts[0]
          });
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
