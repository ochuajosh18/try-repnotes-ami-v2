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
    TierDetails, 
    TierState 
} from '../../../store/listManagement/tier/types';
import { 
    setTierState, 
    loadTierDetails, 
    saveTier, 
    updateTierDetails, 
    setTierValidationState 
} from '../../../store/listManagement/tier/actions';
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
import forEach from 'lodash/forEach';

interface RepnotesTierFormProps {
    setRedirect: typeof setRedirect;
    saveTier: typeof saveTier;
    loadTierDetails: typeof loadTierDetails;
    setTierState: typeof setTierState;
    updateTierDetails: typeof updateTierDetails;
    setTierValidationState: typeof setTierValidationState;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    tierState: TierState;
    system: SystemState;
    // alert: AlertState;
    dialog: DialogState;
}

const EMPTY_TIER = {
    companyId: '',
    isActive: true,
    name:  ''
} as TierDetails;

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

class RepnotesTierForm extends Component<RepnotesTierFormProps & RouteParams> {
    
    componentDidMount = () => {
        if(this.props.match.params.id === 'new') this.props.setTierState({tier: {...EMPTY_TIER, companyId: this.props.tierState.selectedCompanyId } })
        else this.props.loadTierDetails(this.props.match.params.id, this.props.system.session.token, this.props.tierState.selectedCompanyId) 
    }

    _tierInput = (field: string, value: string | boolean) => {
        const { tier } = this.props.tierState
        const newTier = { ...tier, [field]: value };
        this.props.setTierState({tier: newTier});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.tierState.tier ? this.props.tierState.tier.name : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveUser();
    }

    _onSaveUser = () => {
        if(this.props.match.params.id === 'new') this.props.saveTier(this.props.tierState.tier as TierDetails, this.props.system, this.props.tierState.selectedCompanyId)
        else this.props.updateTierDetails(this.props.tierState.tier as TierDetails, this.props.system.session.token)
    }

    _onClickSave = () => {
        const { tier } = this.props.tierState 
        if(tier){
            let required = ['name']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(tier[item] === '') {
                    this.props.setTierValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    render = () => {
        const { modules } = this.props.system.session;
        const { tier, validation, loading } = this.props.tierState;   

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
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="List Management" subModule="Tier" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/tier' })} >
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
                            tier ?
                                <Grid container>
                                    <Grid item xs={1}/>
                                    <Grid item xs={7}>
                                        <RepnotesInput
                                            id="repnotes-tier-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            error={ !validation ? false : ( validation && tier.name === '' ? true : false) }
                                            value={tier.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._tierInput('name', e.target.value)
                                            }}
                                        />
                                        <RepnotesInput
                                            id="repnotes-tier-status"
                                            type="select"
                                            label="Status"
                                            labelPosition="left"
                                            value={tier.isActive}
                                            options={STATUS_ARRAY}
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                this._tierInput('isActive', (e.target.value === 'true') ? true : false)
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
    tierState: state.tierState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setTierState,
    saveTier,
    updateTierDetails,
    setTierValidationState,
    loadTierDetails,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesTierForm);