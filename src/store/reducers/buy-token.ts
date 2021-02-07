import { buyTokenActions } from '../constants/buy-token';
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

export const buyTokenReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case buyTokenActions.BUY_TOKEN_LOADING: {
      return {
        ...state,
        loading: true,
        error: '',
      }
    }

    case buyTokenActions.BUY_TOKEN_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: '',
      }
    }

    case buyTokenActions.BUY_TOKEN_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    }

    default: {
      return state;
    }
  }
};
