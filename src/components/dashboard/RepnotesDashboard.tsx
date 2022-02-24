import { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { ListItem, SystemState } from "../../store/system/types";
import {
  DashboardState,
  DynamicDashboardType,
} from "../../store/dashboard/types";
import {
  getCustomerCount,
  getMeeting,
  getSalesOpportunity,
  getSalespersonCount,
  getUserCount,
  resetFilter,
  setDashboardState,
} from "../../store/dashboard/actions";
import {
  ActivityPostContainer,
  DashboardCard,
} from "./RepnotesDashboardComponent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { setCustomerState } from "../../store/customerManagement/customer/actions";
import {
  loadListManagementItems,
  resetReportsState,
} from "../../store/system/actions";
import { getCompany } from "../../store/listManagement/company/actions";
import { CompanyState } from "../../store/listManagement/company/types";
import { CustomerState } from "../../store/customerManagement/customer/types";
import { LocationState } from "../../store/customerManagement/location/types";
import { AlertState } from "../../store/alert/types";
import DashboardFilters from "./fragments/DashboardFilters";
import DashboardContent from "./fragments/DashboardContent";

import map from "lodash/map";
import moment from "moment";

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left", backgroundColor: "#9195B5" };
const LIST_ITEMS: Array<ListItem> = ["Salesperson", "Location", "Customer"];
const SALES_TABLE_COLUMNS = [
  { field: "dateCreated", title: "Date", cellStyle, headerStyle },
  { field: "salesPerson", title: "Salesperson", cellStyle, headerStyle },
  { field: "model", title: "Product", cellStyle, headerStyle },
  { field: "price", title: "Price", cellStyle, headerStyle },
  { field: "quantity", title: "QTY", cellStyle, headerStyle },
  { field: "totalAmount", title: "Total", cellStyle, headerStyle },
  { field: "status", title: "Status", cellStyle, headerStyle },
  { field: "customerName", title: "Customer", cellStyle, headerStyle },
];
const MEETING_TABLE_COLUMNS = [
  { field: "date_created", title: "Date", cellStyle, headerStyle },
  { field: "time", title: "Time Start / End", cellStyle, headerStyle },
  { field: "purpose", title: "Product", cellStyle, headerStyle },
  { field: "customerName", title: "Customer", cellStyle, headerStyle },
  { field: "status", title: "Status", cellStyle, headerStyle },
];

interface DashboardProps {
  getSalespersonCount: typeof getSalespersonCount;
  getCustomerCount: typeof getCustomerCount;
  getUserCount: typeof getUserCount;
  setCustomerState: typeof setCustomerState;
  resetReportsState: typeof resetReportsState;
  getCompany: typeof getCompany;
  setDashboardState: typeof setDashboardState;
  resetFilter: typeof resetFilter;
  loadListManagementItems: typeof loadListManagementItems;
  getSalesOpportunity: typeof getSalesOpportunity;
  getMeeting: typeof getMeeting;
  system: SystemState;
  dashboardState: DashboardState;
  companyList: CompanyState;
  customerState: CustomerState;
  locationState: LocationState;
  alert: AlertState;
}

class RepnotesDashboard extends Component<DashboardProps> {
  componentDidMount = () => {
    this._validateRole();
    this.props.getSalespersonCount(
      this.props.system,
      this.props.system.session.userDetails.companyId
    );
    this.props.getCustomerCount(
      this.props.system,
      this.props.system.session.userDetails.companyId
    );
    this.props.getUserCount(
      this.props.system,
      this.props.system.session.userDetails.companyId
    );
    this.props.setCustomerState({ salesPersonList: [], customerList: [] });
    this.props.getCompany(this.props.system.session.token);
  };

  componentWillUnmount = () => this.props.resetReportsState();

  _validateRole = () => {
    if (this.props.system.session.userDetails.role !== "SUPER ADMIN")
      this._onDashboardInput(
        "filterSelectedCompany",
        this.props.system.session.userDetails.companyId as string
      );
    this._loadTable();
  };

  _loadTable = () => {
    if (this.props.dashboardState.filterSelectedCompany) {
      this.props.loadListManagementItems(
        LIST_ITEMS,
        this.props.dashboardState.filterSelectedCompany
      );
    }
  };

  // on component input in dynamic form
  _onDashboardInput = (field: string, value: DynamicDashboardType) => {
    this.props.setDashboardState({ [field]: value }); // magic setstate
    // on filter input, trigger view below
    if (field === "filterSelectedCompany") {
      this.props.resetFilter([
        "filterSelectedSalesperson",
        "filterSelectedProvince",
        "filterSelectedCustomer",
      ]);
      this.props.loadListManagementItems(LIST_ITEMS, value as string);
    }
    this.props.getSalesOpportunity(this.props.system);
    this.props.getMeeting(this.props.system);
  };

  render() {
    const {
      filterSelectedSalesperson,
      filterSelectedProvince,
      filterSelectedCompany,
      filterSelectedCustomer,
      salesOpportunities,
      meetings,
    } = this.props.dashboardState;
    const { userDetails } = this.props.system.session;
    const role = this.props.system.session
      ? (this.props.system.session.userDetails.role as string)
      : "";
    return (
      <Box className='repnotes-content'>
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "left", paddingTop: "20px" }}>
            <Typography variant='h5' style={{ fontWeight: "bold" }}>
              {`Welcome, ${userDetails.firstName} ${userDetails.lastName}`}
            </Typography>
            <Typography paragraph>{moment().format("LL")}</Typography>
          </Grid>
          <Grid item container spacing={4}>
            <Grid item xs={12} sm={4}>
              <DashboardCard
                loading={this.props.dashboardState.loading}
                title='Salesperson'
                counter={`${this.props.dashboardState.salespersonCount}`}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DashboardCard
                loading={this.props.dashboardState.loading}
                title='Customer'
                counter={`${this.props.dashboardState.customerCount}`}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DashboardCard
                loading={this.props.dashboardState.loading}
                title='Admin'
                counter={`${this.props.dashboardState.userCount}`}
              />
            </Grid>
          </Grid>
          <ActivityPostContainer container item xs={12}>
            <Typography
              variant='h6'
              style={{
                fontWeight: "bold",
                textAlign: "left",
                color: "#272B75",
                paddingBottom: "20px",
              }}
            >
              Acitivity Log
            </Typography>
            <DashboardFilters
              onDashboardInput={this._onDashboardInput}
              role={role}
              filterCompanies={this.props.companyList.companyArray}
              company={filterSelectedCompany}
              salespersons={this.props.customerState.salesPersonList}
              filterSelectedSalesperson={filterSelectedSalesperson}
              provinces={this.props.locationState.locationList}
              filterSelectedProvince={filterSelectedProvince}
              customers={this.props.customerState.customerList}
              filterSelectedCustomer={filterSelectedCustomer}
            />
            <Grid item xs={8}>
              <DashboardContent
                title='Sales Opportunities & Quotes'
                content={map(salesOpportunities, (data) => ({
                  ...data,
                  dateCreated: moment(data.dateCreated).format("MMMM DD, YYYY"),
                }))}
                columns={SALES_TABLE_COLUMNS}
              />
              <DashboardContent
                title='Meeting'
                content={map(meetings, (data: any) => ({
                  ...data,
                  date_created: moment(data.date_created).format(
                    "MMMM DD, YYYY"
                  ),
                  time: data.startTime
                    ? `${moment(data.startTime).format("hh:mm A")}/${moment(
                        data.endTime
                      ).format("hh:mm A")}`
                    : "N/A",
                }))}
                columns={MEETING_TABLE_COLUMNS}
              />
            </Grid>
          </ActivityPostContainer>
        </Grid>
      </Box>
    );
  }
}

export const mapStateToProps = (state: AppState) => ({
  system: state.system,
  dashboardState: state.dashboardState,
  customerState: state.customerState,
  locationState: state.locationState,
  companyList: state.companyList,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  getSalespersonCount,
  getCustomerCount,
  getUserCount,
  getCompany,
  resetFilter,
  loadListManagementItems,
  resetReportsState,
  setCustomerState,
  getSalesOpportunity,
  getMeeting,
  setDashboardState,
})(RepnotesDashboard);
