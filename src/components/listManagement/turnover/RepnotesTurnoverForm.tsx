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
    TurnoverDetails, 
    TurnoverState 
} from '../../../store/listManagement/turnover/types';
import { 
    setTurnoverState, 
    loadTurnoverDetails, 
    saveTurnover, 
    updateTurnoverDetails, 
    setTurnoverValidationState 
} from '../../../store/listManagement/turnover/actions';
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

interface RepnotesTurnoverFormProps {
    setRedirect: typeof setRedirect;
    saveTurnover: typeof saveTurnover;
    loadTurnoverDetails: typeof loadTurnoverDetails;
    setTurnoverState: typeof setTurnoverState;
    updateTurnoverDetails: typeof updateTurnoverDetails;
    setTurnoverValidationState: typeof setTurnoverValidationState;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    turnoverState: TurnoverState;
    system: SystemState;
    // alert: AlertState;
    dialog: DialogState;
}

const EMPTY_TURNOVER = {
    companyId: '',
    isActive: true,
    name:  ''
} as TurnoverDetails;

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

class RepnotesTurnoverForm extends Component<RepnotesTurnoverFormProps & RouteParams> {
    componentDidMount = () => {
        if(this.props.match.params.id === 'new') this.props.setTurnoverState({turnover: {...EMPTY_TURNOVER, companyId: this.props.turnoverState.selectedCompanyId } });
        else this.props.loadTurnoverDetails(this.props.match.params.id, this.props.system.session.token, this.props.turnoverState.selectedCompanyId);
    }

    _turnoverInput = (field: string, value: string | boolean) => {
        const { turnover } = this.props.turnoverState
        const newTurnover = { ...turnover, [field]: value };
        this.props.setTurnoverState({turnover: newTurnover});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.turnoverState.turnover ? this.props.turnoverState.turnover.name : '', dialogType: 'save', docId: '' });
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveTurnover();
    }

    _onSaveTurnover = () => {
        if(this.props.match.params.id === 'new') this.props.saveTurnover(this.props.turnoverState.turnover as TurnoverDetails, this.props.system, this.props.turnoverState.selectedCompanyId);
        else this.props.updateTurnoverDetails(this.props.turnoverState.turnover as TurnoverDetails, this.props.system.session.token);
    }

    _onClickSave = () => {
        const { turnover } = this.props.turnoverState 
        if(turnover){
            let required = ['name']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(turnover[item] === '') {
                    this.props.setTurnoverValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    render = () => {
        const { modules } = this.props.system.session;
        const { turnover, validation, loading } = this.props.turnoverState;   

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
                        <RepnotesContentHeader moduleName="List Management" subModule="Turnover" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/turnover' })} >
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
                            turnover ?
                                <Grid container>
                                    <Grid item xs={1}/>
                                    <Grid item xs={7}>
                                        <RepnotesInput
                                            id="repnotes-turnover-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            error={ !validation ? false : ( validation && turnover.name === '' ? true : false) }
                                            value={turnover.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._turnoverInput('name', e.target.value)
                                            }}
                                        />
                                        <RepnotesInput
                                            id="repnotes-turnover-status"
                                            type="select"
                                            label="Status"
                                            labelPosition="left"
                                            value={turnover.isActive}
                                            options={STATUS_ARRAY}
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                this._turnoverInput('isActive', (e.target.value === 'true') ? true : false)
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
    turnoverState: state.turnoverState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setTurnoverState,
    saveTurnover,
    updateTurnoverDetails,
    setTurnoverValidationState,
    loadTurnoverDetails,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesTurnoverForm);