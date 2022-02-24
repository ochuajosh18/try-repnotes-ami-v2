import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    RouteComponentProps, 
    match
} from 'react-router';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { 
    GovernmentPrivateDetails, 
    GovernmentPrivateState 
} from '../../../store/listManagement/governmentPrivate/types';
import { 
    setGovernmentPrivateState, 
    loadGovernmentPrivateDetails, 
    updateGovernmentPrivateDetails, 
    setGovernmentPrivateValidationState, 
    saveGovernmentPrivate
} from '../../../store/listManagement/governmentPrivate/actions';
import { setRedirect } from '../../../store/system/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { DialogState } from '../../../store/dialog/types';
import { AlertState } from '../../../store/alert/types';

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


interface RepnotesGovernmentPrivateFormProps {
    setRedirect: typeof setRedirect;
    saveGovernmentPrivate: typeof saveGovernmentPrivate;
    loadGovernmentPrivateDetails: typeof loadGovernmentPrivateDetails;
    setGovernmentPrivateState: typeof setGovernmentPrivateState;
    updateGovernmentPrivateDetails: typeof updateGovernmentPrivateDetails;
    setGovernmentPrivateValidationState: typeof setGovernmentPrivateValidationState;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    governmentPrivateState: GovernmentPrivateState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}

const EMPTY_GOVERNMENT_PRIVATE = {
    companyId: '',
    isActive: true,
    name:  ''
} as GovernmentPrivateDetails;

const STATUS_ARRAY = [
    { id: 'true', name: 'Active'},
    { id: 'false', name: 'Inactive'}
];

interface MatchParams {
    params:{ id: string}
} 

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

class RepnotesGovernmentPrivateForm extends Component<RepnotesGovernmentPrivateFormProps & RouteParams> {
    
    componentDidMount = () => {
        if(this.props.match.params.id === 'new') this.props.setGovernmentPrivateState({governmentPrivate: {...EMPTY_GOVERNMENT_PRIVATE, companyId: this.props.governmentPrivateState.selectedCompanyId} });
        else this.props.loadGovernmentPrivateDetails(this.props.match.params.id, this.props.system.session.token, this.props.governmentPrivateState.selectedCompanyId) 
    }

    _governmentPrivateInput = (field: string, value: string | boolean) => {
        const { governmentPrivate } = this.props.governmentPrivateState
        const newGovernmentPrivate = { ...governmentPrivate, [field]: value };
        this.props.setGovernmentPrivateState({governmentPrivate: newGovernmentPrivate});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.governmentPrivateState.governmentPrivate ? this.props.governmentPrivateState.governmentPrivate.name : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveGovernmentPrivate();
    }

    _onSaveGovernmentPrivate = () => {
        if(this.props.match.params.id === 'new') this.props.saveGovernmentPrivate(this.props.governmentPrivateState.governmentPrivate as GovernmentPrivateDetails, this.props.system, this.props.governmentPrivateState.selectedCompanyId);
        else this.props.updateGovernmentPrivateDetails(this.props.governmentPrivateState.governmentPrivate as GovernmentPrivateDetails, this.props.system.session.token)
        
    }

    _onClickSave = () => {
        const { governmentPrivate } = this.props.governmentPrivateState 
        if(governmentPrivate){
            let required = ['name']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(governmentPrivate[item] === '') {
                    this.props.setGovernmentPrivateValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    render = () => {
        const { modules } = this.props.system.session;
        const { governmentPrivate, validation, loading } = this.props.governmentPrivateState;

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
                        <RepnotesContentHeader moduleName = "List Management" subModule= "Government Private" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/government-private' })} >
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
                <Grid className="repnotes-form" container spacing={1} >
                        { 
                            governmentPrivate ?
                                <Grid container>
                                    <Grid item xs={1}/>
                                    <Grid item xs={7}>
                                        <RepnotesInput
                                            id="repnotes-governmentPrivate-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            error={ !validation ? false : ( validation && governmentPrivate.name === '' ? true : false) }
                                            value={governmentPrivate.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._governmentPrivateInput('name', e.target.value)
                                            }}
                                        />
                                        <RepnotesInput
                                            id="repnotes-governmentPrivate-status"
                                            type="select"
                                            label="Status"
                                            labelPosition="left"
                                            value={governmentPrivate.isActive}
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            options={STATUS_ARRAY}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: string | any}>) => {
                                                this._governmentPrivateInput('isActive', (e.target.value === 'true') ? true : false)
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
    governmentPrivateState: state.governmentPrivateState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setGovernmentPrivateState,
    saveGovernmentPrivate,
    updateGovernmentPrivateDetails,
    setGovernmentPrivateValidationState,
    loadGovernmentPrivateDetails,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesGovernmentPrivateForm);