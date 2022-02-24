import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
// import { AlertState } from '../../../store/alert/types';
import { TurnoverState } from '../../../store/listManagement/turnover/types';
import { DialogState } from '../../../store/dialog/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { getCompany } from '../../../store/listManagement/company/actions';
import { superAdminCompanyValidation } from '../../../store/userManagement/user/actions';
import { setRedirect, resetListManagementState } from '../../../store/system/actions';
import { 
    deleteTurnover, 
    getTurnoverList, 
    setTOCompanyFilter
} from '../../../store/listManagement/turnover/actions';
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
import moment from 'moment';
import map from 'lodash/map'


interface TurnoverProps {
    resetListManagementState: typeof resetListManagementState;
    getTurnoverList: typeof getTurnoverList;
    setRedirect: typeof setRedirect;
    deleteTurnover: typeof deleteTurnover;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getCompany: typeof getCompany;
    setTOCompanyFilter: typeof setTOCompanyFilter;
    superAdminCompanyValidation: typeof superAdminCompanyValidation;
    companyList: CompanyState;
    turnoverState: TurnoverState;
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

class RepnotesTurnover extends Component<TurnoverProps> {

    componentDidMount(){
        if (this.props.system.redirectPage.redirectTo !== '/turnover') {
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
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') await this.props.setTOCompanyFilter({selectedCompanyId: this.props.system.session.userDetails.companyId as string});
        this._loadTable();
    } 

    _loadTable = () => {
        if(this.props.turnoverState.selectedCompanyId !== '') this.props.getTurnoverList(this.props.system, this.props.turnoverState.selectedCompanyId );
    }

    _loadOptions = () =>{
        this.props.getCompany(this.props.system.session.token);
    }

    _onDialogOpen = (id: string | number, name: string | number) => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: name, dialogType: 'delete', docId: id })
    }

    _deleteTurnover = () => {
        if(this.props.turnoverState.selectedCompanyId !== ''){
            this.props.deleteTurnover(this.props.dialog.docId, this.props.system.session.token, this.props.turnoverState.selectedCompanyId);
            this.props.clearDialog();
            setTimeout(() => {
                this._loadTable();
            },500)
        }
    }

    _companyFilter = async(value: string ) => {
        await this.props.setTOCompanyFilter({selectedCompanyId: value as string});
        this._loadTable(); 
    }

    _companyValidation = () =>{
        this.props.superAdminCompanyValidation()
    }

    render = () => {
        const { turnoverList, loading, selectedCompanyId } = this.props.turnoverState;
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
                    onClick={this._deleteTurnover.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName = "List Management" subModule= "Turnover" />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        { loading ? <LoadingDialog />
                            : <RepnotesTable
                                link="turnover"
                                role={userDetails.role as string}
                                companyList={filteredCompanyList}
                                companyFilter={this._companyFilter}
                                companyValidation={this._companyValidation}
                                selectedCompany={selectedCompanyId}
                                columns={TABLE_COLUMNS}
                                data={map (turnoverList, (data: any) => ({
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
    turnoverState: state.turnoverState,
    companyList: state.companyList,
    system: state.system,
    // alert: state.alert,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setRedirect,
    deleteTurnover,
    clearDialog,
    getTurnoverList,
    getCompany,
    setTOCompanyFilter,
    superAdminCompanyValidation,
    setDialogOpen,
    resetListManagementState
})(RepnotesTurnover);