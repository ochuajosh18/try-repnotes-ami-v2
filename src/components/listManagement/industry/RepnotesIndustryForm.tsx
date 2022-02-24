import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    RouteComponentProps, 
    match
} from 'react-router';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { DialogState } from '../../../store/dialog/types';
// import { AlertState } from '../../../store/alert/types';
import { IndustryDetails, IndustryState } from '../../../store/listManagement/industry/types';
import { 
    loadIndustryDetails, 
    saveIndustry, 
    setIndustryState, 
    setIndustryValidationState, 
    updateIndustryDetails 
} from '../../../store/listManagement/industry/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { setRedirect } from '../../../store/system/actions';
import { 
    RepnotesDefaultButton, 
    RepnotesPrimaryButton
} from '../../common/RepnotesButton';
import { 
    LoadingDialog, 
    // RepnotesAlert, 
    RepnotesDialog 
} from '../../common/RepnotesAlerts';
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { RepnotesInput } from '../../common/RepnotesInput';
// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
// utils
import forEach from 'lodash/forEach';


interface MatchParams {
    params:{ id: string}
} 

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface RepnotesIndustryFormProps {
    setRedirect: typeof setRedirect;
    saveIndustry: typeof saveIndustry;
    loadIndustryDetails: typeof loadIndustryDetails;
    setIndustryState: typeof setIndustryState;
    updateIndustryDetails: typeof updateIndustryDetails;
    setIndustryValidationState: typeof setIndustryValidationState;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    industryState: IndustryState;
    system: SystemState;
    // alert: AlertState;
    dialog: DialogState;
}

const EMPTY_INDUSTRY = {
    companyId: '',
    isActive: true,
    name:  ''
} as IndustryDetails;

const STATUS_ARRAY = [
    { id: 'true', name: 'Active'},
    { id: 'false', name: 'Inactive'}
];

class RepnotesIndustryForm extends Component<RepnotesIndustryFormProps & RouteParams> {
    componentDidMount = () => {
        if(this.props.match.params.id === 'new'){ this.props.setIndustryState({ industry: {...EMPTY_INDUSTRY, companyId: this.props.industryState.selectedCompanyId} }) }
        else{ this.props.loadIndustryDetails(this.props.match.params.id, this.props.system.session.token, this.props.industryState.selectedCompanyId) }
    }

    _industryInput = (field: string, value: string | boolean) => {
        const { industry } = this.props.industryState
        const newIndustry = { ...industry, [field]: value };
        this.props.setIndustryState({industry: newIndustry});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: this.props.industryState.industry ? this.props.industryState.industry.name : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveIndustry();
    }

    _onSaveIndustry = () => {
        if(this.props.match.params.id === 'new'){ this.props.saveIndustry(this.props.industryState.industry as IndustryDetails, this.props.system, this.props.industryState.selectedCompanyId) }
        else{ this.props.updateIndustryDetails(this.props.industryState.industry as IndustryDetails, this.props.system.session.token) }
    }

    _onClickSave = () => {
        const { industry } = this.props.industryState 
        if(industry){
            let required = ['name']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(industry[item] === '') {
                    this.props.setIndustryValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    render = () => {
        const { modules } = this.props.system.session
        const { industry, validation, loading } = this.props.industryState     

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
                    onClick={this._onCloseDialog.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName = "List Management" subModule= "Industry" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/industry' })} >
                        Cancel
                    </RepnotesDefaultButton>
                    {
                        (modules.listManagement.edit || this.props.match.params.id === 'new' ) &&
                        <>
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
                                <RepnotesPrimaryButton className="no-margin-right" onClick={this._onClickSave.bind(this)}>
                                    Save
                                </RepnotesPrimaryButton>
                            }
                        </>
                    }
                </Grid>
                <Grid className="repnotes-form" container justify="center" spacing={1} >
                        { 
                            industry ?
                                <Grid container>
                                    <Grid item xs={1}/>
                                    <Grid item xs={7}>
                                        <RepnotesInput
                                            id="repnotes-industry-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            error={ !validation ? false : ( validation && industry.name === '' ? true : false) }
                                            value={industry.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._industryInput('name', e.target.value)
                                            }}
                                        />
                                        <RepnotesInput
                                            id="repnotes-industry-status"
                                            type="select"
                                            label="Status"
                                            labelPosition="left"
                                            value={industry.isActive}
                                            options={STATUS_ARRAY}
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                this._industryInput('isActive', (e.target.value === 'true') ? true : false)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}/>
                                </Grid>
                             :
                            <LoadingDialog></LoadingDialog>
                        }
                    </Grid>
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    system: state.system,
    // alert: state.alert,
    industryState: state.industryState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setIndustryState,
    saveIndustry,
    updateIndustryDetails,
    setIndustryValidationState,
    loadIndustryDetails,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesIndustryForm);