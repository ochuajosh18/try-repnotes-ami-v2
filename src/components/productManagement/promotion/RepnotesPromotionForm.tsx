import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, match } from 'react-router';
import { AppState } from '../../../store';
// import { AlertState } from '../../../store/alert/types';
import { DialogState } from '../../../store/dialog/types';
import { SystemState } from '../../../store/system/types';
import { ProductState } from '../../../store/productManagement/product/types';
import { 
    PromotionDetails, 
    PromotionState,
    Media
} from '../../../store/productManagement/promotion/types';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { setRedirect } from '../../../store/system/actions';
import { 
    deletePromotionImage, 
    deletePromotionVideo, 
    loadPromotionDetails, 
    savePromotion, 
    setEndDateFilter, 
    setPromotionState, 
    setPromotionValidationState, 
    setStartDateFilter, 
    updatePromotion
} from '../../../store/productManagement/promotion/actions';
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
import { RepnotesDateRange } from './RepnotesPromotionDateRange';
import { RepnotesCKEditor } from './RepnotesPromotionCKEditor';

// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

//ck-editor

// utils
import forEach from 'lodash/forEach';
import map from 'lodash/map'
import moment from 'moment'
import RepnotesMediaPreview from '../../common/RepnotesMediaPreview';
// const API_URL = process.env.REACT_APP_API_URL;

interface MatchParams {
    params: { id: string }
} 

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

interface RepnotesPromotionFormProps {
    getProductList: typeof getProductList;
    savePromotion: typeof savePromotion ;
    setPromotionState: typeof setPromotionState;
    updatePromotion: typeof updatePromotion;
    setPromotionValidationState: typeof setPromotionValidationState;
    loadPromotionDetails: typeof loadPromotionDetails;
    deletePromotionImage: typeof deletePromotionImage;
    deletePromotionVideo: typeof deletePromotionVideo;
    setStartDateFilter: typeof setStartDateFilter;
    setEndDateFilter: typeof setEndDateFilter;
    setRedirect: typeof setRedirect;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    system: SystemState;
    promotionState: PromotionState;
    productState: ProductState;
    // alert: AlertState;
    dialog: DialogState;
}

const STATUS_ARRAY = [
    { id: 'true', name: 'Active'},
    { id: 'false', name: 'Inactive'}
];

const EMPTY_PROMOTION= {
    companyId: '',
    name:  '',
    description: '',
    mechanics: '',
    price: '',
    startDate: moment().format('YYYY-MM-DD 00:00:01'),
    endDate: moment().format('YYYY-MM-DD 23:59:59'),
    product: [],
    image: [
        {
            name: '',
            path: '',
            size: 0,
            type: '',
        }
    ],
    video: [
        {
            name: '',
            path: '',
            size: 0,
            type: '',
        }
    ],
    isActive: true
} as PromotionDetails;

class RepnotesPromotionForm extends Component<RepnotesPromotionFormProps & RouteParams> {
    componentDidMount = () => {
        if(this.props.match.params.id === 'new'){ this.props.setPromotionState({ promotion: {...EMPTY_PROMOTION, companyId: this.props.promotionState.selectedCompanyId} }) }
        else{ this.props.loadPromotionDetails(this.props.match.params.id, this.props.system.session.token) }
        this._loadQuery()
    }

    _loadQuery = () =>{
        this.props.getProductList(this.props.system, this.props.promotionState.selectedCompanyId);
    }

