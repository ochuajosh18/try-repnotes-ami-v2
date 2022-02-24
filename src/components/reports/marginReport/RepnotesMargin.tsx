import { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { ListItem, SystemState } from "../../../store/system/types";
// import { AlertState } from '../../../store/alert/types';
import { DialogState } from "../../../store/dialog/types";
import { DynamicMarginReportType, MarginState } from "../../../store/report/marginReport/types";
import { CompanyState } from "../../../store/listManagement/company/types";
import { MakeState } from "../../../store/listManagement/make/types";
import { CustomerState } from "../../../store/customerManagement/customer/types";
import { setCustomerState } from "../../../store/customerManagement/customer/actions";
import { superAdminCompanyValidation } from "../../../store/userManagement/user/actions";
import { getCompany } from "../../../store/listManagement/company/actions";
import {
  clearImportDialog,
  getMarginCustomerTypeList,
  getMarginInfo,
  getMarginModelList,
  getMarginProductFamilyList,
  getMarginProvinceList,
  getMarginCustomerList,
  importMarginData,
  saveImportData,
  setMarginState,
  exportMarginReport,
  resetFilter,
} from "../../../store/report/marginReport/actions";
import {
  setRedirect,
  resetReportsState,
  loadListManagementItems,
  resetProductManagementState,
} from "../../../store/system/actions";
import { clearDialog, setDialogOpen } from "../../../store/dialog/actions";
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { LoadingDialog } from "../../common/RepnotesAlerts";
import { RepnotesGraphicalLine } from "./RepnotesMarginLine";
import { RepnotesInput } from "../../common/RepnotesInput";
import { RepnotesMarginImport } from "./RepnotesMarginImportDialog";
import MarginReport from "./fragments/MarginReport";
import {
  RepnotesVOCCardCost,
  RepnotesVOCCardInvoiceAmount,
  RepnotesPercentCard,
} from "../voiceOfCustomer/RepnotesVOCCard";
import MarginReportFilterPopover from "./fragments/MarginReportFilterPopover";
import { MarginReportContainer } from "./fragments/MarginComponents";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import map from "lodash/map";
import moment from "moment";
import MarginDateRange from "./fragments/MarginDateRange";

const LIST_ITEMS: Array<ListItem> = [
  "Salesperson",
  "Customer",
  "Customer Type",
  "Product Family",
  "Product",
  "Location",
];
interface MarginProps {
  resetProductManagementState: typeof resetProductManagementState;
  setCustomerState: typeof setCustomerState;
  loadListManagementItems: typeof loadListManagementItems;
  resetReportsState: typeof resetReportsState;
  setMarginState: typeof setMarginState;
  setRedirect: typeof setRedirect;
  clearDialog: typeof clearDialog;
  setDialogOpen: typeof setDialogOpen;
  getMarginCustomerTypeList: typeof getMarginCustomerTypeList;
  getMarginModelList: typeof getMarginModelList;
  getMarginProductFamilyList: typeof getMarginProductFamilyList;
  getMarginProvinceList: typeof getMarginProvinceList;
  getMarginCustomerList: typeof getMarginCustomerList;
  getMarginInfo: typeof getMarginInfo;
  resetFilter: typeof resetFilter;
  getCompany: typeof getCompany;
  importMarginData: typeof importMarginData;
  clearImportDialog: typeof clearImportDialog;
  saveImportData: typeof saveImportData;
  exportMarginReport: typeof exportMarginReport;
  companyList: CompanyState;
  marginState: MarginState;
  customerState: CustomerState;
  makeState: MakeState;
  system: SystemState;
  // alert: AlertState;
  dialog: DialogState;
  superAdminCompanyValidation: typeof superAdminCompanyValidation;
}

class RepnotesMargin extends Component<MarginProps> {
  componentDidMount = () => {
    this.props.setCustomerState({ salesPersonList: [], customerList: [] });
    this.props.resetProductManagementState();
    this._validateRole();
    this.props.getCompany(this.props.system.session.token);
    this.props.resetReportsState();
    this.props.setRedirect({
      shallRedirect: false,
      redirectTo: "",
    });
  };

  _validateRole = () => {
    if (this.props.system.session.userDetails.role !== "SUPER ADMIN") {
      const companyId = this.props.system.session.userDetails.companyId as string;
      this._onMarginInput("selectedCompanyId", companyId);
      this._loadTable();
    }
  };

  _loadTable = () => {
    if (this.props.marginState.selectedCompanyId) {
      this.props.loadListManagementItems(LIST_ITEMS, this.props.marginState.selectedCompanyId);
    }
  };

  _loadQuery = () => {
    this.props.getMarginCustomerTypeList();
    this.props.getMarginProvinceList();
    this.props.getMarginProductFamilyList();
    this.props.getMarginModelList();
    this.props.getMarginCustomerList();
  };

  // on component input in dynamic form
  _onMarginInput = (field: string, value: DynamicMarginReportType) => {
    this.props.setMarginState({ [field]: value }); // magic setstate
    // on filter input, trigger view below
    if (field === "selectedCompanyId") {
      this.props.resetFilter([
        "salesPersonDocId",
        "province",
        "customerTypeId",
        "modelId",
        "customerDocId",
        "productFamilyId",
      ]);
      this.props.loadListManagementItems(LIST_ITEMS, value as string);
      this._loadQuery();
    }
    this.props.getMarginInfo();
  };

  _onClearImportDialog = () => {
    this.props.clearImportDialog();
  };

  _importMarginData = (value: unknown) => {
    this.props.importMarginData(this.props.system, value, this.props.marginState.selectedCompanyId);
  };

  _saveImportMarginData = () => {
    this.props.saveImportData();
  };

  _onExportClick = () => {
    if (!this.props.marginState.selectedCompanyId) {
      return this.props.superAdminCompanyValidation();
    }
    if (this.props.marginState.selectedCompanyId) {
      this.props.exportMarginReport();
    }
  };

  render = () => {
    const {
      marginStartDate,
      marginEndDate,
      selectedCompanyId,
      modelId,
      selectedCustomerId,
      selectedSalespersonId,
      loading,
      marginResult,
      report,
      activeTab,
      marginProvinceList,
      marginCustomerTypeList,
      marginProductFamilyList,
      customerTypeId,
      productFamilyId,
      provinceId,
      invoiceAmount,
      cost,
      dialogOpen,
      marginList,
      uploadLoading,
      marginModelList,
      marginCustomerList,
    } = this.props.marginState;
    const { userDetails } = this.props.system.session;
    const { companyArray } = this.props.companyList;
    const { salesPersonList } = this.props.customerState;

    return (
      <MarginReportContainer className='repnotes-content'>
        {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
        <RepnotesMarginImport
          open={dialogOpen}
          onClear={this._onClearImportDialog}
          importData={map(marginList, (data) => ({
            ...data,
            date: data.date ? moment(data.date).format("MMMM D, YYYY") : "",
          }))}
          onSave={this._saveImportMarginData}
          loading={uploadLoading}
        />
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "left", paddingTop: "10px 0px" }}>
            <RepnotesContentHeader moduleName='Reports' subModule='Margin Reports' />
          </Grid>
        </Grid>

        <Grid container style={{ padding: "20px 5px" }} spacing={2}>
          <Grid container spacing={1}>
            {userDetails.role === "SUPER ADMIN" && (
              <>
                <Grid item xs={2} style={{ padding: "0 5px" }}>
                  <RepnotesInput
                    id='repnotes-company-selection'
                    type='select'
                    label='Company Name'
                    labelPosition='top'
                    firstSelectOption={selectedCompanyId !== "" ? "removeall" : ""}
                    value={selectedCompanyId}
                    options={map(companyArray, (data) => ({
                      id: data.companyId,
                      name: data.name,
                    }))}
                    onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                      this._onMarginInput("selectedCompanyId", e.target.value as string);
                    }}
                  />
                </Grid>
                <Grid item xs={2} style={{ padding: "0 5px" }}>
                  <RepnotesInput
                    id='repnotes-salesperson-selection'
                    type='searchabledropdown'
                    label='Salesperson'
                    labelPosition='top'
                    value={selectedSalespersonId}
                    autocompleteOptions={map(salesPersonList, (f) => ({
                      label: f.name,
                      value: f.id,
                    }))}
                    onAutocompleteChange={(e, o) => {
                      this._onMarginInput("selectedSalespersonId", o ? o.value : "");
                    }}
                    disableAutocompletePopover={true}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={2} style={{ padding: "0 5px" }}>
              <RepnotesInput
                id='repnotes-margin-product-family'
                type='searchabledropdown'
                label='Product Family'
                labelPosition='top'
                value={productFamilyId}
                autocompleteOptions={map(marginProductFamilyList, (f) => ({
                  label: f.productFamily,
                  value: f.productFamily,
                }))}
                onAutocompleteChange={(e, o) => {
                  this._onMarginInput("productFamilyId", o ? o.value : "");
                }}
                disableAutocompletePopover={true}
              />
            </Grid>
            {userDetails.role.toString().toLowerCase() === "sales engineer" && (
              <>
                <Grid item xs={2} style={{ padding: "0 5px" }}>
                  <RepnotesInput
                    id='repnotes-margin-customer-type'
                    type='searchabledropdown'
                    label='Customer Type'
                    labelPosition='top'
                    value={customerTypeId}
                    autocompleteOptions={map(marginCustomerTypeList, (f) => ({
                      label: f.customerType,
                      value: f.customerType,
                    }))}
                    onAutocompleteChange={(e, o) => {
                      this._onMarginInput("customerTypeId", o ? o.value : "");
                    }}
                    disableAutocompletePopover={true}
                  />
                </Grid>
                <Grid item xs={2} style={{ padding: "0 5px" }}>
                  <RepnotesInput
                    id='repnotes-margin-province'
                    type='searchabledropdown'
                    label='Province'
                    labelPosition='top'
                    value={provinceId}
                    autocompleteOptions={map(marginProvinceList, (f) => ({
                      label: f.province,
                      value: f.province,
                    }))}
                    onAutocompleteChange={(e, o) => {
                      this._onMarginInput("provinceId", o ? o.value : "");
                    }}
                    disableAutocompletePopover={true}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={6} style={{ padding: "0 5px" }}>
              <MarginReportFilterPopover
                role={true}
                onExportClick={this._onExportClick}
                importMarginReportData={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this._importMarginData(e.target.files);
                }}
              >
                {userDetails.role === "SUPER ADMIN" && (
                  <>
                    <RepnotesInput
                      id='repnotes-margin-customer-type'
                      type='searchabledropdown'
                      label='Customer Type'
                      labelPosition='top'
                      value={customerTypeId}
                      autocompleteOptions={map(marginCustomerTypeList, (f) => ({
                        label: f.customerType,
                        value: f.customerType,
                      }))}
                      onAutocompleteChange={(e, o) => {
                        this._onMarginInput("customerTypeId", o ? o.value : "");
                      }}
                      disableAutocompletePopover={true}
                    />
                    <RepnotesInput
                      id='repnotes-margin-province'
                      type='searchabledropdown'
                      label='Province'
                      labelPosition='top'
                      value={provinceId}
                      autocompleteOptions={map(marginProvinceList, (f) => ({
                        label: f.province,
                        value: f.province,
                      }))}
                      onAutocompleteChange={(e, o) => {
                        this._onMarginInput("provinceId", o ? o.value : "");
                      }}
                      disableAutocompletePopover={true}
                    />
                  </>
                )}
                <RepnotesInput
                  id='repnotes-margin-model'
                  type='searchabledropdown'
                  label='Model'
                  labelPosition='top'
                  value={modelId}
                  autocompleteOptions={map(marginModelList, (f) => ({
                    label: f.model,
                    value: f.model,
                  }))}
                  onAutocompleteChange={(e, o) => {
                    this._onMarginInput("modelId", o ? o.value : "");
                  }}
                  disableAutocompletePopover={true}
                />
                <RepnotesInput
                  id='repnotes-margin-customer'
                  type='searchabledropdown'
                  label='Customer Name'
                  labelPosition='top'
                  value={selectedCustomerId}
                  autocompleteOptions={map(marginCustomerList, (f) => ({
                    label: f.customer,
                    value: f.customer,
                  }))}
                  onAutocompleteChange={(e, o) => {
                    this._onMarginInput("selectedCustomerId", o ? o.value : "");
                  }}
                  disableAutocompletePopover={true}
                />
              </MarginReportFilterPopover>
            </Grid>
            {/* <Grid item xs={2} style={{padding:"0 5px"}}>
                            <RepnotesInput
                                id="repnotes-margin-province"
                                type="select"
                                label="Province"
                                labelPosition="top"
                                value={provinceId}
                                firstSelectOption="all"
                                options={map(marginProvinceList, (data) => ({
                                    id: data.province,
                                    name: data.province
                                }))}
                                onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                    this._marginFilter('province', e.target.value as string)
                                }}
                            />
                        </Grid> */}
            {/* <Grid item xs={userDetails.role === 'SUPER ADMIN' ? 4 : 3} style={{ display: 'flex', alignItems: 'flex-end'}}>
                            <Box display="flex" width="100%" height="100%" alignItems="flex-end">
                                <Link 
                                    to="/templates/margin-report.xlsx" 
                                    target="_blank" 
                                    style={{ 
                                        height: 36,
                                        color: '#272B75',
                                        backgroundColor: '#f4f4f4',
                                        borderRadius: 3,
                                        padding: '7px 16px',
                                        minWidth: 100,
                                        textTransform: 'none', 
                                        textDecoration: 'none',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxSizing: 'border-box',
                                        marginRight: 16
                                    }} 
                                    download
                                >
                                    <img src={GetTemplate} alt="" style={{ width: 18, height: 18, objectFit: 'cover', marginRight: 4 }} />
                                    Get Template
                                </Link>
                                <RepnotesInput
                                    id="repnotes-margin-import"
                                    type="file"
                                    uploadLabel="Import"
                                    multiUpload={false}
                                    uploadIcon={false}
                                    value=""
                                    fileStartIcon={<img src={Import} alt="" style={{ width: 18, height: 18, objectFit: 'cover' }} />}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        this._importMarginData(e.target.files)
                                    }}
                                />
                                <RepnotesPrimaryButton 
                                    startIcon={<img src={Export} alt="" style={{ width: 18, height: 18, objectFit: 'cover' }} />}
                                    style={{ height: 36, alignSelf: 'unset', width: 100, boxSizing: 'border-box'}}
                                    onClick={this._onExportClick}
                                >
                                    Export
                                </RepnotesPrimaryButton>
                            </Box>
                        </Grid> */}
            <MarginDateRange
              startDate={marginStartDate}
              endDate={marginEndDate}
              onDateChange={(start, end) => {
                if (start && end) {
                  this.props.setMarginState({
                    marginStartDate: moment(start).format("YYYY-MM-DD"),
                    marginEndDate: moment(end).format("YYYY-MM-DD"),
                  });

                  this.props.getMarginInfo({
                    marginStartDate: moment(start).format("YYYY-MM-DD"),
                    marginEndDate: moment(end).format("YYYY-MM-DD"),
                  });
                }
              }}
            />
          </Grid>
        </Grid>
        <Tabs value={activeTab} TabIndicatorProps={{ style: { height: 3 } }}>
          <Tab
            value='REPORT'
            label='Report'
            onClick={() => this.props.setMarginState({ activeTab: "REPORT" })}
            style={{ color: "green", minWidth: 80, fontWeight: 600 }}
          />
          <Tab
            value='STATUS'
            label='Status'
            onClick={() => this.props.setMarginState({ activeTab: "STATUS" })}
            style={{ color: "red", minWidth: 80, fontWeight: 600 }}
          />
        </Tabs>
        {activeTab === "REPORT" && (
          <>
            {loading ? (
              <LoadingDialog />
            ) : (
              <Grid container>
                <Grid item xs={12} style={{ height: "calc(100vh - 188px)" }}>
                  <MarginReport data={report} />
                </Grid>
              </Grid>
            )}
          </>
        )}
        {activeTab === "STATUS" && (
          <>
            <Grid container>
              <Typography variant='h6' style={{ fontWeight: 550, paddingBottom: "15px" }}>
                Total Per Status
              </Typography>
            </Grid>
            {loading ? (
              <LoadingDialog />
            ) : (
              <>
                <Box display='flex'>
                  <Box marginRight='8px'>
                    <RepnotesVOCCardInvoiceAmount count={invoiceAmount} />
                  </Box>
                  <Box marginRight='8px'>
                    <RepnotesVOCCardCost count={cost} />
                  </Box>
                  <RepnotesPercentCard count={(invoiceAmount - cost) / invoiceAmount} />
                </Box>
                <Grid container style={{ height: "330px", marginTop: 16 }}>
                  <RepnotesGraphicalLine data={marginResult} />
                </Grid>
              </>
            )}
          </>
        )}
      </MarginReportContainer>
    );
  };
}

export const mapStateToProps = (state: AppState) => ({
  marginState: state.marginState,
  companyList: state.companyList,
  customerState: state.customerState,
  makeState: state.makeState,
  system: state.system,
  alert: state.alert,
  dialog: state.dialog,
});

export default connect(mapStateToProps, {
  getMarginCustomerTypeList,
  getMarginModelList,
  getMarginProductFamilyList,
  getMarginInfo,
  getMarginProvinceList,
  getMarginCustomerList,
  setRedirect,
  clearDialog,
  getCompany,
  resetFilter,
  setDialogOpen,
  importMarginData,
  clearImportDialog,
  saveImportData,
  setMarginState,
  resetReportsState,
  exportMarginReport,
  loadListManagementItems,
  resetProductManagementState,
  setCustomerState,
  superAdminCompanyValidation,
})(RepnotesMargin);
