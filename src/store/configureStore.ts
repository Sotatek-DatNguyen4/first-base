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
  blacklist: [],
  whitelist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = () => {
  const store = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(...middlewares)));
  const persistor = persistStore(store);

  return {
    store,
    persistor
  }
};

export default configureStore;