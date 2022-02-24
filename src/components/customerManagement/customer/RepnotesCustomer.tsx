import { ChangeEvent, Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AppState } from "../../../store";
import { SystemState } from "../../../store/system/types";
import { setRedirect } from "../../../store/system/actions";
import { CustomerDetails, CustomerState } from "../../../store/customerManagement/customer/types";
import { DialogState } from "../../../store/dialog/types";
import { CompanyState } from "../../../store/listManagement/company/types";
import {
  deleteCustomer,
  getCustomerList,
  loadCustomerDetails,
  setCompanyFilter,
  setCustomerApproval,
  setCustomerSearch,
  updateCustomerStatus,
  setCustomerState,
  exportCustomer,
  importCustomerList,
  saveImportCustomerList,
} from "../../../store/customerManagement/customer/actions";
import { clearDialog, setDialogOpen } from "../../../store/dialog/actions";
import { superAdminCompanyValidation } from "../../../store/userManagement/user/actions";
import { getCompany } from "../../../store/listManagement/company/actions";
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { RepnotesAddButton, RepnotesPrimaryButton } from "../../common/RepnotesButton";
import { RepnotesCustomerTables } from "./RepnotesCustomerTabs";
import { RepnotesInput } from "../../common/RepnotesInput";
import { CustomerApprovalDialog } from "./RepnotesCustomerDialogAction";
import {
  LoadingDialog,
  // RepnotesAlert,
  RepnotesDialog,
} from "../../common/RepnotesAlerts";
import RepnotesImportCustomer from "./fragments/RepnotesImportCustomer";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import moment from "moment";
import map from "lodash/map";
import filter from "lodash/filter";
import Import from "../../../assets/images/import.png";
import GetTemplate from "../../../assets/images/get_template.png";
import Export from "../../../assets/images/export.png";

interface CustomerProps {
  setCustomerState: typeof setCustomerState;
  getCustomerList: typeof getCustomerList;
  setRedirect: typeof setRedirect;
  deleteCustomer: typeof deleteCustomer;
  clearDialog: typeof clearDialog;
  setDialogOpen: typeof setDialogOpen;
  setCustomerSearch: typeof setCustomerSearch;
  setCustomerApproval: typeof setCustomerApproval;
  updateCustomerStatus: typeof updateCustomerStatus;
  loadCustomerDetails: typeof loadCustomerDetails;
  setCompanyFilter: typeof setCompanyFilter;
  superAdminCompanyValidation: typeof superAdminCompanyValidation;
  getCompany: typeof getCompany;
  exportCustomer: typeof exportCustomer;
  importCustomerList: typeof importCustomerList;
  saveImportCustomerList: typeof saveImportCustomerList;
  customerState: CustomerState;
  companyList: CompanyState;
  system: SystemState;
  dialog: DialogState;
}

class RepnotesCustomer extends Component<CustomerProps> {
  componentDidMount = () => {
    const isFromCrud = this.props.system.redirectPage.redirectTo === "/customer";
    this.props.setCustomerState({
      selectedCompanyId: isFromCrud ? this.props.customerState.selectedCompanyId : "",
      customerList: [],
    });
    this._validateRole(this.props.system.session.userDetails.role === "SUPER ADMIN");
    this._loadOptions();
    if (isFromCrud) this._loadTable(this.props.customerState.selectedCompanyId);
    this.props.setRedirect({
      shallRedirect: false,
      redirectTo: "",
    });
  };

  _validateRole = (isAdmin: boolean) => {
    if (!isAdmin) {
      this.props.setCompanyFilter({
        selectedCompanyId: this.props.system.session.userDetails.companyId as string,
      });
      this._loadTable();
    }
  };

  _loadTable = (companyId?: string) => {
    if (this.props.customerState.selectedCompanyId || companyId) {
      this.props.getCustomerList(
        this.props.system,
        companyId ? companyId : this.props.customerState.selectedCompanyId
      );
    }
  };

  _loadOptions = () => {
    this.props.getCompany(this.props.system.session.token);
  };

  _onDialogOpen = (id: string | number, name: string | number, type: string | number) => {
    if (type === "view") {
      this.props.setCustomerApproval({ approval: true });
      this.props.loadCustomerDetails(id as string, this.props.system.session.token);
    } else {
      this.props.setDialogOpen({
        dialogOpen: true,
        dialogLabel: name,
        dialogType: "delete",
        docId: id,
      });
    }
  };

  _deleteCustomer = () => {
    this.props.deleteCustomer(this.props.dialog.docId, this.props.system.session.token);
    this.props.clearDialog();
    setTimeout(() => {
      this._loadTable();
    }, 500);
  };

