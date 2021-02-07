import { userActions } from '../constants/user';
import { AnyAction } from 'redux';

type StateType = {
  data: string;
  loading: boolean;
  error: string;
};

const initialState = {
  data: '',
  loading: false,
  error: ''
};

const userReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case userActions.USER_LOGIN_LOADING: {
      return {
        ...state,
        loading: true
      }
    } 

    case userActions.USER_LOGIN_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case userActions.USER_LOGIN_FAILURE: {
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    }

    default: {
      return state;
    }
  }
};

export default userReducer;
