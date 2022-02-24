import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
    RouteComponentProps, 
    match
} from 'react-router';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { DialogState } from '../../../store/dialog/types';
import { AlertState } from '../../../store/alert/types';
import { 
    CategoryDetails, 
    CategoryState 
} from '../../../store/listManagement/category/types';
import { 
    setCategoryState, 
    loadCategoryDetails, 
    saveCategory, 
    updateCategoryDetails, 
    setCategoryValidationState 
} from '../../../store/listManagement/category/actions';
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

interface RepnotesCategoryFormProps {
    setRedirect: typeof setRedirect;
    saveCategory: typeof saveCategory;
    loadCategoryDetails: typeof loadCategoryDetails;
    setCategoryState: typeof setCategoryState;
    updateCategoryDetails: typeof updateCategoryDetails;
    setCategoryValidationState: typeof setCategoryValidationState;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    categoryState: CategoryState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}

const EMPTY_CATEGORY = {
    companyId: '',
    isActive: true,
    name:  ''
} as CategoryDetails;

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

class RepnotesCategoryForm extends Component<RepnotesCategoryFormProps & RouteParams> {
    componentDidMount = () => {
        if(this.props.match.params.id === 'new'){ this.props.setCategoryState({category: {...EMPTY_CATEGORY, companyId: this.props.categoryState.selectedCompanyId} }) }
        else{ this.props.loadCategoryDetails(this.props.match.params.id, this.props.system.session.token, this.props.categoryState.selectedCompanyId) } 
    }

    _categoryInput = (field: string, value: string | boolean) => {
        const { category } = this.props.categoryState
        const newCategory = { ...category, [field]: value };
        this.props.setCategoryState({category: newCategory});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.categoryState.category ? this.props.categoryState.category.name : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveCategory();
    }

    _onSaveCategory = () => {
        if(this.props.match.params.id === 'new'){ this.props.saveCategory(this.props.categoryState.category as CategoryDetails, this.props.system, this.props.categoryState.selectedCompanyId) }
        else{ this.props.updateCategoryDetails(this.props.categoryState.category as CategoryDetails, this.props.system.session.token) }
    }

    _onClickSave = () => {
        const { category } = this.props.categoryState 
        if(category){
            let required = ['name'];
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(category[item] === '') {
                    this.props.setCategoryValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    render = () => {
        const { modules } = this.props.system.session;
        const { category, validation, loading } = this.props.categoryState;   

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
                        <RepnotesContentHeader moduleName = "List Management" subModule= "Category" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/category' })} >
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
                            category ?
                                <Grid container>
                                    <Grid item xs={1}/>
                                    <Grid item xs={7}>
                                        <RepnotesInput
                                            id="repnotes-category-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            error={ !validation ? false : ( validation && category.name === '' ? true : false) }
                                            value={category.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                this._categoryInput('name', e.target.value)
                                            }}
                                        />
                                        <RepnotesInput
                                            id="repnotes-category-status"
                                            type="select"
                                            label="Status"
                                            labelPosition="left"
                                            value={category.isActive}
                                            options={STATUS_ARRAY}
                                            disabled={(!modules.listManagement.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                this._categoryInput('isActive', (e.target.value === 'true') ? true : false)
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
    categoryState: state.categoryState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setCategoryState,
    saveCategory,
    updateCategoryDetails,
    setCategoryValidationState,
    loadCategoryDetails,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesCategoryForm);