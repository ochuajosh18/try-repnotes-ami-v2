import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
// import { AlertState } from '../../../store/alert/types';
import { DialogState } from '../../../store/dialog/types';
import { SystemState } from '../../../store/system/types';
import { ProductFamilyState } from '../../../store/listManagement/productFamily/types';
import { ProductState } from '../../../store/productManagement/product/types';
import { 
    BrochureDetails, 
    BrochureState,
    Media
} from '../../../store/productManagement/brochure/types';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { setRedirect } from '../../../store/system/actions';
import { 
    deleteBrochureMedia,
    loadBrochureDetails, 
    saveBrochure, 
    setBrochureState, 
    setBrochureValidationState, 
    updateBrochure
} from '../../../store/productManagement/brochure/actions';
import { getProductFamilyList } from '../../../store/listManagement/productFamily/actions';
import { getProductList } from '../../../store/productManagement/product/actions';
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import {
    RepnotesInput 
} from '../../common/RepnotesInput';
import { 
    RepnotesDefaultButton,
    RepnotesPrimaryButton
} from '../../common/RepnotesButton';
import { 
    LoadingDialog,
    // RepnotesAlert, 
    RepnotesDialog 
} from '../../common/RepnotesAlerts';
// import { RepnotesMediaList } from '../../common/RepnotesMediaList';

// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

// utils
import forEach from 'lodash/forEach';
import map from 'lodash/map'
// import without from 'lodash/without'
// import includes from 'lodash/includes';
import RepnotesMediaPreview from '../../common/RepnotesMediaPreview';
// const API_URL = process.env.REACT_APP_API_URL;

interface MatchParams {
    params: { id: string }
} 

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface RepnotesBrochureFormProps {
    saveBrochure: typeof saveBrochure ;
    setBrochureState: typeof setBrochureState;
    updateBrochure: typeof updateBrochure;
    setBrochureValidationState: typeof setBrochureValidationState;
    loadBrochureDetails: typeof loadBrochureDetails;
    deleteBrochureMedia: typeof deleteBrochureMedia;
    getProductFamilyList: typeof getProductFamilyList;
    getProductList: typeof getProductList;
    setDialogOpen: typeof setDialogOpen;
    setRedirect: typeof setRedirect;
    clearDialog: typeof clearDialog;
    system: SystemState;
    brochureState: BrochureState;
    productFamilyState: ProductFamilyState;
    productState: ProductState;
    // alert: AlertState;
    dialog: DialogState;
}

const STATUS_ARRAY = [
    { id: 'true', name: 'Active'},
    { id: 'false', name: 'Inactive'}
];

const EMPTY_BROCHURE = {
    companyId: '',
    title:  '',
    productFamilyId: '',
    product: [],
    media: {
        name: '',
        path: '',
        size: 0,
        type: '',
    },
    isActive: true
} as BrochureDetails;

class RepnotesBrochureForm extends Component<RepnotesBrochureFormProps & RouteParams> {
    componentDidMount = () => {
        if(this.props.match.params.id === 'new'){ this.props.setBrochureState({ brochure: {...EMPTY_BROCHURE, companyId: this.props.brochureState.selectedCompanyId} }) }
        else{ this.props.loadBrochureDetails(this.props.match.params.id, this.props.system.session.token) }
        this._loadQuery()
    }

    _loadQuery = () =>{
        this.props.getProductFamilyList(this.props.system, this.props.brochureState.selectedCompanyId);
        this.props.getProductList(this.props.system, this.props.brochureState.selectedCompanyId);
    }

