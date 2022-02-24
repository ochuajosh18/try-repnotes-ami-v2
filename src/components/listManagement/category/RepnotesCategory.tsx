import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { AlertState } from '../../../store/alert/types';
import { CategoryState } from '../../../store/listManagement/category/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { getCompany } from '../../../store/listManagement/company/actions';
import { superAdminCompanyValidation } from '../../../store/userManagement/user/actions';
import { setRedirect, resetListManagementState } from '../../../store/system/actions';
import { 
    deleteCategory, 
    getCategoryList, 
    setCompanyFilter
} from '../../../store/listManagement/category/actions';
import { DialogState } from '../../../store/dialog/types';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { RepnotesTable } from '../../common/RepnotesTable';
import { 
    LoadingDialog, 
    // RepnotesAlert, 
    RepnotesDialog 
} from '../../common/RepnotesAlerts';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import map from 'lodash/map'
import moment from 'moment';

interface CategoryProps {
    resetListManagementState: typeof resetListManagementState;
    getCategoryList: typeof getCategoryList;
    setRedirect: typeof setRedirect;
    deleteCategory: typeof deleteCategory;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getCompany: typeof getCompany;
    setCompanyFilter: typeof setCompanyFilter;
    superAdminCompanyValidation: typeof superAdminCompanyValidation;
    companyList: CompanyState;
    categoryState: CategoryState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const TABLE_COLUMNS = [
    { field: 'name', title: 'Name', cellStyle, headerStyle},
    { field: 'isActive', title: 'Status', cellStyle, headerStyle},
    { field: 'dateCreated', title: 'Date Created', cellStyle, headerStyle},
    { field: 'dateUpdated', title: 'Date Updated', cellStyle, headerStyle},
    { field: 'action', title: 'Actions', cellStyle, headerStyle}
];

class RepnotesCategory extends Component<CategoryProps> {

    componentDidMount = () => {
        if (this.props.system.redirectPage.redirectTo !== '/category') {
            this.props.resetListManagementState();
        }
        this._validateRole();
        this._loadOptions();
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    _validateRole = async() => {
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') await this.props.setCompanyFilter({selectedCompanyId: this.props.system.session.userDetails.companyId as string});
        this._loadTable();
    } 

    _loadTable = () => {
        if(this.props.categoryState.selectedCompanyId !== '') this.props.getCategoryList(this.props.system, this.props.categoryState.selectedCompanyId);
    }

    _loadOptions = () =>{
        this.props.getCompany(this.props.system.session.token);
    }

    _onDialogOpen = (id: string | number, name: string | number) => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: name, dialogType: 'delete', docId: id })
    }

    _deleteCategory = () => {
        if(this.props.categoryState.selectedCompanyId !== ''){
            this.props.deleteCategory(this.props.dialog.docId, this.props.system.session.token, this.props.categoryState.selectedCompanyId);
            this.props.clearDialog();
            setTimeout(() => {
                this._loadTable();
            },500)
        }
    }

    _companyFilter = async(value: string ) => {
        await this.props.setCompanyFilter({selectedCompanyId: value as string});
        this._loadTable(); 
    }

    _companyValidation = () =>{
        this.props.superAdminCompanyValidation()
    }

    render = () => {
        const { categoryList, loading, selectedCompanyId } = this.props.categoryState;
        const { userDetails, modules } = this.props.system.session;
        const { companyArray } = this.props.companyList;

        let filteredCompanyList = companyArray.filter(item => item.isActive);

        return (
            <Box className= 'repnotes-content'>
                {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
                <RepnotesDialog 
                    label={this.props.dialog.dialogLabel}
                    open={this.props.dialog.dialogOpen}
                    severity={this.props.dialog.dialogType}
                    onClick={this._deleteCategory.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName = "List Management" subModule= "Category" />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        { loading ? <LoadingDialog />
                            :<RepnotesTable
                                link="category"
                                role={userDetails.role as string}
                                companyList={filteredCompanyList}
                                companyFilter={this._companyFilter}
                                companyValidation={this._companyValidation}
                                selectedCompany={selectedCompanyId}
                                columns={TABLE_COLUMNS}
                                data={map(categoryList, (data: any) => ({
                                    ...data,
                                    dateCreated: data.dateCreated ? moment(data.dateCreated).format('MMMM D, YYYY') : '',
                                    dateUpdated: data.dateUpdated ? moment(data.dateUpdated).format('MMMM D, YYYY') : ''
                                }))}
                                onDialogOpen={this._onDialogOpen}
                                permission={modules.listManagement}
                            />
                        }
                    </Grid>
                </Grid>
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    categoryState: state.categoryState,
    companyList: state.companyList,
    system: state.system,
    // alert: state.alert,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setRedirect,
    deleteCategory,
    clearDialog,
    getCategoryList,
    getCompany,
    setCompanyFilter,
    superAdminCompanyValidation,
    setDialogOpen,
    resetListManagementState
})(RepnotesCategory);
