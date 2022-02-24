import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps, match } from "react-router";
// import { AlertState } from '../../../store/alert/types';
import { DialogState } from "../../../store/dialog/types";
import { AppState } from "../../../store";
import { SystemState } from "../../../store/system/types";
import { setRedirect } from "../../../store/system/actions";
import { Modules, RolesState } from "../../../store/userManagement/roles/types";
import {
  setRolesState,
  setRolesValidationState,
  loadRolesDetails,
  saveRoles,
  updateRole,
} from "../../../store/userManagement/roles/actions";
import { clearDialog, setDialogOpen } from "../../../store/dialog/actions";
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { RepnotesCheckbox, RepnotesInput } from "../../common/RepnotesInput";
import {
  RepnotesDefaultButton,
  RepnotesPrimaryButton,
} from "../../common/RepnotesButton";
import {
  // RepnotesAlert,
  RepnotesDialog,
} from "../../common/RepnotesAlerts";
// material
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
// icon
import PersonIcon from "@material-ui/icons/Person";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import BarChartIcon from "@material-ui/icons/BarChart";
import ListIcon from "@material-ui/icons/List";
import SettingsIcon from "@material-ui/icons/Settings";
// utils
import forEach from "lodash/forEach";

interface MatchParams {
  params: { id: string };
}

interface RouteParams extends RouteComponentProps {
  match: match & MatchParams;
}

interface RepnotesRolesFormProps {
  setRedirect: typeof setRedirect;
  saveRoles: typeof saveRoles;
  setRolesState: typeof setRolesState;
  updateRole: typeof updateRole;
  setRolesValidationState: typeof setRolesValidationState;
  loadRolesDetails: typeof loadRolesDetails;
  setDialogOpen: typeof setDialogOpen;
  clearDialog: typeof clearDialog;
  system: SystemState;
  rolesState: RolesState;
  // alert: AlertState;
  dialog: DialogState;
}

const TABLE_HEADER_COLUMNS = [
  { field: "modules", title: "Modules" },
  { field: "view", title: "View" },
  { field: "add", title: "Add" },
  { field: "edit", title: "Edit" },
  { field: "delete", title: "Delete" },
];

const TABLE_COLUMNS = [
  { name: "User Management", icon: <PersonIcon style={{ padding: "5px" }} /> },
  { field: "user", title: "User" },
  { field: "rolesAndPermission", title: "Roles and Permissions" },
  {
    name: "Customer Management",
    icon: <SupervisorAccountIcon style={{ padding: "5px" }} />,
  },
  { field: "customer", title: "Customers" },
  { field: "location", title: "Location" },
  {
    name: "Product Management",
    icon: <LocalShippingIcon style={{ padding: "5px" }} />,
  },
  { field: "brochure", title: "Brochure" },
  { field: "product", title: "Products" },
  { field: "promotion", title: "Promotion" },
  { name: "Reports", icon: <BarChartIcon style={{ padding: "5px" }} /> },
  { field: "salesOpportunities", title: "Sales Opportunities" },
  { field: "marginReport", title: "Margin Report" },
  { field: "marketShare", title: "Market Share" },
  { field: "actualVsTarget", title: "Actual vs Target" },
  { field: "quotesByStatus", title: "Quotes by Status" },
  { field: "voiceOfCustomer", title: "Voice of Customer" },
  { field: "customerTouchpoint", title: "Customer Touchpoint" },
  { name: "List Management", icon: <ListIcon style={{ padding: "5px" }} /> },
  { field: "listManagement", title: "List Management" },
  {
    name: "Fields Management",
    icon: <SettingsIcon style={{ padding: "5px" }} />,
  },
  { field: "fields", title: "Fields Management" },
];

const TABLE_ACTIONS = ["view", "add", "edit", "delete"];

const EMPTY_ROLE = {
  companyId: "",
  name: "",
  description: "",
  modules: {
    brochure: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    customer: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    product: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    listManagement: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    location: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    salesOpportunities: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    marginReport: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    marketShare: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    actualVsTarget: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    quotesByStatus: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    voiceOfCustomer: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    customerTouchpoint: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    promotion: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    rolesAndPermission: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    user: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
    fields: {
      add: true,
      delete: true,
      edit: true,
      view: true,
    },
  },
};