    _onOpenDialog = () => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: this.props.promotionState.promotion ? this.props.promotionState.promotion.name : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onsavePromotion();
    }

    _onsavePromotion = () => {
        if(this.props.match.params.id === 'new'){ this.props.savePromotion(this.props.promotionState.promotion as PromotionDetails, this.props.system, this.props.promotionState.selectedCompanyId) }
        else{ this.props.updatePromotion(this.props.promotionState.promotion as PromotionDetails, this.props.system.session.token) }
    }

    _onClickSave = () => {
        const { promotion } = this.props.promotionState;
        if(promotion){
            let required = ['name', 'product', 'price']
            let requiredFieldCount = 0;
            forEach(required, (item, index) => {
                if(promotion[item] === '') {
                    this.props.setPromotionValidationState({validation: true});
                    requiredFieldCount++;
                }
            })
            if(requiredFieldCount === 0) this._onOpenDialog()
        }
    }

    _promotionDateRange = async(startDate: string, endDate: string ) => {
        await this.props.setStartDateFilter(this.props.promotionState.promotion as PromotionDetails, moment(startDate).format('YYYY-MM-DD HH:mm:ss.SSSZ') as string);
        await this.props.setEndDateFilter(this.props.promotionState.promotion as PromotionDetails, moment(endDate).format('YYYY-MM-DD HH:mm:ss.SSSZ') as string);
    }

    _promotionInput = (field: string, value: string | number | boolean | Array<string>) => {
        const { promotion } = this.props.promotionState;
        const newPromotion = { ...promotion, [field]: value };
        this.props.setPromotionState({ promotion: newPromotion });
    }

    _setPromotionMedia = (value: FileList | null, type: string) => {
        const { promotion } = this.props.promotionState;
        if (promotion && value) {
            let media: Array<Media> = [];
            for (const v of value) media = [...media, { path: '', name: (v as File).name, size: (v as File).size, type: (v as File).type, file: (v as File) }];
            this.props.setPromotionState({ promotion: { ...promotion, [type]: (media as unknown) as Media } as typeof promotion });
        }
    }

    _onDeleteImageClick = () => {
        const { promotion } = this.props.promotionState;
        this.props.deletePromotionImage(promotion);
    }

    _onDeleteVideoClick = () => {
        const { promotion } = this.props.promotionState;
        this.props.deletePromotionVideo(promotion);
    }

    render() {
        const { promotion, validation, loading } = this.props.promotionState;
        const { productList } = this.props.productState;
        const { modules } = this.props.system.session;

        let filteredProductList = productList.filter(item => item.isActive);
        
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
                    <Grid item xs={12} style={{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Product Management" subModule="Promotion" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/promotion' })} >
                        Cancel
                    </RepnotesDefaultButton>
                    {
                        (modules.promotion.edit || this.props.match.params.id === 'new' ) &&
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
                    promotion ?
                        <Grid container>
                            <Grid item xs={1}/>
                            <Grid item xs={7}>
                            <RepnotesInput
                                id="repnotes-promo-name"
                                type="text"
                                placeholder="Promo Name"
                                label="Promo Name"
                                labelPosition="left"
                                disabled={(!modules.promotion.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                error={ !validation ? false : ( validation && promotion.name === '' ? true : false) }
                                value={promotion.name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._promotionInput('name', e.target.value)
                                }}
                            />
                            <RepnotesCKEditor 
                                id="repnotes-promotion-description"
                                label="Description"
                                field="description"
                                disabled={(!modules.promotion.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                value={(this.props.match.params.id === 'new') ? "" : promotion.description}
                                onChange={this._promotionInput}
                            />
                            <RepnotesCKEditor 
                                id="repnotes-promotion-mechanics"
                                label="Mechanics"
                                field="mechanics"
                                disabled={(!modules.promotion.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                value={(this.props.match.params.id === 'new') ? "" : promotion.mechanics}
                                onChange={this._promotionInput}
                            />
                            <RepnotesDateRange
                                startDate={moment(promotion.startDate).format('YYYY-MM-DD')}
                                endDate={moment(promotion.endDate).format('YYYY-MM-DD')}
                                minDate={moment().format('YYYY-MM-DD')}
                                dateRange={this._promotionDateRange}
                                disabled={(!modules.promotion.edit && this.props.match.params.id !== 'new' ) ? true : false}
                            />
                            <RepnotesInput
                                id="repnotes-promotion-product"
                                type="searchabledropdown"
                                label="Product"
                                labelPosition="left"
                                multipleSelect={true}
                                autocompleteOptions={map(filteredProductList, (data) => ({
                                    value: `{"make":"${data.make}","productFamily":"${data.productFamily}","productId":"${data.id}"}`,
                                    label: data.modelName
                                }))}
                                onMultiselectAutocompleteChange={(e, o) => {
                                    this._promotionInput('product', o ? map(o, (p) => p.value) : '');
                                }}
                                disableAutocompletePopover={true}
                                value={promotion.product as string}
                                disabled={(!modules.promotion.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                error={ !validation ? false : ( validation && promotion.product === "" ? true : false) }
                            />
                            <RepnotesInput
                                id="repnotes-promotion-image"
                                type="file"
                                label="Image"
                                labelPosition="left"
                                uploadLabel="Upload Image"
                                fileAccepts="image/png, image/gif, image/jpeg, image/jpg"
                                uploadIcon={true}
                                disabled={(!modules.promotion.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                multiUpload={false}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._setPromotionMedia(e.target.files, 'image')
                                }}
                            />
                            { (promotion.image[0] && promotion.image[0].name) &&
                                <Grid container justify="center">
                                    <Grid item xs={4}></Grid>
                                    <Grid item xs={8}>
                                        <RepnotesMediaPreview
                                            mediaList={promotion ? (promotion.image as unknown) as Array<Media> : []}
                                            onDeleteClick={this._onDeleteImageClick}
                                            disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            type="image"
                                        />
                                        {/* <RepnotesMediaList
                                            cols={1}
                                            data={map (promotion.image, (data) => ({
                                                ...data,
                                                title: data.name,
                                                img: `${API_URL}${data.path}`
                                            }))}
                                            mediaType="image"
                                            onDeleteClick={this._onDeleteImageClick}
                                            disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                        /> */}
                                    </Grid>
                                </Grid>
                            }
                            <RepnotesInput
                                id="repnotes-promotion-video"
                                type="file"
                                label="Video"
                                labelPosition="left"
                                uploadLabel="Upload Video"
                                uploadIcon={true}
                                disabled={(!modules.promotion.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                multiUpload={false}
                                fileAccepts="video/mp4, video/m4v, video/mov"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._setPromotionMedia(e.target.files, 'video')
                                }}
                            />
                           { (promotion.video[0] && promotion.video[0].name) &&
                                <Grid container justify="center">
                                    <Grid item xs={4}></Grid>
                                    <Grid item xs={8}>
                                        <RepnotesMediaPreview
                                            mediaList={promotion ? (promotion.video as unknown) as Array<Media> : []}
                                            onDeleteClick={this._onDeleteImageClick}
                                            disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                            type="image"
                                        />
                                        {/* <RepnotesMediaList
                                            cols={1}
                                            data={map (promotion.video, (data) => ({
                                                ...data,
                                                title: data.name,
                                                img: `${API_URL}${data.path}`
                                            }))}
                                            mediaType="video"
                                            onDeleteClick={this._onDeleteVideoClick}
                                            disabled={(!modules.brochure.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                        /> */}
                                    </Grid>
                                </Grid>
                            }
                            <RepnotesInput
                                id="repnotes-promotion-price"
                                type="text"
                                placeholder="Price"
                                label="Price"
                                labelPosition="left"
                                disabled={(!modules.promotion.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                error={ !validation ? false : ( validation && promotion.price === '' ? true : false) }
                                value={promotion.price as string}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    this._promotionInput('price', (e.target.value !== '') ? e.target.value.replace(/[^0-9]/g, '') : '')
                                }}
                            />  
                            <RepnotesInput
                                id="repnotes-promotion-status"
                                type="select"
                                label="Status"
                                labelPosition="left"
                                disabled={(!modules.promotion.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                value={promotion.isActive}
                                options={STATUS_ARRAY}
                                onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                    this._promotionInput('isActive', (e.target.value === 'true') ? true : false)
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
    promotionState: state.promotionState,
    productState: state.productState,
    dialog: state.dialog
}) 

export default connect(mapStateToProps, {
    setPromotionState,
    loadPromotionDetails,
    updatePromotion,
    setPromotionValidationState,
    setStartDateFilter,
    setEndDateFilter,
    deletePromotionImage,
    deletePromotionVideo,
    savePromotion,
    getProductList,
    setRedirect,
    setDialogOpen,
    clearDialog
})(RepnotesPromotionForm);