  _importCustomer = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      this.props.importCustomerList(e.target.files[0], this.props.customerState.selectedCompanyId);
    }
  };
  _handleCustomerSearch = (value: string) => {
    this.props.setCustomerSearch({ searchData: value });
  };

  _approvalDialogAction = (action: string, id: string) => {
    if (action === "cancel") {
      this.props.setCustomerApproval({ approval: false });
    } else {
      this.props.updateCustomerStatus(
        action,
        id,
        this.props.system,
        this.props.customerState.selectedCompanyId
      );
    }
  };

  _onExportClick = () => {
    this.props.exportCustomer(this.props.customerState.selectedCompanyId);
  };

  _companyFilter = async (value: string) => {
    await this.props.setCompanyFilter({ selectedCompanyId: value as string });
    this._loadTable();
  };

  _companyValidation = () => {
    this.props.superAdminCompanyValidation();
  };

  render = () => {
    const {
      dialogOpen,
      importLoading,
      importCustomerList,
      customerList,
      loading,
      searchData,
      approval,
      customer,
      selectedCompanyId,
    } = this.props.customerState;
    const { userDetails, modules } = this.props.system.session;
    const { companyArray } = this.props.companyList;

    let filteredCompanyList = companyArray.filter((item) => item.isActive);

    let tableData = customerList;
    if (searchData) {
      tableData = filter(tableData as Array<unknown>, (row: CustomerDetails) => {
        const r = {
          ...row,
          dateCreated: moment(row.dateCreated as string).format("MMMM D, YYYY"),
          dateUpdated: moment(row.dateUpdated as string).format("MMMM D, YYYY"),
        };
        return JSON.stringify(r).toLowerCase().indexOf(searchData.toLowerCase()) > -1;
      }) as typeof tableData;
    }
    const approvalData = filter(customerList, (item) => item.id === customer?.id);

    return (
      <Box className='repnotes-content'>
        <RepnotesImportCustomer
          open={dialogOpen}
          loading={importLoading}
          importData={importCustomerList}
          onClear={() => this.props.setCustomerState({ dialogOpen: false })}
          onSave={() => this.props.saveImportCustomerList()}
          showImportSummary={this.props.customerState.summaryDialog}
          onClose={() =>
            this.props.setCustomerState({
              summaryDialog: false,
              dialogOpen: false,
              importCustomerList: [],
            })
          }
        />
        <CustomerApprovalDialog
          open={approval}
          onClose={this._approvalDialogAction.bind(this)}
          salesPerson={approvalData.length ? (approvalData[0].salesPerson as string) : ""}
          name={approvalData.length ? approvalData[0].name : ("" as string)}
          category={approvalData.length ? approvalData[0].category : ("" as string)}
          area={customer?.area as string}
          province={customer?.province as string}
          city={customer?.cityTown as string}
          id={customer?.id as string}
          disabled={modules.customer.edit as boolean}
        />
        <RepnotesDialog
          label={this.props.dialog.dialogLabel}
          open={this.props.dialog.dialogOpen}
          severity={this.props.dialog.dialogType}
          onClick={this._deleteCustomer.bind(this)}
          onClear={this.props.clearDialog}
        />
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "left", paddingTop: "10px 0px" }}>
            <RepnotesContentHeader moduleName='Customer Management' subModule='Customer' />
          </Grid>
        </Grid>
        <Grid>
          <Grid style={{ paddingTop: "20px" }}>
            <Grid container item xs={12}>
              <Grid item xs={2}>
                {userDetails.role === "SUPER ADMIN" && (
                  <RepnotesInput
                    id='repnotes-margin-model'
                    type='select'
                    label='Company Name'
                    labelPosition='top'
                    firstSelectOption={selectedCompanyId !== "" ? "removeall" : ""}
                    value={selectedCompanyId}
                    options={map(filteredCompanyList, (data) => ({
                      id: data.companyId,
                      name: data.name,
                    }))}
                    onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                      this._companyFilter(e.target.value as string);
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={7} style={{ width: "100%" }}>
                <Box
                  width='100%'
                  display='flex'
                  boxSizing='border-box'
                  justifyContent='flex-end'
                  style={{ paddingTop: 23, paddingRight: 8 }}
                >
                  <Link
                    to='/templates/customer.xlsx'
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
                      marginRight: 8,
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
                      this._importCustomer(e);
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
                      alignSelf: "unset",
                      width: 120,
                      boxSizing: "border-box",
                      marginRight: 0,
                    }}
                    onClick={this._onExportClick}
                  >
                    Export
                  </RepnotesPrimaryButton>
                </Box>
              </Grid>
              <Grid item xs={3} style={{ width: "100%" }}>
                <Box display='flex' width='100%' style={{ paddingTop: 17 }}>
                  <Box width='100%'>
                    <RepnotesInput
                      id='search'
                      type='search'
                      placeholder='Search'
                      value={searchData}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        this._handleCustomerSearch(e.target.value);
                      }}
                      onClear={() => this._handleCustomerSearch("")}
                    />
                  </Box>
                  <Box p={0} style={{ paddingTop: "6px" }}>
                    {selectedCompanyId === "" ? (
                      <RepnotesAddButton onClick={() => this._companyValidation()}>
                        <AddRoundedIcon />
                      </RepnotesAddButton>
                    ) : (
                      <Link
                        to='/customer/new'
                        style={{ textTransform: "none", textDecoration: "none" }}
                      >
                        <RepnotesAddButton>
                          <AddRoundedIcon />
                        </RepnotesAddButton>
                      </Link>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {loading && !approval ? (
              <LoadingDialog />
            ) : (
              <RepnotesCustomerTables
                onDialogOpen={this._onDialogOpen}
                companyValidation={this._companyValidation}
                companyFilter={this._companyFilter}
                data={map(tableData, (data: any) => ({
                  ...data,
                  dateCreated: data.dateCreated
                    ? moment(data.dateCreated).format("MMMM D, YYYY")
                    : "",
                  dateUpdated: data.dateUpdated
                    ? moment(data.dateUpdated).format("MMMM D, YYYY")
                    : "",
                }))}
                permission={modules.customer}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    );
  };
}

export const mapStateToProps = (state: AppState) => ({
  customerState: state.customerState,
  companyList: state.companyList,
  system: state.system,
  dialog: state.dialog,
});

export default connect(mapStateToProps, {
  setRedirect,
  deleteCustomer,
  clearDialog,
  setDialogOpen,
  getCustomerList,
  setCustomerApproval,
  setCustomerSearch,
  updateCustomerStatus,
  loadCustomerDetails,
  setCompanyFilter,
  getCompany,
  superAdminCompanyValidation,
  setCustomerState,
  exportCustomer,
  importCustomerList,
  saveImportCustomerList,
})(RepnotesCustomer);
