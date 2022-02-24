import { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../../store";
import { ListItem, SystemState } from "../../../../store/system/types";
import { CompanyState } from "../../../../store/listManagement/company/types";
import { CustomerState } from "../../../../store/customerManagement/customer/types";
import { LocationState } from "../../../../store/customerManagement/location/types";
import { IndustryState } from "../../../../store/listManagement/industry/types";
import { CustomerTypeState } from "../../../../store/listManagement/customerType/types";
import { AlertState } from "../../../../store/alert/types";
import {
  DynamicVisitsCompletedType,
  VisitsCompletedState,
} from "../../../../store/report/customerTouchpoint/visitsCompleted/types";
import {
  getVisitsCompleted,
  resetFilter,
  setVisitsCompletedState,
  exportCompletedCalls,
} from "../../../../store/report/customerTouchpoint/visitsCompleted/actions";
import { superAdminCompanyValidation } from "../../../../store/userManagement/user/actions";
import { getCompany } from "../../../../store/listManagement/company/actions";
import { setCustomerState } from "../../../../store/customerManagement/customer/actions";
import { loadListManagementItems, resetReportsState } from "../../../../store/system/actions";
import { VisitsCompletedContainer } from "./fragments/VisitsCompletedComponents";
import VisitsCompletedFilters from "./fragments/VisitsCompletedFilter";
import VisitsCompletedGraph from "./fragments/VisitsCompletedGraph";
import VisitsCompletedReport from "./fragments/VisitsCompletedReport";

// global
import { RepnotesContentHeader } from "../../../common/RepnotesContentHeader";
import { CenteredLoadingDialog } from "../../../common/RepnotesAlerts";
import RepnotesWeekpicker from "../../../common/RepnotesWeekpicker";

// material ui
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import forEach from "lodash/forEach";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import DateFnsUtils from "@date-io/date-fns";

// constants
const COLOR_LIST = ["#4472C4", "#4472C4", "#4472C4", "#4472C4", "#4472C4", "#4472C4"];
const LIST_ITEMS: Array<ListItem> = ["Salesperson", "Location", "Industry", "Customer Type"];

interface VisitsCompletedProps {
  setCustomerState: typeof setCustomerState;
  getCompany: typeof getCompany;
  loadListManagementItems: typeof loadListManagementItems;
  exportCompletedCalls: typeof exportCompletedCalls;
  getVisitsCompleted: typeof getVisitsCompleted;
  resetFilter: typeof resetFilter;
  setVisitsCompletedState: typeof setVisitsCompletedState;
  resetReportsState: typeof resetReportsState;
  system: SystemState;
  visitsCompletedState: VisitsCompletedState;
  companyList: CompanyState;
  customerState: CustomerState;
  locationState: LocationState;
  industryState: IndustryState;
  customerTypeState: CustomerTypeState;
  alert: AlertState;
  superAdminCompanyValidation: typeof superAdminCompanyValidation;
}

class VisitsCompleted extends Component<VisitsCompletedProps> {
  componentDidMount = () => {
    this._validateRole();
    this.props.setCustomerState({ salesPersonList: [] });
    this.props.getCompany(this.props.system.session.token);
  };

  componentWillUnmount = () => this.props.resetReportsState();

  _validateRole = async () => {
    if (this.props.system.session.userDetails.role !== "SUPER ADMIN")
      await this._onVisitsCompletedInput(
        "filterSelectedCompany",
        this.props.system.session.userDetails.companyId as string
      );
    this._loadTable();
  };

  _loadTable = () => {
    if (this.props.visitsCompletedState.filterSelectedCompany) {
      this.props.loadListManagementItems(
        LIST_ITEMS,
        this.props.visitsCompletedState.filterSelectedCompany
      );
    }
  };

  // on component input in dynamic form
  _onVisitsCompletedInput = async (field: string, value: DynamicVisitsCompletedType) => {
    this.props.setVisitsCompletedState({ [field]: value }); // magic setstate
    // on filter input, trigger view below
    if (field === "filterSelectedCompany") {
      this.props.resetFilter([
        "filterSelectedSalesperson",
        "filterSelectedProvince",
        "filterSelectedIndustry",
        "filterSelectedCustomerType",
      ]);
      this.props.loadListManagementItems(LIST_ITEMS, value as string);
    }
    this.props.getVisitsCompleted(this.props.system);
  };

  _onExportClick = () => {
    if (!this.props.visitsCompletedState.filterSelectedCompany) {
      return this.props.superAdminCompanyValidation();
    }
    // trigger export
    this.props.exportCompletedCalls(this.props.system);
  };

  render = () => {
    const {
      filterSelectedSalesperson,
      filterSelectedProvince,
      filterSelectedIndustry,
      filterStartDate,
      filterSelectedViewType,
      filterSelectedCustomerType,
      loading,
      filterSelectedCompany,
      completedCallsList,
      activeTab,
      report,
    } = this.props.visitsCompletedState;

    const role = this.props.system.session
      ? (this.props.system.session.userDetails.role as string)
      : "";

    let completedCallsLabels: Array<string> = [];
    let completedCallsValues: Array<number> = [];
    let incompleteCallsValues: Array<number> = [];
    forEach(completedCallsList, (data) => {
      completedCallsLabels.push(data.date);
      completedCallsValues.push(data.completedCalls);
      incompleteCallsValues.push(data.incompleteCalls);
    });

    return (
      <VisitsCompletedContainer>
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "left", paddingTop: "10px 0px" }}>
            <RepnotesContentHeader
              moduleName='Reports'
              subModule='Customer Touchpoint'
              secondSubModule='Percentage of Completed Calls/Visits'
            />
          </Grid>
        </Grid>
        <VisitsCompletedFilters
          onVisitsCompletedInput={this._onVisitsCompletedInput}
          role={role}
          filterCompanies={this.props.companyList.companyArray}
          company={filterSelectedCompany}
          onExportClick={this._onExportClick}
          salespersons={this.props.customerState.salesPersonList}
          filterSelectedSalesperson={filterSelectedSalesperson}
          provinces={this.props.locationState.locationList}
          filterSelectedProvince={filterSelectedProvince}
          industries={this.props.industryState.industryList}
          filterSelectedIndustry={filterSelectedIndustry}
          customerTypes={this.props.customerTypeState.customerTypeList}
          filterSelectedCustomerType={filterSelectedCustomerType}
          filterSelectedViewType={filterSelectedViewType}
        />
        <Grid container>
          <Grid item xs={12}>
            <Typography
              style={{
                fontSize: 12,
                fontWeight: 700,
                textAlign: "left",
                color: "#272B75",
                marginBottom: 8,
              }}
            >
              Date Range
            </Typography>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid container spacing={2}>
            <Grid className='picker-container' item xs={3}>
              {filterSelectedViewType === "Weekly" && (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <RepnotesWeekpicker
                    date={
                      filterStartDate ? moment(filterStartDate, "YYYY-MM-DD").toDate() : new Date()
                    }
                    maxDate={moment().endOf("week").toDate()}
                    onChange={(s, e) => {
                      this.props.setVisitsCompletedState({
                        filterStartDate: moment(s).format("YYYY-MM-DD"),
                        filterEndDate: moment(e).format("YYYY-MM-DD"),
                      });
                      this.props.getVisitsCompleted(this.props.system);
                    }}
                  />
                </MuiPickersUtilsProvider>
              )}
              {filterSelectedViewType === "Monthly" && (
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    maxDate={moment().endOf("month").toDate()}
                    disableToolbar
                    views={["year", "month"]}
                    variant='inline'
                    value={filterStartDate ? moment(filterStartDate, "YYYY-MM-DD") : new Date()}
                    onChange={(d) =>
                      this._onVisitsCompletedInput(
                        "filterStartDate",
                        moment(d).format("YYYY-MM-DD")
                      )
                    }
                    format='MMMM YYYY'
                    autoOk
                  />
                </MuiPickersUtilsProvider>
              )}
              {filterSelectedViewType === "Yearly" && (
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    disableToolbar
                    views={["year"]}
                    maxDate={moment().endOf("year")}
                    variant='inline'
                    value={filterStartDate ? moment(filterStartDate, "YYYY-MM-DD") : new Date()}
                    onChange={(d) =>
                      this._onVisitsCompletedInput(
                        "filterStartDate",
                        moment(d).format("YYYY-MM-DD")
                      )
                    }
                    format='YYYY'
                    autoOk
                  />
                </MuiPickersUtilsProvider>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Tabs value={activeTab} TabIndicatorProps={{ style: { height: 3 } }}>
          <Tab
            value='REPORT'
            label='Report'
            onClick={() => this.props.setVisitsCompletedState({ activeTab: "REPORT" })}
            style={{ color: "green", minWidth: 80, fontWeight: 600 }}
          />
          <Tab
            value='STATUS'
            label='Status'
            onClick={() => this.props.setVisitsCompletedState({ activeTab: "STATUS" })}
            style={{ color: "red", minWidth: 80, fontWeight: 600 }}
          />
        </Tabs>
        {activeTab === "REPORT" && (
          <>{loading ? <CenteredLoadingDialog /> : <VisitsCompletedReport data={report} />}</>
        )}
        {activeTab === "STATUS" && (
          <>
            {loading ? (
              <CenteredLoadingDialog />
            ) : (
              <Grid container>
                <Grid item xs={12} style={{ height: "calc(100vh - 290px)" }}>
                  {/* API Integration note: Insert data/values here */}
                  <VisitsCompletedGraph
                    data={completedCallsLabels}
                    colors={COLOR_LIST}
                    incompleteData={incompleteCallsValues}
                    completeData={completedCallsValues}
                  />
                </Grid>
              </Grid>
            )}
          </>
        )}
      </VisitsCompletedContainer>
    );
  };
}

const mapStateToProps = (state: AppState) => ({
  visitsCompletedState: state.visitsCompletedState,
  customerState: state.customerState,
  locationState: state.locationState,
  industryState: state.industryState,
  companyList: state.companyList,
  customerTypeState: state.customerTypeState,
  system: state.system,
  alert: state.alert,
});

const mapDispatchToProps = {
  setVisitsCompletedState,
  getCompany,
  loadListManagementItems,
  exportCompletedCalls,
  getVisitsCompleted,
  resetFilter,
  setCustomerState,
  resetReportsState,
  superAdminCompanyValidation,
};

export default connect(mapStateToProps, mapDispatchToProps)(VisitsCompleted);
