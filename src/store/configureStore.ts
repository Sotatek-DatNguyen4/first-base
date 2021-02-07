import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const initialState = {
  user: {
    data: '',
    loading: false,
    error: '',
  },
};

const middlewares = [thunk];

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['campaigns', 'campaignCreate',  'campaignDetail', 'alert', 'campaignICORegister', 'transactionCampaign', 'transactionCampaign', 'affiliateCampaign', 'campaignAffiliateCreate', 'affiliateLinkGenerate', 'campaignErc20RateSet', 'campaignLatest', 'tokensByUser', 'tokenCreateByUser', 'campaignEdit', 'campaignStatusToggle', 'campaignRefundTokens', 'settingDeactivate'],
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(...middlewares)));
  let persistor = persistStore(store);

  return { store, persistor }
}
