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
import { 
    InternationalLocalDetails, 
    InternationalLocalState 
} from '../../../store/listManagement/internationalLocal/types';
import { 
    setInternationalLocalState, 
    loadInternationalLocalDetails, 
    saveInternationalLocal, 
    updateInternationalLocalDetails, 
    setInternationalLocalValidationState 
} from '../../../store/listManagement/internationalLocal/actions';
import { setRedirect } from '../../../store/system/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';

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
import forEach from 'lodash/forEach'

interface RepnotesInternationalLocalFormProps {
    setRedirect: typeof setRedirect;
    saveInternationalLocal: typeof saveInternationalLocal;
    loadInternationalLocalDetails: typeof loadInternationalLocalDetails;
    setInternationalLocalState: typeof setInternationalLocalState;
    updateInternationalLocalDetails: typeof updateInternationalLocalDetails;
    setInternationalLocalValidationState: typeof setInternationalLocalValidationState;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    internationalLocalState: InternationalLocalState;
    system: SystemState;
    // alert: AlertState;
    dialog: DialogState
}

const EMPTY_INTERNATIONAL_LOCAL = {
    companyId: '',
    isActive: true,
    name:  ''
} as InternationalLocalDetails;

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

class RepnotesInternationalLocalForm extends Component<RepnotesInternationalLocalFormProps & RouteParams> {
    
    componentDidMount = () => {
        if(this.props.match.params.id === 'new') this.props.setInternationalLocalState({internationalLocal: {...EMPTY_INTERNATIONAL_LOCAL, companyId: this.props.internationalLocalState.selectedCompanyId } })
        else this.props.loadInternationalLocalDetails(this.props.match.params.id, this.props.system.session.token, this.props.internationalLocalState.selectedCompanyId) 
    }

    _internationalLocalInput = (field: string, value: string | boolean) => {
        const { internationalLocal } = this.props.internationalLocalState
        const newInternationalLocal = { ...internationalLocal, [field]: value };
        this.props.setInternationalLocalState({internationalLocal: newInternationalLocal});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.internationalLocalState.internationalLocal ? this.props.internationalLocalState.internationalLocal.name : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveUser();
    }

    _onSaveUser = () => {
        if(this.props.match.params.id === 'new') this.props.saveInternationalLocal(this.props.internationalLocalState.internationalLocal as InternationalLocalDetails, this.props.system, this.props.internationalLocalState.selectedCompanyId)
        else this.props.updateInternationalLocalDetails(this.props.internationalLocalState.internationalLocal as InternationalLocalDetails, this.props.system.session.token)
    }

    _onClickSave = () => {
        const { internationalLocal } = this.props.internationalLocalState 
        if(internationalLocal){
            let required = ['name']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(internationalLocal[item] === '') {
                    this.props.setInternationalLocalValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    render = () => {
        const { modules } = this.props.system.session;
        const { internationalLocal, validation, loading } = this.props.internationalLocalState;

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
                    <Grid item xs={12} style= {{textAlign: 'left', paddingTop: '10px 0px'}}>
                        <RepnotesContentHeader moduleName="List Management" subModule="InternationalLocal" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/international-local' })} >
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
                            internationalLocal ?
                                <Grid container>
                                    <Grid item xs={1}/>
                                    <Grid item xs={7}>
                                        <RepnotesInput
                                            id="repnotes-internationalLocal-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            error={ !validation ? false : ( validation && internationalLocal.name === '' ? true : false) }
                                            value={internationalLocal.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._internationalLocalInput('name', e.target.value)
                                            }}
                                        />
                                        <RepnotesInput
                                            id="repnotes-internationalLocal-status"
                                            type="select"
                                            label="Status"
                                            labelPosition="left"
                                            value={internationalLocal.isActive}
                                            options={STATUS_ARRAY}
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                this._internationalLocalInput('isActive', (e.target.value === 'true') ? true : false)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}/>
                                </Grid>
                             :
                            <LoadingDialog />
                        }
                    </Grid>
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    system: state.system,
    // alert: state.alert,
    internationalLocalState: state.internationalLocalState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setInternationalLocalState,
    saveInternationalLocal,
    updateInternationalLocalDetails,
    setInternationalLocalValidationState,
    loadInternationalLocalDetails,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesInternationalLocalForm);