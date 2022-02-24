import { createStore, combineReducers, applyMiddleware, AnyAction } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";
// @ts-ignore
// import expireReducer from 'redux-persist-expire';
import storage from "redux-persist/lib/storage";
import thunk, { ThunkAction } from "redux-thunk";
import systemReducers from "./system/reducers";
import loginReducers from "./login/reducers";
import profileReducers from "./profile/reducers";
import { alertReducers } from "./alert/reducers";
import { forgotPasswordReducers } from "./forgot-password/reducers";
import { userReducers } from "./userManagement/user/reducers";
import { companyReducers } from "./listManagement/company/reducers";
import { categoryReducers } from "./listManagement/category/reducers";
import { turnoverReducers } from "./listManagement/turnover/reducers";
import { dialogReducers } from "./dialog/reducers";
import { productFamilyReducers } from "./listManagement/productFamily/reducers";
import { industryReducers } from "./listManagement/industry/reducers";
import { tierReducers } from "./listManagement/tier/reducers";
import { makeReducers } from "./listManagement/make/reducers";
import { rolesReducers } from "./userManagement/roles/reducers";
import { governmentPrivateReducers } from "./listManagement/governmentPrivate/reducers";
import { brochureReducers } from "./productManagement/brochure/reducers";
import { productReducers } from "./productManagement/product/reducers";
import { internationalLocalReducers } from "./listManagement/internationalLocal/reducers";
import { customerTypeReducers } from "./listManagement/customerType/reducers";
import { customerReducers } from "./customerManagement/customer/reducers";
import { competitionInfoReducers } from "./report/voiceOfCustomer/competitionInfo/reducers";
import { locationReducers } from "./customerManagement/location/reducers";
import { typeOfEntriesReducers } from "./report/voiceOfCustomer/typeOfEntries/reducers";
import { marginReducers } from "./report/marginReport/reducers";
import { salesOpportunitiesReducers } from "./report/salesOpportunities/reducers";
import { customerExperienceReducers } from "./report/voiceOfCustomer/customerExperience/reducers";
import { marketReducers } from "./report/marketReport/reducers";
import { unmetNeedsReducers } from "./report/voiceOfCustomer/unmetNeeds/reducers";
import { generalCommentsReducers } from "./report/voiceOfCustomer/generalComments/reducers";
import { promotionReducers } from "./productManagement/promotion/reducers";
import { productQualityReducers } from "./report/voiceOfCustomer/productQuality/reducers";
import { productPerformanceReducers } from "./report/voiceOfCustomer/productPerformance/reducers";
import { actualToTargetReducers } from "./report/actualToTarget/reducers";
import { quotesByStatusReducers } from "./report/quotesByStatus/reducers";
import { upcomingCallsReducers } from "./report/customerTouchpoint/upcomingCalls/reducers";
import { visitsCompletedReducers } from "./report/customerTouchpoint/visitsCompleted/reducers";
import { dashboardReducers } from "./dashboard/reducers";
import { fieldsReducer } from "./fieldsManagement/reducer";
import branchReducer from "./listManagement/branch/reducer";

const rootPersistConfig = {
  key: "root",
  storage: storage,
  whitelist: [
    "customerState",
    "userState",
    "brochureState",
    "productState",
    "promotionState",
    "categoryState",
    "turnoverState",
    "tierState",
    "productFamilyState",
    "industryState",
    "makeState",
    "governmentPrivateState",
    "internationalLocalState",
    "customerTypeState",
    "branchState",
  ],
};

const loginPersistConfig = {
  key: "login",
  storage: storage,
  whitelist: ["username", "rememberMe"],
};

const forgotPasswordPersistConfig = {
  key: "forgotPassword",
  storage: storage,
  whitelist: ["email"],
};

const systemPersistConfig = {
  key: "system",
  storage,
  whitelist: ["session", "drawerTab", "rememberUser", "redirectTo"],
};

const rootReducer = combineReducers({
  system: persistReducer(systemPersistConfig, systemReducers),
  login: persistReducer(loginPersistConfig, loginReducers),
  profile: profileReducers,
  forgotPassword: persistReducer(forgotPasswordPersistConfig, forgotPasswordReducers),
  alert: alertReducers,
  userState: userReducers,
  dialog: dialogReducers,
  companyList: companyReducers,
  categoryState: categoryReducers,
  turnoverState: turnoverReducers,
  tierState: tierReducers,
  productFamilyState: productFamilyReducers,
  industryState: industryReducers,
  makeState: makeReducers,
  rolesState: rolesReducers,
  governmentPrivateState: governmentPrivateReducers,
  brochureState: brochureReducers,
  productState: productReducers,
  internationalLocalState: internationalLocalReducers,
  customerTypeState: customerTypeReducers,
  customerState: customerReducers,
  competitionState: competitionInfoReducers,
  locationState: locationReducers,
  typeOfEntriesState: typeOfEntriesReducers,
  marginState: marginReducers,
  salesOpportunitiesState: salesOpportunitiesReducers,
  customerExperienceState: customerExperienceReducers,
  marketState: marketReducers,
  unmetNeedsState: unmetNeedsReducers,
  generalCommentsState: generalCommentsReducers,
  promotionState: promotionReducers,
  productQualityState: productQualityReducers,
  productPerformanceState: productPerformanceReducers,
  actualToTargetState: actualToTargetReducers,
  quotesByStatusState: quotesByStatusReducers,
  upcomingCallsState: upcomingCallsReducers,
  visitsCompletedState: visitsCompletedReducers,
  dashboardState: dashboardReducers,
  fieldsMngtState: fieldsReducer,
  branchState: branchReducer,
});

const middleware = [thunk];
const middlewareEnchancer = applyMiddleware(...middleware);
export const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
export const store =
  process.env.NODE_ENV === "development"
    ? createStore(persistedReducer, composeWithDevTools(middlewareEnchancer))
    : createStore(persistedReducer, middlewareEnchancer);
export type AppState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void | any, AppState, null, AnyAction>;

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`REACT_APP_ENV: ${process.env.REACT_APP_ENV}`);

export const persistor = persistStore(store);
