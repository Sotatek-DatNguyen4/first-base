import { combineReducers } from 'redux';
import { alertReducer } from './alert'
import userReducer from './user';

import { userActions } from '../constants/user';

const appReducer = combineReducers({
  user: userReducer,
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
