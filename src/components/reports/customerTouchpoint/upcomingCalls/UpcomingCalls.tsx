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
  DynamicUpcomingCallsType,
  UpcomingCallsState,
} from "../../../../store/report/customerTouchpoint/upcomingCalls/types";
import {
  exportUpcomingCalls,
  getUpcomingCalls,
  resetFilter,
  setUpcomingCallsState,
} from "../../../../store/report/customerTouchpoint/upcomingCalls/actions";
import { getCompany } from "../../../../store/listManagement/company/actions";
import { setCustomerState } from "../../../../store/customerManagement/customer/actions";
import { loadListManagementItems, resetReportsState } from "../../../../store/system/actions";
import { superAdminCompanyValidation } from "../../../../store/userManagement/user/actions";
import { UpcomingCallsContainer } from "./fragments/UpcomingCallsComponents";
import UpcomingCallsFilters from "./fragments/UpcomingCallsFilters";
import UpcomingCallsGraph from "./fragments/UpcomingCallsGraph";
import UpcomingCallsReport from "./fragments/UpcomingCallsReport";

// global
import { RepnotesContentHeader } from "../../../common/RepnotesContentHeader";
import { CenteredLoadingDialog } from "../../../common/RepnotesAlerts";
import RepnotesWeekpicker from "../../../common/RepnotesWeekpicker";

// material ui
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

// utils
import DateFnsUtils from "@date-io/date-fns";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import forEach from "lodash/forEach";

// constants
const COLOR_LIST = [
  "#4472C4",
  "#4472C4",
  "#4472C4",
  "#4472C4",
  "#4472C4",
  "#4472C4",
  "#4472C4",
  "#4472C4",
  "#4472C4",
  "#4472C4",
  "#4472C4",
  "#4472C4",
];
const LIST_ITEMS: Array<ListItem> = ["Salesperson", "Location", "Industry", "Customer Type"];

interface UpcomingCallsProps {
  setCustomerState: typeof setCustomerState;
  resetReportsState: typeof resetReportsState;
  getCompany: typeof getCompany;
  loadListManagementItems: typeof loadListManagementItems;
  exportUpcomingCalls: typeof exportUpcomingCalls;
  getUpcomingCalls: typeof getUpcomingCalls;
  resetFilter: typeof resetFilter;
  setUpcomingCallsState: typeof setUpcomingCallsState;
  system: SystemState;
  upcomingCallsState: UpcomingCallsState;
  companyList: CompanyState;
  customerState: CustomerState;
  locationState: LocationState;
  industryState: IndustryState;
  customerTypeState: CustomerTypeState;
  alert: AlertState;
  superAdminCompanyValidation: typeof superAdminCompanyValidation;
}

class UpcomingCalls extends Component<UpcomingCallsProps> {
  componentDidMount = () => {
    this._validateRole();
    this.props.getCompany(this.props.system.session.token);
    this.props.resetReportsState();
    this.props.setCustomerState({ salesPersonList: [] });
  };

  componentWillUnmount = () => this.props.resetReportsState();

  _validateRole = async () => {
    if (this.props.system.session.userDetails.role !== "SUPER ADMIN")
      await this._onUpcomingCallsInput(
        "filterSelectedCompany",
        this.props.system.session.userDetails.companyId as string
      );
    this._loadTable();
  };

  _loadTable = () => {
    if (this.props.upcomingCallsState.filterSelectedCompany) {
      this.props.loadListManagementItems(
        LIST_ITEMS,
        this.props.upcomingCallsState.filterSelectedCompany
      );
    }
  };

  _loadOptions = () => {
    this.props.getCompany(this.props.system.session.token);
  };

  // on component input in dynamic form
  _onUpcomingCallsInput = (field: string, value: DynamicUpcomingCallsType) => {
    this.props.setUpcomingCallsState({ [field]: value }); // magic setstate
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
    if (field === "filterSelectedViewType") {
      const newStartDate =
        value === "Monthly"
          ? moment().startOf("month")
          : value === "Yearly"
          ? moment().startOf("year")
          : moment().startOf("week");
      this.props.setUpcomingCallsState({ filterStartDate: newStartDate.format("YYYY-MM-DD") });
    }
    this.props.getUpcomingCalls(this.props.system);
  };

