import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    RouteComponentProps, 
    match
} from 'react-router';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { 
    MakeDetails, 
    MakeState 
} from '../../../store/listManagement/make/types';
import { 
    setMakeState, 
    loadMakeDetails, 
    updateMakeDetails, 
    setMakeValidationState, 
    saveMake
} from '../../../store/listManagement/make/actions';
import { setRedirect } from '../../../store/system/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { DialogState } from '../../../store/dialog/types';
// import { AlertState } from '../../../store/alert/types';

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


interface RepnotesMakeFormProps {
    setRedirect: typeof setRedirect;
    saveMake: typeof saveMake;
    loadMakeDetails: typeof loadMakeDetails;
    setMakeState: typeof setMakeState;
    updateMakeDetails: typeof updateMakeDetails;
    setMakeValidationState: typeof setMakeValidationState;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    makeState: MakeState;
    system: SystemState;
    // alert: AlertState;
    dialog: DialogState;
}

const EMPTY_MAKE = {
    companyId: '',
    isActive: true,
    name:  ''
} as MakeDetails;

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

class RepnotesMakeForm extends Component<RepnotesMakeFormProps & RouteParams> {
    
    componentDidMount = () => {
        if(this.props.match.params.id === 'new') this.props.setMakeState({make: {...EMPTY_MAKE, companyId: this.props.makeState.selectedCompanyId } });
        else this.props.loadMakeDetails(this.props.match.params.id, this.props.system.session.token, this.props.makeState.selectedCompanyId);
    }

    _makeInput = (field: string, value: string | boolean) => {
        const { make } = this.props.makeState
        const newMake = { ...make, [field]: value };
        this.props.setMakeState({make: newMake});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.makeState.make ? this.props.makeState.make.name : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveMake();
    }

    _onSaveMake = () => {
        if(this.props.match.params.id === 'new') this.props.saveMake(this.props.makeState.make as MakeDetails, this.props.system, this.props.makeState.selectedCompanyId);
        else this.props.updateMakeDetails(this.props.makeState.make as MakeDetails, this.props.system.session.token);
    }

    _onClickSave = () => {
        const { make } = this.props.makeState 
        if(make){
            let required = ['name']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(make[item] === '') {
                    this.props.setMakeValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    render = () => {
        const { modules } = this.props.system.session;
        const { make, validation, loading } = this.props.makeState;        

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
                        <RepnotesContentHeader moduleName="List Management" subModule="Make" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/make' })} >
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
                        {  make ? <Grid container>
                                    <Grid item xs={1}/>
                                    <Grid item xs={7}>
                                        <RepnotesInput
                                            id="repnotes-make-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            error={ !validation ? false : ( validation && make.name === '' ? true : false) }
                                            value={make.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._makeInput('name', e.target.value)
                                            }}
                                        />
                                        <RepnotesInput
                                            id="repnotes-make-status"
                                            type="select"
                                            label="Status"
                                            labelPosition="left"
                                            value={make.isActive}
                                            options={STATUS_ARRAY}
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                this._makeInput('isActive', (e.target.value === 'true') ? true : false)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}/>
                                </Grid>
                             :<LoadingDialog />
                        }
                    </Grid>
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    system: state.system,
    // alert: state.alert,
    makeState: state.makeState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setMakeState,
    saveMake,
    updateMakeDetails,
    setMakeValidationState,
    loadMakeDetails,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesMakeForm);