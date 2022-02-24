import { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { SystemState } from "../../../store/system/types";
import { CompanyState } from "../../../store/listManagement/company/types";
// import { AlertState } from '../../../store/alert/types';
import {
  ActualToTargetState,
  DynamicActualToTargetType,
} from "../../../store/report/actualToTarget/types";
import { CustomerState } from "../../../store/customerManagement/customer/types";
import {
  getActualToTargetStatus,
  getProvinceList,
  importActualToTargetData,
  setActualToTargetState,
  clearImportDialog,
  saveImportData,
  exportActualToTarget,
  resetFilter,
  getActualToTargetReport,
} from "../../../store/report/actualToTarget/actions";
import { getSalesPersonList } from "../../../store/customerManagement/customer/actions";
import { loadListManagementItems } from "../../../store/system/actions";
import { getCompany } from "../../../store/listManagement/company/actions";
import { setCustomerState } from "../../../store/customerManagement/customer/actions";
import { ActualToTargetContainer } from "./fragments/ActualToTargetComponents";
import ActualToTargetFilters from "./fragments/ActualToTargetFilters";
import ActualTotargetStatus from "./fragments/ActualToTargetStatus";
import ActualToTargetReports from "./fragments/ActualToTargetReports";
import { ActualToTargetImport } from "./fragments/ActualToTargetImportDialog";
import { superAdminCompanyValidation } from "../../../store/userManagement/user/actions";
// global
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { CenteredLoadingDialog } from "../../common/RepnotesAlerts";
// import { RepnotesAlert } from '../../common/RepnotesAlerts';
// import { LoadingDialog } from '../../common/RepnotesAlerts';

// material
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import map from "lodash/map";

interface ActualToTargetProps {
  setCustomerState: typeof setCustomerState;
  loadListManagementItems: typeof loadListManagementItems;
  getCompany: typeof getCompany;
  getSalesPersonList: typeof getSalesPersonList;
  getProvinceList: typeof getProvinceList;
  setActualToTargetState: typeof setActualToTargetState;
  getActualToTargetStatus: typeof getActualToTargetStatus;
  getActualToTargetReport: typeof getActualToTargetReport;
  importActualToTargetData: typeof importActualToTargetData;
  clearImportDialog: typeof clearImportDialog;
  saveImportData: typeof saveImportData;
  exportActualToTarget: typeof exportActualToTarget;
  resetFilter: typeof resetFilter;
  actualToTargetState: ActualToTargetState;
  system: SystemState;
  companyList: CompanyState;
  customerState: CustomerState;
  superAdminCompanyValidation: typeof superAdminCompanyValidation;
  // alert: AlertState;
}

class ActualToTarget extends Component<ActualToTargetProps> {
  componentDidMount = () => {
    this._validateRole();
    this.props.setCustomerState({ salesPersonList: [], customerList: [] });
    this.props.getCompany(this.props.system.session.token);
  };

  componentWillUnmount = () => {
    this.props.setActualToTargetState({
      actualVsTargetStatus: undefined,
      filterSelectedCompany: "",
      filterProvinces: [],
      actualVsTargetReport: [],
      actualVsTargetList: [],
    });
  };

  _validateRole = async () => {
    if (this.props.system.session.userDetails.role !== "SUPER ADMIN") {
      this._onActualToTargetInput(
        "filterSelectedCompany",
        this.props.system.session.userDetails.companyId as string
      );
    }
    if (this.props.system.session)
      this._loadTable(this.props.system.session.userDetails.companyId as string);
  };

  _loadTable = async (companyId?: string) => {
    if (this.props.actualToTargetState.filterSelectedCompany) {
      this.props.loadListManagementItems(["Salesperson"], companyId);
      this.props.getActualToTargetStatus(this.props.system);
      this.props.getActualToTargetReport(this.props.system);
    }
  };

  _onActualToTargetInput = (field: string, value: DynamicActualToTargetType) => {
    this.props.setActualToTargetState({ [field]: value });
    // on filter input, trigger view below
    if (field === "filterSelectedCompany") {
      this.props.resetFilter(["filterSelectedSalesperson", "filterSelectedProvince"]);
      this.props.loadListManagementItems(["Salesperson"], value as string);
      this.props.getProvinceList();
      this.props.getActualToTargetStatus(this.props.system, value as string);
      this.props.getActualToTargetReport(this.props.system, value as string);
    } else {
      this.props.getActualToTargetStatus(this.props.system);
      this.props.getActualToTargetReport(this.props.system);
    }
  };

  _importActualToTargetData = (value: unknown) => {
    this.props.importActualToTargetData(this.props.system, value);
  };

  _onExportClick = () => {
    if (!this.props.actualToTargetState.filterSelectedCompany) {
      return this.props.superAdminCompanyValidation();
    }
    this.props.exportActualToTarget(this.props.system);
  };

  _saveImportActualTargetData = () => {
    this.props.saveImportData(this.props.system);
    this._loadTable(this.props.actualToTargetState.filterSelectedCompany);
  };

  _onClearImportDialog = () => {
    this.props.clearImportDialog();
  };

  render = () => {
    const {
      filterSelectedCompany,
      filterSelectedSalesperson,
      filterSelectedProvince,
      filterSelectedGraphType,
      actualToTargetTab,
      actualVsTargetReport,
      dialogOpen,
      uploadLoading,
      actualVsTargetList,
      actualVsTargetStatus,
      filterSelectedStartQuarter,
      filterProvinces,
      loading,
      filterSelectedEndQuarter,
    } = this.props.actualToTargetState;
    const role = this.props.system.session
      ? (this.props.system.session.userDetails.role as string)
      : "";
    return (
      <ActualToTargetContainer>
        {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
        <ActualToTargetImport
          open={dialogOpen}
          onClear={this._onClearImportDialog}
          importData={map(actualVsTargetList, (data) => ({
            ...data,
          }))}
          onSave={this._saveImportActualTargetData}
          loading={uploadLoading}
        />
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "left", paddingTop: "10px 0px" }}>
            <RepnotesContentHeader moduleName='Reports' subModule='Actual vs Target Report' />
          </Grid>
        </Grid>
        <ActualToTargetFilters
          onActualToTargetInput={this._onActualToTargetInput}
          role={role}
          filterCompanies={this.props.companyList.companyArray}
          company={filterSelectedCompany}
          onExportClick={this._onExportClick}
          importActualToTargetData={this._importActualToTargetData}
          salespersons={this.props.customerState.salesPersonList}
          filterSelectedSalesperson={filterSelectedSalesperson}
          filterSelectedGraphType={filterSelectedGraphType}
          provinces={filterProvinces}
          filterSelectedProvince={filterSelectedProvince}
        />
        <Tabs value={actualToTargetTab}>
          <Tab
            value='REPORT'
            label='Report'
            onClick={() => this.props.setActualToTargetState({ actualToTargetTab: "REPORT" })}
            style={{ color: "green", minWidth: 80, fontWeight: 600 }}
          />
          <Tab
            value='STATUS'
            label='Status'
            onClick={() => this.props.setActualToTargetState({ actualToTargetTab: "STATUS" })}
            style={{ color: "red", minWidth: 80, fontWeight: 600 }}
          />
        </Tabs>
        {loading ? (
          <CenteredLoadingDialog />
        ) : (
          <Box>
            {actualToTargetTab === "STATUS" && (
              <ActualTotargetStatus
                actualVsTargetData={actualVsTargetStatus}
                type={filterSelectedGraphType}
              />
            )}
            {actualToTargetTab === "REPORT" && (
              <ActualToTargetReports
                salesReport={map(actualVsTargetReport.reportDetails, (data) => ({
                  ...data,
                }))}
                viewType={filterSelectedGraphType}
                gapData={actualVsTargetReport.gapData}
                filterSelectedStartQuarter={filterSelectedStartQuarter}
                filterSelectedEndQuarter={filterSelectedEndQuarter}
                provinces={filterProvinces}
                filterSelectedProvince={filterSelectedProvince}
                onActualToTargetInput={this._onActualToTargetInput}
              />
            )}
          </Box>
        )}
      </ActualToTargetContainer>
    );
  };
}

const mapStateToProps = (state: AppState) => ({
  actualToTargetState: state.actualToTargetState,
  system: state.system,
  companyList: state.companyList,
  customerState: state.customerState,
  // alert: state.alert
});

const mapDispatchToProps = {
  setActualToTargetState,
  getProvinceList,
  getSalesPersonList,
  getCompany,
  getActualToTargetStatus,
  getActualToTargetReport,
  importActualToTargetData,
  clearImportDialog,
  saveImportData,
  exportActualToTarget,
  resetFilter,
  loadListManagementItems,
  setCustomerState,
  superAdminCompanyValidation,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActualToTarget);
