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
    CustomerTypeDetails, 
    CustomerTypeState 
} from '../../../store/listManagement/customerType/types';
import { 
    setCustomerTypeState, 
    loadCustomerTypeDetails, 
    saveCustomerType, 
    updateCustomerTypeDetails, 
    setCustomerTypeValidationState 
} from '../../../store/listManagement/customerType/actions';
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

interface RepnotesCustomerTypeFormProps {
    setRedirect: typeof setRedirect;
    saveCustomerType: typeof saveCustomerType;
    loadCustomerTypeDetails: typeof loadCustomerTypeDetails;
    setCustomerTypeState: typeof setCustomerTypeState;
    updateCustomerTypeDetails: typeof updateCustomerTypeDetails;
    setCustomerTypeValidationState: typeof setCustomerTypeValidationState;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    customerTypeState: CustomerTypeState;
    system: SystemState;
    // alert: AlertState;
    dialog: DialogState
}

const EMPTY_CUSTOMER_TYPE = {
    companyId: '',
    isActive: true,
    name:  ''
} as CustomerTypeDetails;

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

class RepnotesCustomerTypeForm extends Component<RepnotesCustomerTypeFormProps & RouteParams> {
    
    componentDidMount = () => {
        if(this.props.match.params.id === 'new') this.props.setCustomerTypeState({customerType: {...EMPTY_CUSTOMER_TYPE, companyId: this.props.customerTypeState.selectedCompanyId} })
        else this.props.loadCustomerTypeDetails(this.props.match.params.id, this.props.system.session.token, this.props.customerTypeState.selectedCompanyId) 
    }

    _customerTypeInput = (field: string, value: string | boolean) => {
        const { customerType } = this.props.customerTypeState
        const newCustomerType = { ...customerType, [field]: value };
        this.props.setCustomerTypeState({customerType: newCustomerType});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.customerTypeState.customerType ? this.props.customerTypeState.customerType.name : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveUser();
    }
 
    _onSaveUser = () => {
        if(this.props.match.params.id === 'new') this.props.saveCustomerType(this.props.customerTypeState.customerType as CustomerTypeDetails, this.props.system, this.props.customerTypeState.selectedCompanyId)
        else this.props.updateCustomerTypeDetails(this.props.customerTypeState.customerType as CustomerTypeDetails, this.props.system.session.token)
    }

    _onClickSave = () => {
        const { customerType } = this.props.customerTypeState 
        if(customerType){
            let required = ['name']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(customerType[item] === '') {
                    this.props.setCustomerTypeValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    render = () => {
        const { modules } = this.props.system.session;
        const { customerType, validation, loading } = this.props.customerTypeState;

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
                        <RepnotesContentHeader moduleName = "List Management" subModule= "Customer Type" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/customer-type' })} >
                        Cancel
                    </RepnotesDefaultButton>
                    {
                        (modules.listManagement.edit || this.props.match.params.id === 'new') &&
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
                            customerType ?
                                <Grid container>
                                    <Grid item xs={1}/>
                                    <Grid item xs={7}>
                                        <RepnotesInput
                                            id="repnotes-customer-type-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            error={ !validation ? false : ( validation && customerType.name === '' ? true : false) }
                                            value={customerType.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._customerTypeInput('name', e.target.value)
                                            }}
                                        />
                                        <RepnotesInput
                                            id="repnotes-customer-type-status"
                                            type="select"
                                            label="Status"
                                            labelPosition="left"
                                            value={customerType.isActive}
                                            options={STATUS_ARRAY}
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                this._customerTypeInput('isActive', (e.target.value === 'true') ? true : false)
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
    alert: state.alert,
    customerTypeState: state.customerTypeState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setCustomerTypeState,
    saveCustomerType,
    updateCustomerTypeDetails,
    setCustomerTypeValidationState,
    loadCustomerTypeDetails,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesCustomerTypeForm);