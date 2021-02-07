import { userActions } from '../constants/user';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export const login = () => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch({ type: userActions.USER_LOGIN_LOADING });
    try {
      const windowObj = window as any;
      const { ethereum } = windowObj;
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const loginUser = accounts.length ? accounts[0] : '';
      dispatch({
        type: userActions.USER_LOGIN_SUCCESS,
        payload: loginUser
      });
    } catch (error) {
      dispatch({
        type: userActions.USER_LOGIN_FAILURE,
        payload: error
      });
    }
  }
};