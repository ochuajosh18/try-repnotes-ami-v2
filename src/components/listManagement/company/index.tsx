import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { AlertState } from '../../../store/alert/types';
import { DialogState } from '../../../store/dialog/types';
import { 
    getCompany, 
    deleteCompany 
} from '../../../store/listManagement/company/actions';
import { setRedirect, resetListManagementState } from '../../../store/system/actions';
import { clearDialog, setDialogOpen } from '../../../store/dialog/actions';
import { RepnotesTable } from '../../common/RepnotesTable';
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { LoadingDialog, RepnotesDialog } from '../../common/RepnotesAlerts';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import map from 'lodash/map';
import moment from 'moment';


const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle = { textAlign: 'left' };

const TABLE_COLUMNS = [
    { field: 'companyId', title: 'Company ID', cellStyle, headerStyle},
    { field: 'name', title: 'Company Name', cellStyle, headerStyle},
    { field: 'isActive', title: 'Status', cellStyle, headerStyle},
    { field: 'dateCreated', title: 'Date Created', cellStyle, headerStyle},
    { field: 'dateUpdated', title: 'Date Updated', cellStyle, headerStyle},
    { field: 'action', title: 'Action', cellStyle, headerStyle}
];

interface CompanyProps {
   resetListManagementState: typeof resetListManagementState;
    setRedirect: typeof setRedirect;
    getCompany: typeof getCompany;
    deleteCompany: typeof deleteCompany;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    system: SystemState;
    companyList: CompanyState;
    alert: AlertState;
    dialog: DialogState;
}

class Company extends Component<CompanyProps> {
    
    componentDidMount = () => {
        this._loadTable();
        this.props.resetListManagementState();
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    _onDialogOpen = (id: string | number, name: string | number) => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: name, dialogType: 'delete', docId: id })
    }

    _loadTable = () => {
        this.props.getCompany(this.props.system.session.token)
    }

    _deleteCompany = () => {
        this.props.deleteCompany(this.props.dialog.docId, this.props.system.session.token)
        this.props.clearDialog()
        setTimeout(() => {
            this._loadTable();
        },500)
    }

    render() {
        const { companyArray, loading } = this.props.companyList
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
                    onClick={this._deleteCompany.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '20px' }}>
                        <RepnotesContentHeader moduleName = "List Management" subModule= "Company" />
                    </Grid>
                    <Grid item xs={12}>
                        { loading ?
                            <LoadingDialog></LoadingDialog>
                            :
                            <RepnotesTable
                                link="company"
                                companyValidation={( ) => {}}
                                companyFilter={( value: string ) => {}}
                                columns={TABLE_COLUMNS}
                                data={map (companyArray, (data: any) => ({
                                    ...data,
                                    dateCreated: data.dateCreated ? moment(data.dateCreated).format('MMMM D, YYYY') : '',
                                    dateUpdated: data.dateUpdated ? moment(data.dateUpdated).format('MMMM D, YYYY') : ''
                                }))}
                                onDialogOpen={this._onDialogOpen}
                                permission={{
                                    add: true,
                                    delete: true,
                                    edit: true,
                                    view: true
                                }}
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
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    getCompany,
    setRedirect,
    deleteCompany,
    clearDialog,
    setDialogOpen,
    resetListManagementState
})(Company);
