import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { DialogState } from '../../../store/dialog/types';
// import { AlertState } from '../../../store/alert/types';
import { RolesState } from '../../../store/userManagement/roles/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { getCompany } from '../../../store/listManagement/company/actions';
import { superAdminCompanyValidation } from '../../../store/userManagement/user/actions';
import { setRedirect } from '../../../store/system/actions';
import { 
    getRolesList, 
    deleteRole, 
    setRolesCompanyFilter ,
    setRolesState
} from '../../../store/userManagement/roles/actions';
import { clearDialog, setDialogOpen } from '../../../store/dialog/actions';

import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { RepnotesTable } from '../../common/RepnotesTable';
import { 
    LoadingDialog, 
    // RepnotesAlert, 
    RepnotesDialog
} from '../../common/RepnotesAlerts';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import map from 'lodash/map';

interface RepnotesRolesProps {
    system: SystemState;
    setRolesState: typeof setRolesState;
    setRedirect: typeof setRedirect;
    getRolesList: typeof getRolesList;
    deleteRole: typeof deleteRole;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getCompany: typeof getCompany;
    superAdminCompanyValidation: typeof superAdminCompanyValidation;
    setRolesCompanyFilter: typeof setRolesCompanyFilter;
    companyList: CompanyState;
    rolesState: RolesState;
    // alert: AlertState;
    dialog: DialogState;
}


const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const TABLE_COLUMNS = [
    { field: 'name', title: 'Role', cellStyle, headerStyle},
    { field: 'modules', title: 'Modules', cellStyle, headerStyle},
    { field: 'action', title: 'Actions', cellStyle, headerStyle}
];

class RepnotesRoles extends Component<RepnotesRolesProps> {

    componentDidMount = () => {
        const isFromCrud = this.props.system.redirectPage.redirectTo === '/roles-and-permission';
        this.props.setRolesState({ 
            selectedCompanyId: isFromCrud ? this.props.rolesState.selectedCompanyId : '', 
            rolesList: [] 
        });
        this._validateRole(this.props.system.session.userDetails.role === 'SUPER ADMIN');
        this._loadOptions();
        if (isFromCrud) this._loadTable(this.props.rolesState.selectedCompanyId)
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    _validateRole = (isAdmin: boolean) => {
        if(!isAdmin) {
            this.props.setRolesCompanyFilter({ selectedCompanyId: this.props.system.session.userDetails.companyId as string });
            this._loadTable();
        }
    } 

    _loadTable = (companyId?: string) => {
        if(this.props.rolesState.selectedCompanyId || companyId) this.props.getRolesList(this.props.system, companyId ? companyId : this.props.rolesState.selectedCompanyId)
    }

    _loadOptions = () =>{
        this.props.getCompany(this.props.system.session.token);
    }

    _onDialogOpen = (id: string | number, name: string | number) => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: name, dialogType: 'delete', docId: id })
    }

    _deleteRole = () => {
        this.props.deleteRole(this.props.dialog.docId, this.props.system.session.token);
        this.props.clearDialog();
        setTimeout(() => {
            this._loadTable();
        },500)
    }

    _companyFilter = async(value: string ) => {
        await this.props.setRolesCompanyFilter({selectedCompanyId: value as string});
        this._loadTable(); 
    }

    _companyValidation = () =>{
        this.props.superAdminCompanyValidation()
    }

    render = () => {
        const { userDetails, modules } = this.props.system.session;
        const { rolesList, loading, selectedCompanyId } = this.props.rolesState
        const { companyArray } = this.props.companyList;

        let filteredCompanyList = companyArray.filter(item => item.isActive);
        return (
            <Box className="repnotes-content">
                {/* <RepnotesAlert 
                    label={this.props.alert.alertMessage}
                    open={this.props.alert.alertOpen}
                    severity={this.props.alert.alertType}
                /> */}
                <RepnotesDialog 
                    label={this.props.dialog.dialogLabel}
                    open={this.props.dialog.dialogOpen}
                    severity={this.props.dialog.dialogType}
                    onClick={this._deleteRole.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="User Management" subModule="Roles and Permissions" />
                    </Grid>
                </Grid>
                
                <Grid container>
                    <Grid item xs={12}>
                        { loading ? <LoadingDialog />
                            :<RepnotesTable
                                link="roles-and-permission"
                                role={userDetails.role as string}
                                companyList={filteredCompanyList}
                                companyFilter={this._companyFilter}
                                companyValidation={this._companyValidation}
                                selectedCompany={selectedCompanyId}
                                columns={TABLE_COLUMNS}
                                data={map (rolesList, (data: any) => ({
                                    ...data,
                                    modules: data.modules ? JSON.stringify(data.modules) : ''
                                }))}
                                onDialogOpen={this._onDialogOpen}
                                permission={modules.rolesAndPermission}
                            />
                        }
                    </Grid>
                </Grid>
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    system: state.system,
    companyList: state.companyList,
    // alert: state.alert,
    rolesState: state.rolesState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    getRolesList,
    setRedirect,
    deleteRole,
    clearDialog,
    getCompany,
    setRolesCompanyFilter,
    superAdminCompanyValidation,
    setDialogOpen,
    setRolesState
})(RepnotesRoles);
