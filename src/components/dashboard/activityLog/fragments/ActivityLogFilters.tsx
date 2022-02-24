import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { RepnotesInput } from "../../../common/RepnotesInput";
import { useDispatch, useSelector } from "react-redux";
import { loadListManagementItems, selectSystemState } from "../../../../store/system/actions";
import { getCompany, selectCompanyList } from "../../../../store/listManagement/company/actions";
import {
  getMeetingsLogs,
  getNotesLogs,
  getSalesOppsAndQuotesLogs,
  resetFilter,
  selectDashboardState,
  setDashboardState,
} from "../../../../store/dashboard/actions";
import { LIST_ITEMS } from "../utils/constants";
import {
  selectCustomerState,
  setCustomerState,
} from "../../../../store/customerManagement/customer/actions";
import { selectLocationState } from "../../../../store/customerManagement/location/actions";
import { DynamicDashboardType } from "../../../../store/dashboard/types";
import { flatMap } from "lodash";

// const allOption = {
//   label: "All",
//   value: "",
// };

const ActivityLogFilters = () => {
  // hooks
  const dispatch = useDispatch();
  const system = useSelector(selectSystemState);
  const { companyArray } = useSelector(selectCompanyList);
  const dashboardState = useSelector(selectDashboardState);
  const customerState = useSelector(selectCustomerState);
  const locationState = useSelector(selectLocationState);
  // derived states
  const { token, userDetails } = system.session;
  const role = system.session ? userDetails.role : "";
  const isSuperAdmin = role === "SUPER ADMIN";

  const {
    filterSelectedCompany,
    filterSelectedSalesperson,
    filterSelectedCustomer,
    filterSelectedProvince,
  } = dashboardState;
  const { salesPersonList, customerList } = customerState;
  const { locationList } = locationState;

  const companyOptions = companyArray
    .filter((c) => c.isActive)
    .map((item) => ({
      id: item.companyId,
      name: item.name,
    }));

  const salesPersonOptions = salesPersonList
    .filter((s) => s.isActive)
    .map((item) => ({
      label: item.name,
      value: item.id,
    }));

  const customerOptions = customerList
    .filter((s) => s.isActive)
    .map((item) => ({
      label: item.name,
      value: item.id,
    }));

  const provinceOptions = flatMap(locationList, (area) =>
    flatMap(area.province, (province) => ({
      value: province.name,
      label: province.name,
    }))
  );

  //const currentCustomer = customerList.find((c) => c.id === filterSelectedCustomer);

  // load list of companies
  useEffect(() => {
    if (!token || !isSuperAdmin) return;
    dispatch(getCompany(token));
  }, [dispatch, token, isSuperAdmin]);

  // if not super admin,
  // set the filter company to current
  // company of the user

  useEffect(() => {
    dispatch(setCustomerState({ salesPersonList: [], customerList: [] }));

    if (!isSuperAdmin) {
      dispatch(setDashboardState({ filterSelectedCompany: userDetails.companyId }));
    }
  }, [dispatch, isSuperAdmin, userDetails.companyId]);

  // load list items
  useEffect(() => {
    if (!filterSelectedCompany) return;
    dispatch(loadListManagementItems(LIST_ITEMS, filterSelectedCompany));
  }, [dispatch, filterSelectedCompany, system]);

  // useEffect(() => {
  //   // if a customer is changed, update the salesperson
  //   if (!currentCustomer) return;
  //   const salesPerson = salesPersonList.find((s) => s.name === currentCustomer.salesPerson);

  //   if (!salesPerson) return;
  //   dispatch(setDashboardState({ filterSelectedSalesperson: salesPerson.id }));
  // }, [currentCustomer, dispatch, salesPersonList]);

  function handleFilterChange(field: keyof typeof dashboardState, value: DynamicDashboardType) {
    dispatch(setDashboardState({ [field]: value }));

    if (field === "filterSelectedCompany") {
      dispatch(
        resetFilter([
          "filterSelectedSalesperson",
          "filterSelectedProvince",
          "filterSelectedCustomer",
        ])
      );
    }
    dispatch(getSalesOppsAndQuotesLogs());
    dispatch(getMeetingsLogs());
    dispatch(getNotesLogs());
  }

  return (
    <Grid container spacing={3}>
      {isSuperAdmin && (
        <Grid item xs={12} sm={3}>
          <RepnotesInput
            id='act-log-company-list'
            type='select'
            label='Company Name'
            labelPosition='top'
            firstSelectOption={filterSelectedCompany !== "" ? "removeall" : ""}
            value={filterSelectedCompany}
            options={companyOptions}
            onSelectChange={(e) =>
              handleFilterChange("filterSelectedCompany", e.target.value as string)
            }
          />
        </Grid>
      )}
      {(role as string).toLowerCase() !== "sales engineer" && (
        <Grid item xs={12} sm={3}>
          <RepnotesInput
            id='act-log-salesperson-list'
            type='searchabledropdown'
            label='Salesperson'
            labelPosition='top'
            value={filterSelectedSalesperson}
            autocompleteOptions={salesPersonOptions}
            onAutocompleteChange={(e, o) => {
              handleFilterChange("filterSelectedSalesperson", o ? o.value : "");
            }}
            disableAutocompletePopover
          />
        </Grid>
      )}
      <Grid item xs={12} sm={3}>
        <RepnotesInput
          id='act-log-customer-list'
          type='searchabledropdown'
          label='Customer'
          labelPosition='top'
          value={filterSelectedCustomer}
          autocompleteOptions={customerOptions}
          onAutocompleteChange={(e, o) => {
            handleFilterChange("filterSelectedCustomer", o ? o.value : "");
          }}
          disableAutocompletePopover
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <RepnotesInput
          id='act-log-province-list'
          type='searchabledropdown'
          label='Province'
          labelPosition='top'
          value={filterSelectedProvince}
          autocompleteOptions={provinceOptions}
          onAutocompleteChange={(e, o) => {
            handleFilterChange("filterSelectedProvince", o ? o.value : "");
          }}
          disableAutocompletePopover
        />
      </Grid>
    </Grid>
  );
};

export default ActivityLogFilters;
