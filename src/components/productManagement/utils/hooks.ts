import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCategoryList } from "../../../store/listManagement/category/actions";
import { getIndustryList } from "../../../store/listManagement/industry/actions";
import { getMakeList } from "../../../store/listManagement/make/actions";
import { getProductFamilyList } from "../../../store/listManagement/productFamily/actions";
import {
  selectListingStatus,
  selectListMngtItems,
} from "../../../store/listManagement/utils/selectors";
import {
  loadProductDetails,
  selectProductState,
  setProductState,
} from "../../../store/productManagement/product/actions";

import { selectSystemState } from "../../../store/system/actions";
import {
  EMPTY_OPTIONAL_FEATURE,
  EMPTY_PRODUCT,
  EMPTY_STANDARD_FEATURE,
} from "../../../util/constants";
import {
  mapToAreaOptions,
  mapToOptions,
  mapToProductOptions,
  maptoProvinceOrCity,
} from "../../../util/utils";
import without from "lodash/without";
import map from "lodash/map";
import { getInternationalLocalList } from "../../../store/listManagement/internationalLocal/actions";
import { getCustomerTypeList } from "../../../store/listManagement/customerType/actions";
import { getProductList } from "../../../store/productManagement/product/actions";
import { getTierList } from "../../../store/listManagement/tier/actions";
import { getTurnoverList } from "../../../store/listManagement/turnover/actions";
import { getUserList } from "../../../store/userManagement/user/actions";
import {
  getCustomerList,
  getLocationList,
  selectCustomerState,
} from "../../../store/customerManagement/customer/actions";
import { getGovernmentPrivateList } from "../../../store/listManagement/governmentPrivate/actions";
import { fetchBranchList } from "../../../store/listManagement/branch/actions";

export type ListMapType =
  | Record<string, ReturnType<typeof mapToOptions>>
  | Record<string, ReturnType<typeof mapToAreaOptions>>;

export function useListMngtMap() {
  const dispatch = useDispatch();
  const system = useSelector(selectSystemState);
  const customerState = useSelector(selectCustomerState);
  const productState = useSelector(selectProductState);
  const listMngtItems = useSelector(selectListMngtItems);
  const {
    productFamilyList,
    categoryList,
    makeList,
    industryList,
    locationList,
    internationalLocalList,
    governmentPrivateList,
    customerList,
    customerTypeList,
    productList,
    tierList,
    turnoverList,
    userList,
    branchList,
  } = listMngtItems;

  const isListingsLoading = useSelector(selectListingStatus);

  const { customer } = customerState;
  const { selectedCompanyId } = productState;
  // load items from List Mngt
  useEffect(() => {
    dispatch(getProductFamilyList(system, selectedCompanyId));
    dispatch(getMakeList(system, selectedCompanyId));
    dispatch(getCategoryList(system, selectedCompanyId));
    dispatch(getIndustryList(system, selectedCompanyId));
    dispatch(getLocationList(system, selectedCompanyId));
    dispatch(getGovernmentPrivateList(system, selectedCompanyId));
    dispatch(getInternationalLocalList(system, selectedCompanyId));
    dispatch(getCustomerList(system, selectedCompanyId));
    dispatch(getCustomerTypeList(system, selectedCompanyId));
    dispatch(getProductList(system, selectedCompanyId));
    dispatch(getTierList(system, selectedCompanyId));
    dispatch(getTurnoverList(system, selectedCompanyId));
    dispatch(getUserList(system, selectedCompanyId));
    dispatch(fetchBranchList(selectedCompanyId));
  }, [dispatch, selectedCompanyId, system]);

  let province = without(
    map(locationList, (data) => {
      if (data.area === customer?.area) return data.province;
    }),
    undefined
  );

  let cityTown = without(
    map(province[0], (data: any) => {
      if (data.name === customer?.province) return data.city;
    }),
    undefined
  );

  const listMngtMap: ListMapType = {
    "Product Family": mapToOptions(productFamilyList),
    Category: mapToOptions(categoryList),
    Make: mapToOptions(makeList),
    Industry: mapToOptions(industryList),
    Province: maptoProvinceOrCity(province, "province"),
    "City/Town": maptoProvinceOrCity(cityTown, "city/town"),
    "International Local": mapToOptions(internationalLocalList),
    "Government/Private": mapToOptions(governmentPrivateList),
    Customer: mapToOptions(customerList),
    "Customer Type": mapToOptions(customerTypeList),
    Product: mapToProductOptions(productList),
    Tier: mapToOptions(tierList),
    Turnover: mapToOptions(turnoverList),
    "Sales Engineer": mapToOptions(userList),
    Area: mapToAreaOptions(locationList),
    Branch: mapToOptions(branchList),
  };

  return { listMngtMap, isListingsLoading };
}

export function useProductLoader() {
  const { id: paramsId } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const system = useSelector(selectSystemState);
  const productState = useSelector(selectProductState);
  const { selectedCompanyId } = productState;
  const token = system.session.token;
  // load initial values
  useEffect(() => {
    if (paramsId === "new") {
      dispatch(
        setProductState({
          product: {
            ...EMPTY_PRODUCT,
            companyId: selectedCompanyId,
          },
          standardMachineFeature: EMPTY_STANDARD_FEATURE,
          optionalMachineFeature: EMPTY_OPTIONAL_FEATURE,
        })
      );
    } else {
      dispatch(loadProductDetails(paramsId, token));
    }
  }, [dispatch, paramsId, selectedCompanyId, token]);
}

export function useProductErrorMap() {
  const productState = useSelector(selectProductState);
  const { validation, product } = productState;
  const errorMap = product
    ? Object.keys(product).reduce(
        (mapped, currKey) => ({
          ...mapped,
          [currKey]: !validation ? false : validation && product[currKey] === "" ? true : false,
        }),
        {}
      )
    : {};
  return errorMap;
}
