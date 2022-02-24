import { ChangeEvent, Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../../../store";
import { SystemState } from "../../../store/system/types";
import { DialogState } from "../../../store/dialog/types";
// import { AlertState } from '../../../store/alert/types';
import { ProductState } from "../../../store/productManagement/product/types";
import { CompanyState } from "../../../store/listManagement/company/types";
import {
  deleteProduct,
  getProductList,
  setProductCompanyFilter,
  setProductState,
  importProductList,
  saveImportedProductList,
} from "../../../store/productManagement/product/actions";
import { setRedirect } from "../../../store/system/actions";
import { getCompany } from "../../../store/listManagement/company/actions";
import { superAdminCompanyValidation } from "../../../store/userManagement/user/actions";
import { clearDialog, setDialogOpen } from "../../../store/dialog/actions";
import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { RepnotesTable } from "../../common/RepnotesTable";
import RepnotesTableToolButton from "../../common/RepnotesTableToolButton";
import {
  LoadingDialog,
  // RepnotesAlert,
  RepnotesDialog,
} from "../../common/RepnotesAlerts";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

import map from "lodash/map";
import moment from "moment";

import Import from "../../../assets/images/import.png";
import GetTemplate from "../../../assets/images/get_template.png";
import RepnotesProductImport from "./fragments/RepnotesProductImport";

interface RepnotesBrochureProps {
  setProductState: typeof setProductState;
  setRedirect: typeof setRedirect;
  getProductList: typeof getProductList;
  deleteProduct: typeof deleteProduct;
  setProductCompanyFilter: typeof setProductCompanyFilter;
  getCompany: typeof getCompany;
  superAdminCompanyValidation: typeof superAdminCompanyValidation;
  clearDialog: typeof clearDialog;
  setDialogOpen: typeof setDialogOpen;
  importProductList: typeof importProductList;
  saveImportedProductList: typeof saveImportedProductList;
  productState: ProductState;
  companyList: CompanyState;
  system: SystemState;
  // alert: AlertState;
  dialog: DialogState;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };

const TABLE_COLUMNS = [
  { field: "name", title: "Title", cellStyle, headerStyle },
  { field: "make", title: "Make", cellStyle, headerStyle },
  { field: "productFamily", title: "Product Family", cellStyle, headerStyle },
  { field: "isActive", title: "Status", cellStyle, headerStyle },
  { field: "dateCreated", title: "Date Created", cellStyle, headerStyle },
  { field: "dateUpdated", title: "Date Updated", cellStyle, headerStyle },
  { field: "action", title: "Action", cellStyle, headerStyle },
];

class RepnoteBrochure extends Component<RepnotesBrochureProps> {
  componentDidMount = () => {
    const isFromCrud = this.props.system.redirectPage.redirectTo === "/product";
    this.props.setProductState({
      selectedCompanyId: isFromCrud ? this.props.productState.selectedCompanyId : "",
      productList: [],
    });
    this._validateRole(this.props.system.session.userDetails.role === "SUPER ADMIN");
    this._loadOptions();
    if (isFromCrud) this._loadTable(this.props.productState.selectedCompanyId);
    this.props.setRedirect({
      shallRedirect: false,
      redirectTo: "",
    });
  };

  _validateRole = (isAdmin: boolean) => {
    if (!isAdmin) {
      this.props.setProductCompanyFilter({
        selectedCompanyId: this.props.system.session.userDetails.companyId as string,
      });
      this._loadTable();
    }
  };

  _loadTable = (companyId?: string) => {
    if (this.props.productState.selectedCompanyId || companyId) {
      this.props.getProductList(
        this.props.system,
        companyId ? companyId : this.props.productState.selectedCompanyId
      );
    }
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

  _deleteProduct = () => {
    this.props.deleteProduct(this.props.dialog.docId, this.props.system.session.token);
    this.props.clearDialog();
    // setTimeout(() => {
    //     this._loadTable();
    // },500)
  };

  _companyFilter = async (value: string) => {
    await this.props.setProductCompanyFilter({ selectedCompanyId: value as string });
    this._loadTable();
  };

  _companyValidation = () => {
    this.props.superAdminCompanyValidation();
  };

  render = () => {
    const { userDetails, modules } = this.props.system.session;
    const {
      productList,
      loading,
      selectedCompanyId,
      dialogOpen,
      importLoading,
      importProductList,
    } = this.props.productState;
    const { companyArray } = this.props.companyList;

    let filteredCompanyList = companyArray.filter((item) => item.isActive);

    return (
      <Box className='repnotes-content'>
        {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
        <RepnotesProductImport
          open={dialogOpen}
          loading={importLoading}
          importData={importProductList}
          onClear={() => this.props.setProductState({ dialogOpen: false, importProductList: [] })}
          onSave={() => this.props.saveImportedProductList()}
        />
        <RepnotesDialog
          label={this.props.dialog.dialogLabel}
          open={this.props.dialog.dialogOpen}
          severity={this.props.dialog.dialogType}
          onClick={this._deleteProduct.bind(this)}
          onClear={this.props.clearDialog}
        />
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "left", paddingTop: "10px 0px" }}>
            <RepnotesContentHeader moduleName='Product Management' subModule='Product' />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            {loading ? (
              <LoadingDialog></LoadingDialog>
            ) : (
              <RepnotesTable
                link='product'
                importComponent={
                  <RepnotesTableToolButton
                    title='Import'
                    img={Import}
                    onFileChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) {
                        this.props.importProductList(
                          e.target.files[0],
                          this.props.productState.selectedCompanyId
                        );
                      }
                    }}
                    type='file'
                  />
                }
                getTemplateComponent={
                  <RepnotesTableToolButton
                    title='Get Template'
                    img={GetTemplate}
                    type='link'
                    linkTo='/templates/products.xlsx'
                  />
                }
                role={userDetails.role as string}
                companyList={filteredCompanyList}
                companyFilter={this._companyFilter}
                companyValidation={this._companyValidation}
                selectedCompany={selectedCompanyId}
                columns={TABLE_COLUMNS}
                data={map(productList, (data: any) => ({
                  ...data,
                  name: data.modelName,
                  dateCreated: data.dateCreated
                    ? moment(data.dateCreated).format("MMMM D, YYYY")
                    : "",
                  dateUpdated: data.dateUpdated
                    ? moment(data.dateUpdated).format("MMMM D, YYYY")
                    : "",
                }))}
                onDialogOpen={this._onDialogOpen}
                permission={modules.product}
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
  // alert: state.alert,
  productState: state.productState,
  companyList: state.companyList,
  dialog: state.dialog,
});

export default connect(mapStateToProps, {
  setRedirect,
  deleteProduct,
  clearDialog,
  setDialogOpen,
  getProductList,
  setProductCompanyFilter,
  superAdminCompanyValidation,
  getCompany,
  setProductState,
  importProductList,
  saveImportedProductList,
})(RepnoteBrochure);
