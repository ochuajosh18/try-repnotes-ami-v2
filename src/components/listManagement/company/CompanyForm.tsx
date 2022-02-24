import { Component } from 'react';
import { connect } from 'react-redux';
import { 
    match,
    RouteComponentProps 
} from 'react-router';
import { Link } from 'react-router-dom';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { AlertState } from '../../../store/alert/types';
import { 
    CompanyDetails, 
    CompanyState 
} from '../../../store/listManagement/company/types';
import { DialogState } from '../../../store/dialog/types';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { 
    setCompanyState, 
    getCompany, 
    saveCompany, 
    getSpecificCompany,
    updateCompany,
    setCompanyValidationState
} from '../../../store/listManagement/company/actions';
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { RepnotesInput } from '../../common/RepnotesInput';
import { 
    RepnotesDefaultButton, 
    RepnotesPrimaryButton 
} from '../../common/RepnotesButton';
import { 
    LoadingDialog, 
    // RepnotesAlert, 
    RepnotesDialog 
} from '../../common/RepnotesAlerts';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import map from 'lodash/map';
import forEach from 'lodash/forEach';


interface MatchParams {
    params: { id: string }
}

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface CompanyProps {
    saveCompany: typeof saveCompany;
    setCompanyState: typeof setCompanyState;
    getCompany: typeof getCompany;
    getSpecificCompany: typeof getSpecificCompany;
    updateCompany: typeof updateCompany;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    setCompanyValidationState: typeof setCompanyValidationState;
    system: SystemState;
    companyList: CompanyState;
    alert: AlertState;
    dialog: DialogState;
}

const STATUS_ARRAY = [
    { id: true, name: 'Active'},
    { id: false, name: 'Inactive'}
];

const EMPTY_COMPANY = {
    companyId: '',
    name: '',
    isActive: true
} as CompanyDetails


class CompanyForm extends Component<CompanyProps & RouteParams> {
    
    componentDidMount = () => {
        if(this.props.match.params.id === 'new'){ this.props.setCompanyState({company: EMPTY_COMPANY}) }
        else{ this.props.getSpecificCompany(this.props.match.params.id, this.props.system.session.token) } 
    }

    _companyInput = (field: string, value: string | boolean) => {
        const { company } = this.props.companyList;
        const newCompany = { ...company, [field]: value }
        this.props.setCompanyState({ company: newCompany });
    }

    _onDialogOpen = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.companyList.company ? this.props.companyList.company.name : '', dialogType: 'save', docId: '' })
    }

    _onSaveCompany = () => {
        if(this.props.match.params.id === 'new'){ this.props.saveCompany(this.props.companyList.company as CompanyDetails, this.props.system.session.token) }
        else{ this.props.updateCompany(this.props.companyList.company as CompanyDetails, this.props.system.session.token) }
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveCompany()
    }

    _onSaveClick = () => {
        const { company } = this.props.companyList;
        if(company){
            let required = ['companyId', 'name']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(company[item] === '') {
                    this.props.setCompanyValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onDialogOpen()
        }
    }

    render() {
        const { company, loading, validation } = this.props.companyList
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
                    onClick={this._onCloseDialog.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '20px' }}>
                        <RepnotesContentHeader moduleName = "List Management" subModule= "Company" />
                    </Grid>
                    <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                        <Link to="/company" style={{ textTransform: 'none', textDecoration: 'none' }}>
                            <RepnotesDefaultButton >
                                Cancel
                            </RepnotesDefaultButton>
                        </Link>
                            {loading ?
                                <RepnotesPrimaryButton>
                                    <CircularProgress 
                                        style={{ 
                                            display: 'flex',
                                            width: 20,
                                            height: 20,
                                            color: '#fff',
                                            padding: 3
                                        }}
                                    />
                                </RepnotesPrimaryButton>
                                :
                                <RepnotesPrimaryButton className="no-margin-right" onClick={this._onSaveClick.bind(this)}>
                                    Save
                                </RepnotesPrimaryButton>
                            }
                    </Grid>
                    <Grid className="repnotes-form" container justify="center" spacing={1} >
                        { company ?
                            <Grid container>
                            <Grid item xs={1}/>
                            <Grid item xs={7}>
                                <RepnotesInput
                                    id="repnotes-company-id"
                                    type="text"
                                    placeholder="Company Id"
                                    label="Company Id"
                                    labelPosition="left"
                                    value={company.companyId}
                                    error={ !validation ? false : ( validation && company.companyId === '' ? true : false) }
                                    disabled={(this.props.match.url === '/company/new') ? false : true}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        this._companyInput('companyId', e.target.value)
                                    }}
                                />
                                <RepnotesInput
                                    id="repnotes-company-name"
                                    type="text"
                                    placeholder="Company Name"
                                    label="Company Name"
                                    labelPosition="left"
                                    value={company.name}
                                    error={ !validation ? false : ( validation && company.companyId === '' ? true : false) }
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        this._companyInput('name', e.target.value)
                                    }}
                                />
                                <RepnotesInput
                                    id="repnotes-company-status"
                                    type="select"
                                    label="Status"
                                    labelPosition="left"
                                    value={company.isActive}
                                    options={map(STATUS_ARRAY, (data: any) => ({
                                        ...data
                                    }))}
                                    onSelectChange={(e: React.ChangeEvent<{ name?: string; value: string | any}>) => {
                                        this._companyInput('isActive', (e.target.value === 'true') ? true : false)
                                    }}
                                />
                                </Grid>
                                <Grid item xs={4}/>
                            </Grid>
                            :
                            <LoadingDialog></LoadingDialog>
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
    companyList: state.companyList,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    getCompany,
    setCompanyState,
    saveCompany,
    getSpecificCompany,
    updateCompany,
    clearDialog,
    setDialogOpen,
    setCompanyValidationState
})(CompanyForm);
