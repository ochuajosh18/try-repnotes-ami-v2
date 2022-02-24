import { AppState } from "../../index";

// selectors [added by jeff]

/**
 *
 * @param state the AppState
 * @description gets the active items among the List Management items/state
 */
export const selectListMngtItems = (state: AppState) => {
  return {
    productFamilyList: state.productFamilyState.productFamilyList.filter((i) => i.isActive),
    makeList: state.makeState.makeList.filter((i) => i.isActive),
    categoryList: state.categoryState.categoryList.filter((i) => i.isActive),
    productList: state.productState.productList.filter((i) => i.isActive),
    customerList: state.customerState.customerList.filter((i) => i.isActive),
    userList: state.userState.userList.filter((i) => i.isActive),
    customerTypeList: state.customerTypeState.customerTypeList.filter((i) => i.isActive),
    locationList: state.customerState.locationList.filter((i) => i.isActive),
    industryList: state.industryState.industryList.filter((i) => i.isActive),
    turnoverList: state.turnoverState.turnoverList.filter((i) => i.isActive),
    tierList: state.tierState.tierList.filter((i) => i.isActive),
    internationalLocalList: state.internationalLocalState.internationalLocalList.filter(
      (i) => i.isActive
    ),
    governmentPrivateList: state.governmentPrivateState.governmentPrivateList.filter(
      (i) => i.isActive
    ),
    branchList: state.branchState.data.filter((i) => i.isActive),
    // add others here
  };
};

export const selectListingStatus = (state: AppState) => {
  return (
    state.productFamilyState.loading &&
    state.makeState.loading &&
    state.categoryState.loading &&
    state.productState.loading &&
    state.customerState.loading &&
    state.userState.loading &&
    state.customerTypeState.loading &&
    state.industryState.loading &&
    state.turnoverState.loading &&
    state.tierState.loading &&
    state.internationalLocalState.loading &&
    state.governmentPrivateState.loading
  );
};
