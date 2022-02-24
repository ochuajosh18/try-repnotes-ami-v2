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
    ProductFamilyDetails, 
    ProductFamilyState 
} from '../../../store/listManagement/productFamily/types';
import { 
    loadProductFamilyDetails, 
    saveProductFamily, 
    setProductFamilyState, 
    setProductFamilyValidationState, 
    updateProductFamilyDetails 
} from '../../../store/listManagement/productFamily/actions';
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

interface MatchParams {
    params:{ id: string}
} 

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface RepnotesProductFamilyFormProps {
    setRedirect: typeof setRedirect;
    saveProductFamily: typeof saveProductFamily;
    loadProductFamilyDetails: typeof loadProductFamilyDetails;
    setProductFamilyState: typeof setProductFamilyState;
    updateProductFamilyDetails: typeof updateProductFamilyDetails;
    setProductFamilyValidationState: typeof setProductFamilyValidationState;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    productFamilyState: ProductFamilyState;
    system: SystemState;
    // alert: AlertState;
    dialog: DialogState;
}

const EMPTY_PRODUCT_FAMILY = {
    companyId: '',
    isActive: true,
    name:  ''
} as ProductFamilyDetails;

const STATUS_ARRAY = [
    { id: 'true', name: 'Active'},
    { id: 'false', name: 'Inactive'}
];

class RepnotesProductFamilyForm extends Component<RepnotesProductFamilyFormProps & RouteParams> {
    componentDidMount = () => {
        if(this.props.match.params.id === 'new'){ this.props.setProductFamilyState({productFamily: {...EMPTY_PRODUCT_FAMILY, companyId: this.props.productFamilyState.selectedCompanyId} }) }
        else{ this.props.loadProductFamilyDetails(this.props.match.params.id, this.props.system.session.token, this.props.productFamilyState.selectedCompanyId) }
    }

    _productFamilyInput = (field: string, value: string | boolean) => {
        const { productFamily } = this.props.productFamilyState
        const newProductFamily = { ...productFamily, [field]: value };
        this.props.setProductFamilyState({productFamily: newProductFamily});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.productFamilyState.productFamily ? this.props.productFamilyState.productFamily.name : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveProductFamily();
    }

    _onSaveProductFamily = () => {
        if(this.props.match.params.id === 'new'){ this.props.saveProductFamily(this.props.productFamilyState.productFamily as ProductFamilyDetails, this.props.system, this.props.productFamilyState.selectedCompanyId) }
        else{ this.props.updateProductFamilyDetails(this.props.productFamilyState.productFamily as ProductFamilyDetails, this.props.system.session.token) }
    }

    _onClickSave = () => {
        const { productFamily } = this.props.productFamilyState 
        if(productFamily){
            let required = ['name']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(productFamily[item] === '') {
                    this.props.setProductFamilyValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    render = () => {
        const { modules } = this.props.system.session;
        const { productFamily, validation, loading } = this.props.productFamilyState;     

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
                        <RepnotesContentHeader moduleName="List Management" subModule="Product Family" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/product-family' })} >
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
                            productFamily ?
                                <Grid container>
                                    <Grid item xs={1}/>
                                    <Grid item xs={7}>
                                        <RepnotesInput
                                            id="repnotes-productFamily-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            error={ !validation ? false : ( validation && productFamily.name === '' ? true : false) }
                                            value={productFamily.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._productFamilyInput('name', e.target.value)
                                            }}
                                        />
                                        <RepnotesInput
                                            id="repnotes-productFamily-status"
                                            type="select"
                                            label="Status"
                                            labelPosition="left"
                                            value={productFamily.isActive}
                                            options={STATUS_ARRAY}
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                this._productFamilyInput('isActive', (e.target.value === 'true') ? true : false)
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
    productFamilyState: state.productFamilyState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setProductFamilyState,
    saveProductFamily,
    updateProductFamilyDetails,
    setProductFamilyValidationState,
    loadProductFamilyDetails,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesProductFamilyForm);