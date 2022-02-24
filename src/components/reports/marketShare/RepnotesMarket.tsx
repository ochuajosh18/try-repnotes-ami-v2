import { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { Link } from "react-router-dom";
import { ListItem, SystemState } from "../../../store/system/types";
// import { AlertState } from '../../../store/alert/types';
import { DialogState } from "../../../store/dialog/types";
import { DynamicMarketReportType, MarketState } from "../../../store/report/marketReport/types";
import { CompanyState } from "../../../store/listManagement/company/types";
import { CustomerState } from "../../../store/customerManagement/customer/types";
import { setCustomerState } from "../../../store/customerManagement/customer/actions";
import { getCompany } from "../../../store/listManagement/company/actions";
import { superAdminCompanyValidation } from "../../../store/userManagement/user/actions";
import {
  setRedirect,
  loadListManagementItems,
  resetReportsState,
} from "../../../store/system/actions";
import { clearDialog, setDialogOpen } from "../../../store/dialog/actions";
import {
  clearImportDialog,
  getMarketInfo,
  getMarketProductFamilyList,
  importMarketData,
  saveImportData,
  resetFilter,
  setMarketReportState,
  exportMarketReport,
} from "../../../store/report/marketReport/actions";
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { LoadingDialog } from "../../common/RepnotesAlerts";
import { RepnotesInput } from "../../common/RepnotesInput";
import { RepnotesPrimaryButton } from "../../common/RepnotesButton";
import {
  RepnotesVOCCardMarketSize,
  RepnotesVOCCardUnitSize,
} from "../voiceOfCustomer/RepnotesVOCCard";
import RepnotesGraphicalMixedChart from "./RepnotesMarketMixedChart";
import { RepnotesMarketImport } from "./RepnotesMarketImportDialog";
import MarketReport from "./fragments/MarketReport";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import map from "lodash/map";
import moment from "moment";

import Import from "../../../assets/images/import.png";
import GetTemplate from "../../../assets/images/get_template.png";
import Export from "../../../assets/images/export.png";

const LIST_ITEMS: Array<ListItem> = ["Salesperson"];

interface MarketProps {
  setCustomerState: typeof setCustomerState;
  loadListManagementItems: typeof loadListManagementItems;
  resetReportsState: typeof resetReportsState;
  setMarketReportState: typeof setMarketReportState;
  getMarketProductFamilyList: typeof getMarketProductFamilyList;
  getMarketInfo: typeof getMarketInfo;
  setRedirect: typeof setRedirect;
  clearDialog: typeof clearDialog;
  setDialogOpen: typeof setDialogOpen;
  getCompany: typeof getCompany;
  resetFilter: typeof resetFilter;
  importMarketData: typeof importMarketData;
  clearImportDialog: typeof clearImportDialog;
  saveImportData: typeof saveImportData;
  exportMarketReport: typeof exportMarketReport;
  customerState: CustomerState;
  companyList: CompanyState;
  marketState: MarketState;
  system: SystemState;
  // alert: AlertState;
  dialog: DialogState;
  superAdminCompanyValidation: typeof superAdminCompanyValidation;
}

class RepnotesMarket extends Component<MarketProps> {
  componentDidMount = () => {
    this.props.setCustomerState({ salesPersonList: [], customerList: [] });
    this._validateRole();
    this.props.getCompany(this.props.system.session.token);
    this.props.setRedirect({
      shallRedirect: false,
      redirectTo: "",
    });
  };

  componentWillUnmount = () => {
    const months = {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    };
    this.props.setMarketReportState({
      selectedCompanyId: "",
      rollingMarketSize: months,
      rollingShare: months,
      rollingUnitSales: months,
      marketSize: 0,
      unitSales: 0,
    });
  };

  _validateRole = () => {
    if (this.props.system.session.userDetails.role !== "SUPER ADMIN") {
      const companyId = this.props.system.session.userDetails.companyId as string;
      this._onMarketInput("selectedCompanyId", companyId);
      this._loadTable();
    }
  };

  _loadTable = () => {
    if (this.props.marketState.selectedCompanyId) {
      this.props.loadListManagementItems(LIST_ITEMS, this.props.marketState.selectedCompanyId);
    }
  };

  _loadQuery = () => {
    this.props.getMarketProductFamilyList();
  };

  // on component input in dynamic form
  _onMarketInput = (field: string, value: DynamicMarketReportType) => {
    this.props.setMarketReportState({ [field]: value }); // magic setstate
    // on filter input, trigger view below
    if (field === "selectedCompanyId") {
      this.props.resetFilter(["salesPersonDocId"]);
      this.props.loadListManagementItems(LIST_ITEMS, value as string);
      this._loadQuery();
    }
    this.props.getMarketInfo();
  };

  _onClearImportDialog = () => {
    this.props.clearImportDialog();
  };

  _importMarketData = async (value: unknown) => {
    await this.props.importMarketData(
      this.props.system,
      value,
      this.props.marketState.selectedCompanyId
    );
  };

  _saveimportMarketData = () => {
    this.props.saveImportData();
    this._loadTable();
  };

  _onExportClick = () => {
    if (!this.props.marketState.selectedCompanyId) {
      return this.props.superAdminCompanyValidation();
    }
    this.props.exportMarketReport(this.props.marketState.selectedCompanyId);
  };

  render = () => {
    const {
      selectedCompanyId,
      selectedSalespersonId,
      activeTab,
      report,
      loading,
      marketProductFamilyList,
      productFamilyId,
      marketSize,
      unitSales,
      rollingMarketSize,
      rollingShare,
      rollingUnitSales,
      marketList,
      dialogOpen,
      uploadLoading,
    } = this.props.marketState;
    const { userDetails } = this.props.system.session;
    const { companyArray } = this.props.companyList;
    const { salesPersonList } = this.props.customerState;

    return (
      <Box className='repnotes-content'>
        {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
        <RepnotesMarketImport
          open={dialogOpen}
          onClear={this._onClearImportDialog}
          importData={map(marketList, (data) => ({
            ...data,
            period: data.period ? moment(data.period).format("MMMM D, YYYY") : "",
          }))}
          onSave={this._saveimportMarketData}
          loading={uploadLoading}
        />
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "left", paddingTop: "10px 0px" }}>
            <RepnotesContentHeader moduleName='Reports' subModule='Market Share' />
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
                      this._onMarketInput("selectedCompanyId", e.target.value as string);
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
                      this._onMarketInput("selectedSalespersonId", o ? o.value : "");
                    }}
                    disableAutocompletePopover={true}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={2} style={{ padding: "0 5px" }}>
              <RepnotesInput
                id='repnotes-customer-status'
                type='searchabledropdown'
                label='Product Family'
                labelPosition='top'
                value={productFamilyId}
                autocompleteOptions={map(marketProductFamilyList, (f) => ({
                  label: f.productFamily,
                  value: f.productFamily,
                }))}
                onAutocompleteChange={(e, o) => {
                  this._onMarketInput("productFamilyId", o ? o.value : "");
                }}
                disableAutocompletePopover={true}
              />
            </Grid>
            <Grid
              item
              xs={userDetails.role === "SUPER ADMIN" ? 6 : 10}
              style={{ display: "flex", alignItems: "flex-end" }}
            >
              <Box
                display='flex'
                flex='1'
                width='100%'
                height='100%'
                alignItems='flex-end'
                justifyContent='flex-end'
              >
                <Link
                  to='/templates/market-share.xlsx'
                  target='_blank'
                  style={{
                    height: 36,
                    color: "#272B75",
                    backgroundColor: "#f4f4f4",
                    borderRadius: 3,
                    padding: "7px 16px",
                    minWidth: 100,
                    textTransform: "none",
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxSizing: "border-box",
                    marginRight: 16,
                  }}
                  download
                >
                  <img
                    src={GetTemplate}
                    alt=''
                    style={{ width: 18, height: 18, objectFit: "cover", marginRight: 4 }}
                  />
                  Get Template
                </Link>
                <RepnotesInput
                  id='repnotes-market-import'
                  type='file'
                  uploadLabel='Import'
                  multiUpload={false}
                  uploadIcon={false}
                  fileStartIcon={
                    <img
                      src={Import}
                      alt=''
                      style={{ width: 18, height: 18, objectFit: "cover", marginRight: 4 }}
                    />
                  }
                  value=''
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this._importMarketData(e.target.files);
                  }}
                />
                <RepnotesPrimaryButton
                  startIcon={
                    <img
                      src={Export}
                      alt=''
                      style={{ width: 18, height: 18, objectFit: "cover" }}
                    />
                  }
                  style={{
                    height: 36,
                    marginRight: 4,
                    alignSelf: "unset",
                    width: 100,
                    boxSizing: "border-box",
                  }}
                  onClick={this._onExportClick}
                >
                  Export
                </RepnotesPrimaryButton>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Tabs value={activeTab} TabIndicatorProps={{ style: { height: 3 } }}>
          <Tab
            value='REPORT'
            label='Report'
            onClick={() => this.props.setMarketReportState({ activeTab: "REPORT" })}
            style={{ color: "green", minWidth: 80, fontWeight: 600 }}
          />
          <Tab
            value='STATUS'
            label='Status'
            onClick={() => this.props.setMarketReportState({ activeTab: "STATUS" })}
            style={{ color: "red", minWidth: 80, fontWeight: 600 }}
          />
        </Tabs>
        {activeTab === "REPORT" && (
          <>
            {loading ? (
              <LoadingDialog />
            ) : (
              <Grid container>
                <Grid item xs={12} style={{ height: "calc(100vh - 128px)" }}>
                  <MarketReport data={report} />
                </Grid>
              </Grid>
            )}
          </>
        )}
        {activeTab === "STATUS" && (
          <>
            <Grid container>
              <Typography variant='h6' style={{ fontWeight: 550, paddingBottom: "15px" }}>
                Summary Per Status
              </Typography>
            </Grid>
            {loading ? (
              <LoadingDialog />
            ) : (
              <Grid item>
                <Grid item container spacing={1}>
                  <Grid item xs={12} sm={2}>
                    <RepnotesVOCCardMarketSize count={marketSize} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <RepnotesVOCCardUnitSize count={unitSales} />
                  </Grid>
                </Grid>
                <Grid container style={{ height: "330px" }}>
                  <RepnotesGraphicalMixedChart
                    rollingMarketSize={rollingMarketSize}
                    rollingShare={rollingShare}
                    rollingUnitSales={rollingUnitSales}
                  />
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Box>
    );
  };
}

export const mapStateToProps = (state: AppState) => ({
  marketState: state.marketState,
  companyList: state.companyList,
  system: state.system,
  customerState: state.customerState,
  // alert: state.alert,
  dialog: state.dialog,
});

export default connect(mapStateToProps, {
  getMarketProductFamilyList,
  getMarketInfo,
  setRedirect,
  clearDialog,
  getCompany,
  resetReportsState,
  resetFilter,
  setDialogOpen,
  importMarketData,
  clearImportDialog,
  saveImportData,
  setMarketReportState,
  loadListManagementItems,
  exportMarketReport,
  setCustomerState,
  superAdminCompanyValidation,
})(RepnotesMarket);
