import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, match } from "react-router";
import { AppState } from "../../../store";
import { SystemState } from "../../../store/system/types";
import { DialogState } from "../../../store/dialog/types";
// import { AlertState } from '../../../store/alert/types';
import {
  CustomerDetails,
  CustomerState,
} from "../../../store/customerManagement/customer/types";
import { AlertState } from "../../../store/alert/types";
import { TierState } from "../../../store/listManagement/tier/types";
import { CustomerTypeState } from "../../../store/listManagement/customerType/types";
import { InternationalLocalState } from "../../../store/listManagement/internationalLocal/types";
import { IndustryState } from "../../../store/listManagement/industry/types";
import { GovernmentPrivateState } from "../../../store/listManagement/governmentPrivate/types";
import { TurnoverState } from "../../../store/listManagement/turnover/types";
import {
  setCustomerState,
  loadCustomerDetails,
  saveCustomer,
  updateCustomerDetails,
  setCustomerValidationState,
  getSalesPersonList,
  getLocationList,
} from "../../../store/customerManagement/customer/actions";
import { getTierList } from "../../../store/listManagement/tier/actions";
import { getCustomerTypeList } from "../../../store/listManagement/customerType/actions";
import { getIndustryList } from "../../../store/listManagement/industry/actions";
import { getInternationalLocalList } from "../../../store/listManagement/internationalLocal/actions";
import { getGovernmentPrivateList } from "../../../store/listManagement/governmentPrivate/actions";
import { getTurnoverList } from "../../../store/listManagement/turnover/actions";
import { clearDialog, setDialogOpen } from "../../../store/dialog/actions";
import { setRedirect } from "../../../store/system/actions";
import { openAlert } from "../../../store/alert/actions";
import {
  RepnotesDefaultButton,
  RepnotesPrimaryButton,
} from "../../common/RepnotesButton";
import {
  LoadingDialog,
  // RepnotesAlert,
  RepnotesDialog,
} from "../../common/RepnotesAlerts";
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { RepnotesInput } from "../../common/RepnotesInput";
// material
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
// utils
import forEach from "lodash/forEach";
import map from "lodash/map";
import filter from "lodash/filter";
import without from "lodash/without";
import { emailValidator } from "../../../util/utils";
import { numberValidator } from "../../../util/utils";

interface RepnotesCustomerFormProps {
  saveCustomer: typeof saveCustomer;
  loadCustomerDetails: typeof loadCustomerDetails;
  setCustomerState: typeof setCustomerState;
  updateCustomerDetails: typeof updateCustomerDetails;
  setCustomerValidationState: typeof setCustomerValidationState;
  getCustomerTypeList: typeof getCustomerTypeList;
  getIndustryList: typeof getIndustryList;
  getInternationalLocalList: typeof getInternationalLocalList;
  getGovernmentPrivateList: typeof getGovernmentPrivateList;
  getTierList: typeof getTierList;
  getTurnoverList: typeof getTurnoverList;
  getSalesPersonList: typeof getSalesPersonList;
  getLocationList: typeof getLocationList;
  setRedirect: typeof setRedirect;
  setDialogOpen: typeof setDialogOpen;
  clearDialog: typeof clearDialog;
  openAlert: typeof openAlert;
  customerTypeState: CustomerTypeState;
  industryState: IndustryState;
  internationalLocalState: InternationalLocalState;
  governmentPrivateState: GovernmentPrivateState;
  tierState: TierState;
  turnoverState: TurnoverState;
  customerState: CustomerState;
  system: SystemState;
  alert: AlertState;
  dialog: DialogState;
}

const EMPTY_CUSTOMER = {
  companyId: "",
  name: "",
  isActive: true,
  customerTypeId: "",
  industryId: "",
  internationalLocalId: "",
  fleetSize: "",
  branch: "",
  streetAddress: "",
  area: "",
  province: "",
  cityTown: "",
  category: "",
  groupName: "",
  salesPersonDocId: "",
  governmentPrivateId: "",
  tierId: "",
  turnOverId: "",
  contactNo1: "",
  contactNo2: "",
  email: "",
  internalTag: "",
  additionalNotes: "",
  status: "Approved",
  id: "",
} as CustomerDetails;

const STATUS_ARRAY = [
  { id: "true", name: "Active" },
  { id: "false", name: "Inactive" },
];

const CUSTOMER_CATEGORY_ARRAY = [
  { id: "Mother", name: "Mother" },
  { id: "Child", name: "Child" },
];

interface MatchParams {
  params: { id: string };
}

interface RouteParams extends RouteComponentProps {
  match: match & MatchParams;
}

class RepnotesCustomerForm extends Component<
  RepnotesCustomerFormProps & RouteParams
