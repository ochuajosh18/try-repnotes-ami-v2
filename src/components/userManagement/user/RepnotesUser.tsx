import { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { SystemState } from "../../../store/system/types";
import { DialogState } from "../../../store/dialog/types";
import { User, UserState } from "../../../store/userManagement/user/types";
import { CompanyState } from "../../../store/listManagement/company/types";
import { getCompany } from "../../../store/listManagement/company/actions";
import { setRedirect } from "../../../store/system/actions";
import {
  deleteUser,
  getUserList,
  setCompanyFilter,
  setUserState,
  superAdminCompanyValidation,
  exportUserList,
} from "../../../store/userManagement/user/actions";
import { openAlert } from "../../../store/alert/actions";
import { clearDialog, setDialogOpen } from "../../../store/dialog/actions";
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { RepnotesTable } from "../../common/RepnotesTable";
import {
  LoadingDialog,
  // RepnotesAlert,
  RepnotesDialog,
} from "../../common/RepnotesAlerts";

import map from "lodash/map";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

interface RepnotesUsersProps {
  openAlert: typeof openAlert;
  exportUserList: typeof exportUserList;
  setRedirect: typeof setRedirect;
  setUserState: typeof setUserState;
  getUserList: typeof getUserList;
  deleteUser: typeof deleteUser;
  clearDialog: typeof clearDialog;
  setDialogOpen: typeof setDialogOpen;
  getCompany: typeof getCompany;
  superAdminCompanyValidation: typeof superAdminCompanyValidation;
  setCompanyFilter: typeof setCompanyFilter;
  system: SystemState;
  companyList: CompanyState;
  userState: UserState;
  dialog: DialogState;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };

const TABLE_COLUMNS = [
  { field: "name", title: "Name", cellStyle, headerStyle },
  { field: "role", title: "Role", cellStyle, headerStyle },
  { field: "isActive", title: "Status", cellStyle, headerStyle },
  { field: "dateCreated", title: "Date Created", cellStyle, headerStyle },
  { field: "dateUpdated", title: "Date Updated", cellStyle, headerStyle },
  { field: "action", title: "Actions", cellStyle, headerStyle },
];

class RepnotesUser extends Component<RepnotesUsersProps> {
  componentDidMount = () => {
    const isFromCrud = this.props.system.redirectPage.redirectTo === "/user";
    this.props.setUserState({
      selectedCompanyId: isFromCrud
        ? this.props.userState.selectedCompanyId
        : "",
      userList: [] as Array<User>,
    });
    this._validateRole(
      this.props.system.session.userDetails.role === "SUPER ADMIN"
    );
    this._loadOptions();
    if (isFromCrud) this._loadTable(this.props.userState.selectedCompanyId);
    this.props.setRedirect({
      shallRedirect: false,
      redirectTo: "",
    });
  };

  _validateRole = (isAdmin: boolean) => {
    if (!isAdmin) {
      this.props.setCompanyFilter({
        selectedCompanyId: this.props.system.session.userDetails
          .companyId as string,
      });
      this._loadTable();
    }
  };

  _loadTable = (companyId?: string) => {
    if (this.props.userState.selectedCompanyId || companyId)
      this.props.getUserList(
        this.props.system,
        companyId ? companyId : this.props.userState.selectedCompanyId
      );
  };

  _loadOptions = () => {
    this.props.getCompany(this.props.system.session.token);
  };

  _onDialogOpen = (id: string | number, name: string | number) => {
    this.props.setDialogOpen({
      dialogOpen: true,
      dialogLabel: name,
      dialogType: "delete",
      docId: id,
    });
  };

  _deleteUser = () => {
    this.props.deleteUser(
      this.props.dialog.docId,
      this.props.system.session.token
    );
    this.props.clearDialog();
    setTimeout(() => {
      this._loadTable();
    }, 500);
  };

  _companyFilter = async (value: string) => {
    await this.props.setCompanyFilter({ selectedCompanyId: value as string });
    this._loadTable();
  };

  _companyValidation = () => {
    this.props.superAdminCompanyValidation();
  };

  _onExportClick = () => {
    if (
      this.props.system.session.userDetails.role === "SUPER ADMIN" &&
      !this.props.userState.selectedCompanyId
    ) {
      this.props.openAlert("Please select a company to export", "warning");
    } else this.props.exportUserList();
  };

  render = () => {
    const { userList, loading, selectedCompanyId } = this.props.userState;
    const { userDetails, modules } = this.props.system.session;
    const { companyArray } = this.props.companyList;

    let filteredCompanyList = companyArray.filter((item) => item.isActive);

    return (
      <Box className='repnotes-content'>
        <RepnotesDialog
          label={this.props.dialog.dialogLabel}
          open={this.props.dialog.dialogOpen}
          severity={this.props.dialog.dialogType}
          onClick={this._deleteUser.bind(this)}
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
              subModule='User'
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            {loading ? (
              <LoadingDialog />
            ) : (
              <RepnotesTable
                link='user'
                withExport
                onExportClick={this._onExportClick}
                role={userDetails.role as string}
                companyList={filteredCompanyList}
                companyFilter={this._companyFilter}
                companyValidation={this._companyValidation}
                selectedCompany={selectedCompanyId}
                columns={TABLE_COLUMNS}
                data={map(userList, (data: any) => ({
                  ...data,
                  dateCreated: data.dateCreated
                    ? moment(data.dateCreated).format("MMMM D, YYYY")
                    : "",
                  dateUpdated: data.dateUpdated
                    ? moment(data.dateUpdated).format("MMMM D, YYYY")
                    : "",
                }))}
                onDialogOpen={this._onDialogOpen}
                permission={modules.user}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    );
  };
}

export const mapStateToProps = (state: AppState) => ({
  system: state.system,
  userState: state.userState,
  companyList: state.companyList,
  dialog: state.dialog,
});

export default connect(mapStateToProps, {
  exportUserList,
  getUserList,
  setRedirect,
  setUserState,
  deleteUser,
  clearDialog,
  getCompany,
  setCompanyFilter,
  superAdminCompanyValidation,
  setDialogOpen,
  openAlert,
})(RepnotesUser);
