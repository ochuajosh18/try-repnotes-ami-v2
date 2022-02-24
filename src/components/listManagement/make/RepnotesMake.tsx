import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
// import { AlertState } from '../../../store/alert/types';
import { MakeState } from '../../../store/listManagement/make/types';
import { setRedirect, resetListManagementState } from '../../../store/system/actions';
import { 
    deleteMake, 
    getMakeList, 
    setMakeCompanyFilter
} from '../../../store/listManagement/make/actions';
import { superAdminCompanyValidation } from '../../../store/userManagement/user/actions';
import { DialogState } from '../../../store/dialog/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { getCompany } from '../../../store/listManagement/company/actions';
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { RepnotesTable } from '../../common/RepnotesTable';
import { 
    LoadingDialog, 
    // RepnotesAlert, 
    RepnotesDialog 
} from '../../common/RepnotesAlerts';

import map from 'lodash/map'
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';


interface MakeProps {
    resetListManagementState: typeof resetListManagementState;
    getMakeList: typeof getMakeList;
    setRedirect: typeof setRedirect;
    deleteMake: typeof deleteMake;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getCompany: typeof getCompany;
    superAdminCompanyValidation: typeof superAdminCompanyValidation;
    setMakeCompanyFilter: typeof setMakeCompanyFilter;
    companyList: CompanyState;
    makeState: MakeState;
    system: SystemState;
    // alert: AlertState;
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

class RepnotesMake extends Component<MakeProps> {

    componentDidMount = () => {
        if (this.props.system.redirectPage.redirectTo !== '/make') {
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
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') await this.props.setMakeCompanyFilter({selectedCompanyId: this.props.system.session.userDetails.companyId as string});
        this._loadTable();
    } 


    _loadTable = () => {
        if(this.props.makeState.selectedCompanyId !== '') this.props.getMakeList(this.props.system, this.props.makeState.selectedCompanyId);
    }

    _loadOptions = () =>{
        this.props.getCompany(this.props.system.session.token);
    }

    _onDialogOpen = (id: string | number, name: string | number) => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: name, dialogType: 'delete', docId: id })
    }

    _deleteMake = () => {
        if(this.props.makeState.selectedCompanyId !== ''){
            this.props.deleteMake(this.props.dialog.docId, this.props.system.session.token, this.props.makeState.selectedCompanyId);
            this.props.clearDialog();
            setTimeout(() => {
                this._loadTable();
            },500)
        }
    }

    _companyFilter = async(value: string ) => {
        await this.props.setMakeCompanyFilter({selectedCompanyId: value as string});
        this._loadTable(); 
    }

    _companyValidation = () =>{
        this.props.superAdminCompanyValidation()
    }

    render = () => {
        const { makeList, loading, selectedCompanyId } = this.props.makeState;
        const { userDetails, modules } = this.props.system.session;
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
                    onClick={this._deleteMake.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="List Management" subModule="Make" />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        { loading ? <LoadingDialog />
                            :<RepnotesTable
                                link="make"
                                role={userDetails.role as string}
                                companyList={filteredCompanyList}
                                companyFilter={this._companyFilter}
                                companyValidation={this._companyValidation}
                                selectedCompany={selectedCompanyId}
                                columns={TABLE_COLUMNS}
                                data={map (makeList, (data: any) => ({
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
    makeState: state.makeState,
    companyList: state.companyList,
    system: state.system,
    // alert: state.alert,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setRedirect,
    deleteMake,
    clearDialog,
    setDialogOpen,
    getCompany,
    setMakeCompanyFilter,
    superAdminCompanyValidation,
    getMakeList,
    resetListManagementState
})(RepnotesMake);