import { testApiActions } from '../constants/testApi';
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

const testApiReducer = (state: StateType = initialState, action: AnyAction) => {
  switch (action.type) {

    case testApiActions.TEST_API_LOADING: {
      return {
        ...state,
        loading: true
      }
    } 

    case testApiActions.TEST_API_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        loading: false
      }
    }

    case testApiActions.TEST_API_FAILURE: {
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

export default testApiReducer;