> {
  componentDidMount = () => {
    if (this.props.match.params.id === "new")
      this.props.setCustomerState({
        customer: {
          ...EMPTY_CUSTOMER,
          companyId: this.props.customerState.selectedCompanyId,
        },
      });
    else
      this.props.loadCustomerDetails(
        this.props.match.params.id,
        this.props.system.session.token
      );
    this._loadQuery();
  };

  componentWillUnmount = () =>
    this.props.setCustomerState({ customerList: [] });

  _loadQuery = () => {
    this.props.getCustomerTypeList(
      this.props.system,
      this.props.customerState.selectedCompanyId
    );
    this.props.getIndustryList(
      this.props.system,
      this.props.customerState.selectedCompanyId
    );
    this.props.getInternationalLocalList(
      this.props.system,
      this.props.customerState.selectedCompanyId
    );
    this.props.getGovernmentPrivateList(
      this.props.system,
      this.props.customerState.selectedCompanyId
    );
    this.props.getTierList(
      this.props.system,
      this.props.customerState.selectedCompanyId
    );
    this.props.getTurnoverList(
      this.props.system,
      this.props.customerState.selectedCompanyId
    );
    this.props.getSalesPersonList(
      this.props.system,
      this.props.customerState.selectedCompanyId
    );
    this.props.getLocationList(
      this.props.system,
      this.props.customerState.selectedCompanyId
    );
  };

  _customerInput = (field: string, value: string | boolean) => {
    const { customer } = this.props.customerState;
    const newCustomer = { ...customer, [field]: value };
    this.props.setCustomerState({ customer: newCustomer });
  };

  _onOpenDialog = () => {
    this.props.setDialogOpen({
      dialogOpen: true,
      dialogLabel: this.props.customerState.customer
        ? this.props.customerState.customer.name
        : "",
      dialogType: "save",
      docId: "",
    });
  };

  _onCloseDialog = () => {
    this.props.clearDialog();
    this._onSaveUser();
  };

  _onSaveUser = () => {
    if (this.props.match.params.id === "new")
      this.props.saveCustomer(
        this.props.customerState.customer as CustomerDetails,
        this.props.system,
        this.props.customerState.selectedCompanyId
      );
    else
      this.props.updateCustomerDetails(
        this.props.customerState.customer as CustomerDetails,
        this.props.system.session.token
      );
  };

  _onClickSave = () => {
    const { customer } = this.props.customerState;
    if (customer) {
      let required = [
        "name",
        "contactNo1",
        "category",
        "customerTypeId",
        "industryId",
        "area",
        "province",
        "cityTown",
        "salesPersonDocId",
      ];
      if (this.props.customerState.customer?.category !== "Mother")
        required.push("groupName");
      let internal = 0;
      forEach(required, (item, index) => {
        if (customer[item] === "")
          this.props.setCustomerValidationState({ validation: true });
        if (customer[item] !== "") internal++;
        if (customer["category"] === "Mother")
          this._customerInput("groupName", "");
      });
      if (required.length === internal) {
        if (
          !numberValidator(
            this.props.customerState.customer?.contactNo1 as string
          )
        ) {
          this.props.openAlert(
            "Invalid Contact Number - Contact No 1",
            "warning"
          );
        } else if (
          this.props.customerState.customer?.email !== "" &&
          !emailValidator(this.props.customerState.customer?.email as string)
        ) {
          this.props.openAlert("Invalid Email", "warning");
        } else if (
          this.props.customerState.customer?.contactNo2 !== "" &&
          !numberValidator(
            this.props.customerState.customer?.contactNo2 as string
          )
        ) {
          this.props.openAlert(
            "Invalid Contact Number - Contact No 2",
            "warning"
          );
        } else {
          this._onOpenDialog();
        }
      }
    }
  };

  render = () => {
    const {
      customerList,
      customer,
      salesPersonList,
      validation,
      loading,
      locationList,
    } = this.props.customerState;
    const { tierList } = this.props.tierState;
    const { turnoverList } = this.props.turnoverState;
    const { governmentPrivateList } = this.props.governmentPrivateState;
    const { customerTypeList } = this.props.customerTypeState;
    const { internationalLocalList } = this.props.internationalLocalState;
    const { industryList } = this.props.industryState;
    const { modules } = this.props.system.session;

    const motherList = filter(
      customerList,
      (item) => item.category === "Mother" && item.isActive
    );

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

    let filteredCustomerTypeList = customerTypeList.filter(
      (item) => item.isActive
    );

    let filteredIndustryList = industryList.filter((item) => item.isActive);

    let filteredInternationalLocalList = internationalLocalList.filter(
      (item) => item.isActive
    );

    let filteredGovernmentPrivateList = governmentPrivateList.filter(
      (item) => item.isActive
    );

    let filteredTierList = tierList.filter((item) => item.isActive);

    let filteredTurnoverList = turnoverList.filter((item) => item.isActive);

    let filteredSalespersonlist = salesPersonList.filter(
      (item) => item.isActive
    );

    return (
      <Box className='repnotes-content'>
        {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
        <RepnotesDialog
          label={this.props.dialog.dialogLabel}
          open={this.props.dialog.dialogOpen}
          severity={this.props.dialog.dialogType}
          onClick={this._onCloseDialog.bind(this)}
          onClear={this.props.clearDialog}
        />
        <Grid container>
          <Grid
            item
            xs={12}
            style={{ textAlign: "left", paddingTop: "10px 0px" }}
          >
            <RepnotesContentHeader
              moduleName='Customer Management'
              subModule='Customer'
            />
          </Grid>
        </Grid>
        <Grid
          container
          justify='flex-end'
          style={{ padding: "10px 0", position: "relative", right: -3 }}
        >
          <RepnotesDefaultButton
            onClick={() =>
              this.props.setRedirect({
                shallRedirect: true,
                redirectTo: "/customer",
              })
            }
          >
            Cancel
          </RepnotesDefaultButton>
          {(modules.customer.edit || this.props.match.params.id === "new") && (
            <>
              {loading ? (
                <RepnotesPrimaryButton>
                  <CircularProgress
                    style={{
                      display: "flex",
                      width: 20,
                      height: 20,
                      color: "#fff",
                      padding: 3,
                    }}
                  />
                </RepnotesPrimaryButton>
              ) : (
                <RepnotesPrimaryButton
                  className='no-margin-right'
                  onClick={this._onClickSave.bind(this)}
                >
                  Save
                </RepnotesPrimaryButton>
              )}
            </>
          )}
        </Grid>
        <Grid className='repnotes-form' container spacing={1}>
          {customer ? (
            <Grid container>
              <Grid item xs={6}>
                <RepnotesInput
                  id='repnotes-customer-name'
                  type='text'
                  placeholder='Name'
                  label='Name'
                  labelPosition='left'
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && customer.name === ""
                      ? true
                      : false
                  }
                  value={customer.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._customerInput("name", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-type'
                  type='select'
                  label='Customer Type'
                  labelPosition='left'
                  value={customer.customerTypeId}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && customer.customerTypeId === ""
                      ? true
                      : false
                  }
                  options={map(filteredCustomerTypeList, (data) => ({
                    id: data.id,
                    name: data.name,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput(
                      "customerTypeId",
                      e.target.value as string
                    );
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-industry'
                  type='select'
                  label='Industry'
                  labelPosition='left'
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  value={customer.industryId}
                  error={
                    !validation
                      ? false
                      : validation && customer.industryId === ""
                      ? true
                      : false
                  }
                  options={map(filteredIndustryList, (data) => ({
                    id: data.id,
                    name: data.name,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput("industryId", e.target.value as string);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-international-local'
                  type='select'
                  label='International Local'
                  labelPosition='left'
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  value={customer.internationalLocalId}
                  options={map(filteredInternationalLocalList, (data) => ({
                    id: data.id,
                    name: data.name,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput(
                      "internationalLocalId",
                      e.target.value as string
                    );
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-fleet-size'
                  type='text'
                  placeholder='Fleet Size'
                  label='Fleet Size'
                  labelPosition='left'
                  value={customer.fleetSize}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._customerInput("fleetSize", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-branch'
                  type='text'
                  placeholder='Branch'
                  label='Branch'
                  labelPosition='left'
                  value={customer.branch}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._customerInput("branch", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-street-address'
                  type='text'
                  placeholder='Street Address'
                  label='Street Address'
                  labelPosition='left'
                  value={customer.streetAddress}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._customerInput("streetAddress", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-area'
                  type='select'
                  label='Area'
                  labelPosition='left'
                  value={customer.area}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && customer.area === ""
                      ? true
                      : false
                  }
                  options={map(locationList, (data: any) => ({
                    id: data.area,
                    name: data.area,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput("area", e.target.value as string);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-province'
                  type='select'
                  label='Province'
                  labelPosition='left'
                  value={customer.province}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && customer.province === ""
                      ? true
                      : false
                  }
                  options={map(province[0], (data: any) => ({
                    id: data.name,
                    name: data.name,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput("province", e.target.value as string);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-city'
                  type='select'
                  label='City/Town'
                  labelPosition='left'
                  value={customer.cityTown}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && customer.cityTown === ""
                      ? true
                      : false
                  }
                  options={map(cityTown[0], (data) => ({
                    id: data,
                    name: data,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput("cityTown", e.target.value as string);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-status'
                  type='select'
                  label='Status'
                  labelPosition='left'
                  value={customer.isActive}
                  options={STATUS_ARRAY}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput(
                      "isActive",
                      e.target.value === "true" ? true : false
                    );
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <RepnotesInput
                  id='repnotes-customer-category'
                  type='select'
                  label='Customer Category'
                  labelPosition='left'
                  value={customer.category}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && customer.category === ""
                      ? true
                      : false
                  }
                  options={CUSTOMER_CATEGORY_ARRAY}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput("category", e.target.value as string);
                  }}
                />
                <RepnotesInput
                  id='repnotes-group'
                  type='select'
                  label='Group Name'
                  labelPosition='left'
                  error={
                    !validation
                      ? false
                      : validation && customer.groupName === ""
                      ? true
                      : false
                  }
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : customer.category === "Child"
                      ? false
                      : true
                  }
                  value={customer.groupName}
                  options={
                    customer.category === "Child"
                      ? map(motherList, (data: any) => ({
                          id: data.id,
                          name: data.name,
                        }))
                      : []
                  }
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput("groupName", e.target.value as string);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-salesperson'
                  type='select'
                  label='Salesperson'
                  labelPosition='left'
                  value={customer.salesPersonDocId}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && customer.salesPersonDocId === ""
                      ? true
                      : false
                  }
                  options={map(filteredSalespersonlist, (data) => ({
                    id: data.id,
                    name: data.name,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput(
                      "salesPersonDocId",
                      e.target.value as string
                    );
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-government-private'
                  type='select'
                  label='Government/Private'
                  labelPosition='left'
                  value={customer.governmentPrivateId}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  options={map(filteredGovernmentPrivateList, (data) => ({
                    id: data.id,
                    name: data.name,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput(
                      "governmentPrivateId",
                      e.target.value as string
                    );
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-tier'
                  type='select'
                  label='Tier'
                  labelPosition='left'
                  value={customer.tierId}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  options={map(filteredTierList, (data) => ({
                    id: data.id,
                    name: data.name,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput("tierId", e.target.value as string);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-turnover'
                  type='select'
                  label='Turnover'
                  labelPosition='left'
                  value={customer.turnOverId}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  options={map(filteredTurnoverList, (data) => ({
                    id: data.id,
                    name: data.name,
                  }))}
                  onSelectChange={(
                    e: React.ChangeEvent<{ name?: string; value: unknown }>
                  ) => {
                    this._customerInput("turnOverId", e.target.value as string);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-contact-1'
                  type='text'
                  placeholder='Contact No. 1*'
                  label='Contact No. 1'
                  labelPosition='left'
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  error={
                    !validation
                      ? false
                      : validation && customer.contactNo1 === ""
                      ? true
                      : false
                  }
                  value={customer.contactNo1}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._customerInput("contactNo1", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-contact-2'
                  type='text'
                  placeholder='Contact No. 2'
                  label='Contact No. 2'
                  labelPosition='left'
                  value={customer.contactNo2}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._customerInput("contactNo2", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-email-address'
                  type='text'
                  placeholder='Email Address'
                  label='Email Address'
                  labelPosition='left'
                  value={customer.email}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._customerInput("email", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-internal-tag'
                  type='text'
                  placeholder='internal Tag'
                  label='Internal Tag'
                  labelPosition='left'
                  value={customer.internalTag}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._customerInput("internalTag", e.target.value);
                  }}
                />
                <RepnotesInput
                  id='repnotes-customer-additional-notes'
                  type='text'
                  placeholder='Additional Notes'
                  label='Additional Notes'
                  labelPosition='left'
                  value={customer.additionalNotes}
                  disabled={
                    !modules.customer.edit &&
                    this.props.match.params.id !== "new"
                      ? true
                      : false
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._customerInput("additionalNotes", e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <LoadingDialog />
          )}
        </Grid>
      </Box>
    );
  };
}

export const mapStateToProps = (state: AppState) => ({
  system: state.system,
  alert: state.alert,
  customerState: state.customerState,
  dialog: state.dialog,
  customerTypeState: state.customerTypeState,
  industryState: state.industryState,
  internationalLocalState: state.internationalLocalState,
  governmentPrivateState: state.governmentPrivateState,
  tierState: state.tierState,
  turnoverState: state.turnoverState,
});

export default connect(mapStateToProps, {
  setCustomerState,
  saveCustomer,
  updateCustomerDetails,
  setCustomerValidationState,
  getCustomerTypeList,
  getIndustryList,
  getInternationalLocalList,
  getGovernmentPrivateList,
  getTierList,
  getTurnoverList,
  getLocationList,
  getSalesPersonList,
  setRedirect,
  loadCustomerDetails,
  setDialogOpen,
  clearDialog,
  openAlert,
})(RepnotesCustomerForm);
