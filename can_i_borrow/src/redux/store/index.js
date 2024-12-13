import { combineReducers, configureStore } from "@reduxjs/toolkit";
import oggettoReducer from "../reducers/oggettoReducer";
import utenteReducer from "../reducers/utenteReducer";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import tokenReducer from "../reducers/tokenReducer";
import bookingReducer from "../reducers/bookingReducer";


const secretKey = process.env.REACT_APP_PERSIST_SECRET



const persistConfig = {
  key: 'root',
  storage,
  transforms: [
    encryptTransform({
      secretKey: secretKey,
      onError: (error) => {
        console.error('Errore durante la crittografia:', error);
      },
    }),
  ],
};

const allReducers = combineReducers({
  oggetti: oggettoReducer,
  utenti: utenteReducer,
  token: tokenReducer,
  bookings: bookingReducer
});

const persistedReducer = persistReducer(persistConfig, allReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        warnAfter: 128,
      },
    }),
});


export const persistor = persistStore(store);
export default store;
