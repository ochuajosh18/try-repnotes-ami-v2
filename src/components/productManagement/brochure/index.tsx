import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { DialogState } from '../../../store/dialog/types';
// import { AlertState } from '../../../store/alert/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { getCompany } from '../../../store/listManagement/company/actions';
import { superAdminCompanyValidation } from '../../../store/userManagement/user/actions';
import { BrochureState } from '../../../store/productManagement/brochure/types';
import { 
    deleteBrochure, 
    getBrochureList, 
    setBrochureCompanyFilter,
    setBrochureState
} from '../../../store/productManagement/brochure/actions';
import { setRedirect } from '../../../store/system/actions';
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
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import map from 'lodash/map'
import moment from 'moment';

interface RepnotesBrochureProps {
    setBrochureState: typeof setBrochureState;
    setRedirect: typeof setRedirect;
    getBrochureList: typeof getBrochureList;
    deleteBrochure: typeof deleteBrochure;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getCompany: typeof getCompany;
    superAdminCompanyValidation: typeof superAdminCompanyValidation;
    setBrochureCompanyFilter: typeof setBrochureCompanyFilter;
    companyList: CompanyState;
    brochureState: BrochureState;
    system: SystemState;
    // alert: AlertState;
    dialog: DialogState;
}


const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const TABLE_COLUMNS = [
    { field: 'name', title: 'Title', cellStyle, headerStyle},
    { field: 'productFamily', title: 'Product Family', cellStyle, headerStyle},
    { field: 'isActive', title: 'Status', cellStyle, headerStyle},
    { field: 'dateCreated', title: 'Date Created', cellStyle, headerStyle},
    { field: 'dateUpdated', title: 'Date Updated', cellStyle, headerStyle},
    { field: 'action', title: 'Action', cellStyle, headerStyle}
];

class RepnoteBrochure extends Component<RepnotesBrochureProps> {

    componentDidMount = () => {
        const isFromCrud = this.props.system.redirectPage.redirectTo === '/brochure';
        this.props.setBrochureState({ 
            selectedCompanyId: this.props.system.redirectPage.redirectTo === '/brochure' ? this.props.brochureState.selectedCompanyId : '', 
            brochureList: [] 
        });
        this._validateRole(this.props.system.session.userDetails.role === 'SUPER ADMIN');
        this._loadOptions();
        if (isFromCrud) this._loadTable(this.props.brochureState.selectedCompanyId);
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    _validateRole = (isAdmin: boolean) => {
        if(!isAdmin) {
            this.props.setBrochureCompanyFilter({ selectedCompanyId: this.props.system.session.userDetails.companyId as string });
            this._loadTable();
        }
    } 


    _loadTable = (companyId?: string) => {
        if(this.props.brochureState.selectedCompanyId || companyId){
            this.props.getBrochureList(this.props.system, companyId ? companyId : this.props.brochureState.selectedCompanyId );
        }
    }

    _loadOptions = () => {
        this.props.getCompany(this.props.system.session.token); 
    }

    _onDialogOpen = (id: string | number, name: string | number) => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: name, dialogType: 'delete', docId: id })
    }

    _deleteBrochure = () => {
        this.props.deleteBrochure(this.props.dialog.docId, this.props.system.session.token);
        this.props.clearDialog();
        setTimeout(() => {
            this._loadTable();
        },500)
    }

    _companyFilter = async(value: string ) => {
        await this.props.setBrochureCompanyFilter({selectedCompanyId: value as string});
        this._loadTable(); 
    }

    _companyValidation = () =>{
        this.props.superAdminCompanyValidation();
    }


    render = () => {
        const { userDetails, modules } = this.props.system.session;
        const { brochureList, loading, selectedCompanyId } = this.props.brochureState;
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
                    onClick={this._deleteBrochure.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Product Management" subModule="Brochure" />
                    </Grid>
                </Grid>
                
                <Grid container>
                    <Grid item xs={12}>
                        { loading ? <LoadingDialog />
                            :<RepnotesTable
                                link="brochure"
                                role={userDetails.role as string}
                                companyList={filteredCompanyList}
                                companyFilter={this._companyFilter}
                                companyValidation={this._companyValidation}
                                selectedCompany={selectedCompanyId}
                                columns={TABLE_COLUMNS}
                                data={map (brochureList, (data: any) => ({
                                    ...data,
                                    name: data.title,
                                    dateCreated: data.dateCreated ? moment(data.dateCreated).format('MMMM D, YYYY') : '',
                                    dateUpdated: data.dateUpdated ? moment(data.dateUpdated).format('MMMM D, YYYY') : ''
                                }))}
                                onDialogOpen={this._onDialogOpen}
                                permission={modules.brochure}
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
    // alert: state.alert,
    brochureState: state.brochureState,
    companyList: state.companyList,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    getBrochureList,
    setRedirect,
    deleteBrochure,
    clearDialog,
    setDialogOpen,
    getCompany,
    setBrochureCompanyFilter,
    superAdminCompanyValidation,
    setBrochureState
})(RepnoteBrochure);