class RepnotesRolesForm extends Component<
  RepnotesRolesFormProps & RouteParams
> {
  componentDidMount = () => {
    if (this.props.match.params.id === "new") {
      this.props.setRolesState({ roles: EMPTY_ROLE });
    } else {
      this.props.loadRolesDetails(
        this.props.match.params.id,
        this.props.system.session.token
      );
    }
  };

  componentDidUpdate = () => {
    // insert 'fields' in roles.module
    const { roles, loading } = this.props.rolesState;
    if (!roles.modules["fields"] && !loading) {
      this.props.setRolesState({
        roles: {
          ...roles,
          modules: {
            ...roles.modules,
            fields: {
              add: false,
              delete: false,
              edit: false,
              view: false,
            },
          },
        },
      });
    }
  };

  _onOpenDialog = () => {
    this.props.setDialogOpen({
      dialogOpen: true,
      dialogLabel: this.props.rolesState.roles
        ? this.props.rolesState.roles.name
        : "",
      dialogType: "save",
      docId: "",
    });
  };

  _onCloseDialog = () => {
    this.props.clearDialog();
    this._onSaveRoles();
  };

  _onSaveRoles = () => {
    if (this.props.match.params.id === "new") {
      this.props.saveRoles(
        this.props.rolesState.roles,
        this.props.system,
        this.props.rolesState.selectedCompanyId
      );
    } else {
      this.props.updateRole(
        this.props.rolesState.roles,
        this.props.system.session.token
      );
    }
  };

  _onClickSave = () => {
    const { roles } = this.props.rolesState;
    if (roles) {
      let required = ["name", "description"];
      let requiredFieldCount = 0;
      forEach(required, (item, index) => {
        if (roles[item] === "") {
          this.props.setRolesValidationState({ validation: true });
          requiredFieldCount++;
        }
      });
      if (requiredFieldCount === 0) this._onOpenDialog();
    }
  };

  _rolesInput = (field: string, value: string | boolean | Modules) => {
    const { roles } = this.props.rolesState;
    const newRoles = { ...roles, [field]: value };
    this.props.setRolesState({ roles: newRoles });
  };

  render() {
    const { modules } = this.props.system.session;
    const { roles, validation, loading } = this.props.rolesState;

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
              moduleName='User Management'
              subModule='Roles and Permissions'
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
                redirectTo: "/roles-and-permission",
              })
            }
          >
            Cancel
          </RepnotesDefaultButton>
          {(modules.rolesAndPermission.edit ||
            this.props.match.params.id === "new") && (
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
          <Grid container>
            <Grid item xs={10}>
              <RepnotesInput
                id='repnotes-role'
                type='text'
                placeholder='Role'
                label='Role'
                labelPosition='left'
                disabled={
                  !modules.rolesAndPermission.edit &&
                  this.props.match.params.id !== "new"
                    ? true
                    : false
                }
                error={
                  !validation
                    ? false
                    : validation && roles.name === ""
                    ? true
                    : false
                }
                value={roles.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this._rolesInput("name", e.target.value);
                }}
              />
              <RepnotesInput
                id='repnotes-role-description'
                type='multiline'
                placeholder='Description'
                label='Description'
                labelPosition='left'
                disabled={
                  !modules.rolesAndPermission.edit &&
                  this.props.match.params.id !== "new"
                    ? true
                    : false
                }
                error={
                  !validation
                    ? false
                    : validation && roles.description === ""
                    ? true
                    : false
                }
                value={roles.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this._rolesInput("description", e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={12} style={{ paddingTop: "10px" }}>
              <TableContainer
                component={Paper}
                style={{ height: "calc(100vh - 360px)" }}
              >
                <Table aria-label='customized table' stickyHeader={true}>
                  <TableHead>
                    <TableRow>
                      {TABLE_HEADER_COLUMNS.map((column, index) => (
                        <TableCell
                          component='th'
                          scope='row'
                          key={column.field}
                          align='left'
                          style={{
                            fontSize: 12,
                            textAlign: index === 0 ? "left" : "center",
                            color: "#fff",
                            fontWeight: 600,
                            backgroundColor: "#9195B5",
                            padding: "10px 16px",
                            cursor: "pointer",
                            width:
                              column.field === "modules" ? "auto" : "150px",
                          }}
                        >
                          {column.title}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {TABLE_COLUMNS.map((column) => {
                      return (
                        <TableRow hover>
                          {column.name && (
                            <TableCell
                              key='cempty-row'
                              component='td'
                              scope='row'
                              colSpan={5}
                              style={{ padding: "0px 10px" }}
                            >
                              <Grid container>
                                <Grid item xs={1} style={{ maxWidth: "5%" }}>
                                  {column.icon}
                                </Grid>
                                <Grid item xs={11}>
                                  <Typography
                                    style={{
                                      padding: "10px 20px",
                                      fontWeight: 600,
                                      height: "100%",
                                      fontSize: 12,
                                    }}
                                  >
                                    {column.name}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </TableCell>
                          )}
                          {column.field && (
                            <TableCell
                              style={{
                                textAlign: "left",
                                fontSize: 12,
                                padding: "10px",
                              }}
                            >
                              <Grid
                                container
                                key={column.field}
                                component='td'
                                scope='row'
                              >
                                <Grid item xs={2}></Grid>
                                <Grid item xs={10}>
                                  <Typography
                                    style={{
                                      padding: "0 30px",
                                      fontWeight: 600,
                                      height: "100%",
                                      fontSize: 12,
                                    }}
                                  >
                                    {column.title}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </TableCell>
                          )}
                          {column.field &&
                            TABLE_ACTIONS.map((actions) => {
                              return (
                                <TableCell
                                  key={actions}
                                  component='td'
                                  scope='row'
                                  style={{
                                    textAlign: "center",
                                    fontSize: 12,
                                    padding: "0px 19px",
                                  }}
                                >
                                  <RepnotesCheckbox
                                    disabled={
                                      !modules.rolesAndPermission.edit &&
                                      this.props.match.params.id !== "new"
                                        ? true
                                        : false
                                    }
                                    checked={
                                      roles.modules[column.field]
                                        ? (roles.modules[column.field][
                                            actions
                                          ] as boolean)
                                        : false
                                    }
                                    onClick={() => {
                                      if (
                                        actions === "view" &&
                                        (roles.modules[column.field][
                                          actions
                                        ] as boolean)
                                      ) {
                                        this._rolesInput("modules", {
                                          ...roles.modules,
                                          [column.field]: {
                                            ...roles.modules[column.field],
                                            view: false,
                                            add: false,
                                            edit: false,
                                            delete: false,
                                          },
                                        });
                                      } else if (
                                        actions !== "view" &&
                                        !(roles.modules[column.field][
                                          actions
                                        ] as boolean)
                                      ) {
                                        this._rolesInput("modules", {
                                          ...roles.modules,
                                          [column.field]: {
                                            ...roles.modules[column.field],
                                            view: true,
                                            [actions]: !roles.modules[
                                              column.field
                                            ][actions] as boolean,
                                          },
                                        });
                                      } else {
                                        this._rolesInput("modules", {
                                          ...roles.modules,
                                          [column.field]: {
                                            ...roles.modules[column.field],
                                            [actions]: !roles.modules[
                                              column.field
                                            ][actions] as boolean,
                                          },
                                        });
                                      }
                                    }}
                                  />
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export const mapStateToProps = (state: AppState) => ({
  system: state.system,
  // alert: state.alert,
  rolesState: state.rolesState,
  dialog: state.dialog,
});

export default connect(mapStateToProps, {
  setRolesState,
  loadRolesDetails,
  updateRole,
  setRolesValidationState,
  saveRoles,
  setDialogOpen,
  clearDialog,
  setRedirect,
})(RepnotesRolesForm);