    _onOpenDialog = () => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: this.props.brochureState.brochure ? this.props.brochureState.brochure.title : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onsaveBrochure();
    }

    _onsaveBrochure = () => {
        if(this.props.match.params.id === 'new'){ this.props.saveBrochure(this.props.brochureState.brochure as BrochureDetails, this.props.system, this.props.brochureState.selectedCompanyId) }
        else{ this.props.updateBrochure(this.props.brochureState.brochure as BrochureDetails, this.props.system.session.token) }
    }

    _onClickSave = () => {
        const { brochure } = this.props.brochureState;
        if(brochure){
            let required = ['title', 'product', 'productFamilyId']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(brochure[item] === '') {
                    this.props.setBrochureValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    _brochureInput = (field: string, value: string | boolean | Array<string>) => {
        const { brochure } = this.props.brochureState;
        const newBrochure = { ...brochure, [field]: value };
        this.props.setBrochureState({ brochure: newBrochure });
    }

    _setBrochureMedia = (value: FileList | null) => {
        const { brochure } = this.props.brochureState;
        if (brochure && value) {
            let media: Array<Media> = [];
            for (const v of value) media = [...media, { path: '', name: (v as File).name, size: (v as File).size, type: (v as File).type, file: (v as File) }];
            this.props.setBrochureState({ brochure: { ...brochure, media: (media as unknown) as Media } as typeof brochure });
        }
    }

    _onDeleteMediaClick = () => {
        const { brochure } = this.props.brochureState;
        this.props.deleteBrochureMedia(brochure);
    }

    render() {
        const { modules } = this.props.system.session;
        const { brochure, validation, loading } = this.props.brochureState;
        const { productFamilyList } = this.props.productFamilyState;
        const { productList } = this.props.productState;

        let filteredProductList = productList.filter(item => item.isActive);

        let filteredProductFamList = productFamilyList.filter(item => item.isActive);

        return(
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
                        <RepnotesContentHeader moduleName = "Product Management" subModule= "Brochure" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/brochure' })} >
                        Cancel
                    </RepnotesDefaultButton>
                    {
                        (modules.brochure.edit || this.props.match.params.id === 'new' ) &&
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
                <Grid className="repnotes-form" container justify="center" spacing={1}>
                { 
                    brochure ?
                        <Grid container>
                            <Grid item xs={1}/>
                            <Grid item xs={7}>
                            <RepnotesInput
                                id="repnotes-brochure-title"
                                type="text"
                                placeholder="Title"
                                label="Title"
                                labelPosition="left"
                                disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                error={ !validation ? false : ( validation && brochure.title === '' ? true : false) }
                                value={brochure.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._brochureInput('title', e.target.value)
                                }}
                            />
                            <RepnotesInput
                                id="repnotes-brochure-product-family"
                                type="searchabledropdown"
                                label="Product Family"
                                labelPosition="left"
                                value={brochure.productFamilyId}
                                autocompleteOptions={map(filteredProductFamList, (f) => ({ label: f.name, value: f.id }))}
                                onAutocompleteChange={(e, o) => {
                                    this._brochureInput('productFamilyId', o ? o.value : '');
                                }}
                                disableAutocompletePopover={true}
                                disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                error={ !validation ? false : ( validation && brochure.productFamilyId === '' ? true : false) }
                            />
                             <RepnotesInput
                                id="repnotes-brochure-product"
                                type="searchabledropdown"
                                label="Product"
                                labelPosition="left"
                                multipleSelect={true}
                                value={brochure.product}
                                autocompleteOptions={map(filteredProductList, (f) => ({ label: f.modelName, value: f.id }))}
                                onMultiselectAutocompleteChange={(e, o) => {
                                    this._brochureInput('product', o ? map(o, (p) => p.value) : '');
                                }}
                                disableAutocompletePopover={true}
                                disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                error={ !validation ? false : ( validation && brochure.product.length === 0 ? true : false) }
                                onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                    this._brochureInput('product', e.target.value as string)
                                }}
                            />
                            <RepnotesInput
                                id="repnotes-brochure-media"
                                type="file"
                                label="Media"
                                labelPosition="left"
                                uploadLabel="Upload Media"
                                fileAccepts="application/pdf, image/png, image/gif, image/jpeg"
                                uploadIcon={true}
                                multiUpload={false}
                                disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._setBrochureMedia(e.target.files)
                                }}
                            />
                            { (brochure.media.name !== '') &&
                                <Grid container justify="center">
                                    <Grid item xs={4}></Grid>
                                    <Grid item xs={8}>   
                                        <RepnotesMediaPreview
                                            mediaList={brochure ? (brochure.media as unknown) as Array<Media> : []}
                                            onDeleteClick={this._onDeleteMediaClick}
                                            disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            type="image"
                                        />
                                        {/* <RepnotesMediaList
                                            cols={1}
                                            data={map (filteredMedia, (data) => ({
                                                ...data,
                                                title: data.name,
                                                img: includes(data.type, 'pdf') ? `${API_URL}media/uploads/brochure/pdf.png` : `${API_URL}${data.path}`
                                            }))}
                                            mediaType="image"
                                            onDeleteClick={this._onDeleteMediaClick}
                                            disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                        /> */}
                                    </Grid>
                                </Grid>
                            }
                            <RepnotesInput
                                id="repnotes-brochure-status"
                                type="select"
                                label="Status"
                                labelPosition="left"
                                disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                value={brochure.isActive}
                                options={STATUS_ARRAY}
                                onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                    this._brochureInput('isActive', (e.target.value === 'true') ? true : false)
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
    brochureState: state.brochureState,
    productFamilyState: state.productFamilyState,
    productState: state.productState,
    dialog: state.dialog
}) 

export default connect(mapStateToProps, {
    setBrochureState,
    loadBrochureDetails,
    updateBrochure,
    setBrochureValidationState,
    deleteBrochureMedia,
    saveBrochure,
    getProductFamilyList,
    getProductList,
    setRedirect,
    setDialogOpen,
    clearDialog
})(RepnotesBrochureForm);