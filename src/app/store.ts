import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import sessionStorage from "redux-persist/lib/storage/session";
import companySlice from "../features/companySlice";
import userSlice from "../features/userSlice";
import userRoleSlice from "../features/userRolesSlice";
import financialYearSlice from "../features/financialYearSlice";
import rememberUserSlice from "../features/userRememberSlice";
import themeSlice from "../features/themeSlice";
import defaultDateSlice from "../features/defaultDateSlice";
import posSlice from "../features/posSlice";
import sortSlice from "../features/sortSlice";
import braSlice from "../features/braSlice";
import invSlice from "../features/invSlice";
import purSlice from "../features/purSlice";
import ormgSlice from "../features/ormgSlice";
import purorSlice from "../features/purorSlice";
import quoSlice from "../features/quoSlice";
import purproSlice from "../features/productAllSlice/productpur";
import invoiceSlice from "../features/invSlice/otherInv";
import printqrSlice from "../features/productAllSlice/printqr";
import purotherSlice from "../features/productAllSlice/otherpur";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["user"],
};

const userPersistConfig = {
  key: "user",
  storage: sessionStorage,
};

// Combining reducers
const rootReducer = combineReducers({
  company: companySlice,
  user: persistReducer(userPersistConfig, userSlice),
  userRoles: userRoleSlice,
  financialYear: financialYearSlice,
  userRemember: rememberUserSlice,
  theme: themeSlice,
  defaultDate: defaultDateSlice,
  posData: posSlice,
  sort: sortSlice,
  branchData: braSlice,
  invData: invSlice,
  invotherData: invoiceSlice,
  purData: purSlice,
  purotherData: purotherSlice,
  purporData: purproSlice,
  printqrData: printqrSlice,
  ormgData: ormgSlice,
  purorData: purorSlice,
  quoData: quoSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