  _onExportClick = () => {
    // trigger export
    if (!this.props.upcomingCallsState.filterSelectedCompany) {
      return this.props.superAdminCompanyValidation();
    }
    this.props.exportUpcomingCalls(this.props.system);
  };

  render = () => {
    const {
      filterSelectedSalesperson,
      filterSelectedProvince,
      filterSelectedIndustry,
      filterSelectedCustomerType,
      loading,
      filterSelectedCompany,
      filterSelectedViewType,
      filterStartDate,
      upcomingList,
      report,
      activeTab,
    } = this.props.upcomingCallsState;

    const role = this.props.system.session
      ? (this.props.system.session.userDetails.role as string)
      : "";

    let upcomingCallsLabels: Array<string> = [];
    let upcomingCallsValues: Array<number> = [];
    forEach(upcomingList, (data) => {
      upcomingCallsLabels.push(data.date);
      upcomingCallsValues.push(data.newCount);
    });

    return (
      <UpcomingCallsContainer>
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "left", paddingTop: "10px 0px" }}>
            <RepnotesContentHeader
              moduleName='Reports'
              subModule='Customer Touchpoint'
              secondSubModule='Upcoming Calls/Visit'
            />
          </Grid>
        </Grid>
        <UpcomingCallsFilters
          onUpcomingCallsInput={this._onUpcomingCallsInput}
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
                    minDate={moment().startOf("week").toDate()}
                    onChange={(s, e) => {
                      this.props.setUpcomingCallsState({
                        filterStartDate: moment(s).format("YYYY-MM-DD"),
                        filterEndDate: moment(e).format("YYYY-MM-DD"),
                      });
                      this.props.getUpcomingCalls(this.props.system);
                    }}
                  />
                </MuiPickersUtilsProvider>
              )}
              {filterSelectedViewType === "Monthly" && (
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    minDate={moment().startOf("month").toDate()}
                    disableToolbar
                    views={["year", "month"]}
                    variant='inline'
                    value={filterStartDate ? moment(filterStartDate, "YYYY-MM-DD") : new Date()}
                    onChange={(d) =>
                      this._onUpcomingCallsInput("filterStartDate", moment(d).format("YYYY-MM-DD"))
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
                    minDate={moment().startOf("year")}
                    variant='inline'
                    value={filterStartDate ? moment(filterStartDate, "YYYY-MM-DD") : new Date()}
                    onChange={(d) =>
                      this._onUpcomingCallsInput("filterStartDate", moment(d).format("YYYY-MM-DD"))
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
            onClick={() => this.props.setUpcomingCallsState({ activeTab: "REPORT" })}
            style={{ color: "green", minWidth: 80, fontWeight: 600 }}
          />
          <Tab
            value='STATUS'
            label='Status'
            onClick={() => this.props.setUpcomingCallsState({ activeTab: "STATUS" })}
            style={{ color: "red", minWidth: 80, fontWeight: 600 }}
          />
        </Tabs>
        {activeTab === "REPORT" && (
          <>{loading ? <CenteredLoadingDialog /> : <UpcomingCallsReport data={report} />}</>
        )}
        {activeTab === "STATUS" && (
          <>
            {loading ? (
              <CenteredLoadingDialog />
            ) : (
              <Grid container style={{ marginTop: 8 }}>
                <Grid item xs={12} style={{ height: "calc(100vh - 360px)" }}>
                  {/* API Integration note: Insert data/values here */}
                  <UpcomingCallsGraph
                    key='graph'
                    data={upcomingCallsLabels}
                    colors={COLOR_LIST}
                    values={upcomingCallsValues}
                  />
                </Grid>
              </Grid>
            )}
          </>
        )}
      </UpcomingCallsContainer>
    );
  };
}

const mapStateToProps = (state: AppState) => ({
  upcomingCallsState: state.upcomingCallsState,
  customerState: state.customerState,
  locationState: state.locationState,
  industryState: state.industryState,
  companyList: state.companyList,
  customerTypeState: state.customerTypeState,
  system: state.system,
  alert: state.alert,
});

const mapDispatchToProps = {
  setUpcomingCallsState,
  getCompany,
  loadListManagementItems,
  exportUpcomingCalls,
  getUpcomingCalls,
  resetFilter,
  resetReportsState,
  setCustomerState,
  superAdminCompanyValidation,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpcomingCalls);
