import React from 'react';
import { 
    OptionalMachineFeature,
    StandardMachineFeature, 
    SubFeature,
    Media
} from '../../../store/productManagement/product/types';
import {
    RepnotesDefaultButton, 
    RepnotesPrimaryButton 
} from '../../common/RepnotesButton';
import { RepnotesInput } from '../../common/RepnotesInput';
import { RepnotesFeatureTable } from './RepnotesFeatureTable';
import RepnotesMediaPreview from '../../common/RepnotesMediaPreview';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TransitionProps } from '@material-ui/core/transitions';
import { 
    ThemeProvider, 
    unstable_createMuiStrictModeTheme 
} from '@material-ui/core/styles';
import map from 'lodash/map';

interface RepnotesFeatureFormProps {
    open: boolean;
    label: string | number;
    name?: string;
    media: Array<Media>;
    hasMedia?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteMediaClick: () => void;
    onClear: () => void;
    onAlertOpen: (msg: string, type: string) => void;
    onSubfeatureInput: (field: string, value: string | number | Array<SubFeature> | Array<string> | any, type: string) => void;
    onSaveFeature: (type: string) => void;
    standardMachineFeature: StandardMachineFeature;
    optionalMachineFeature: OptionalMachineFeature;
    disabled?: boolean;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const STANDARD_TABLE_COLUMNS = [
    { field: 'name', title: 'Name', cellStyle, headerStyle},
    { field: 'action', title: 'Action', cellStyle, headerStyle}
];

const OPTIONAL_TABLE_COLUMNS = [
    { field: 'name', title: 'Name', cellStyle, headerStyle},
    { field: 'price', title: 'Price', cellStyle, headerStyle},
    { field: 'action', title: 'Action', cellStyle, headerStyle}
];

const theme = unstable_createMuiStrictModeTheme();

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
){
    return <Slide direction="up" ref={ref} {...props} />;
});

export const RepnotesFeatureForm = (props: RepnotesFeatureFormProps) => {

    const { open, name, media, hasMedia, label, onClear, onChange, onFileChange, onDeleteMediaClick, onAlertOpen, onSubfeatureInput, standardMachineFeature, optionalMachineFeature, onSaveFeature, disabled } = props
    const standardFeatureArr = standardMachineFeature.subFeature;
    const optionalFeatureArr = optionalMachineFeature.subFeature;
    const [featureName, setFeatureName] = React.useState('');
    const [featurePrice, setFeaturePrice] = React.useState('');
    const [validName, setValidName] = React.useState(true);
    const [validPrice, setValidPrice] = React.useState(true);
    const [activeId, setActiveId] = React.useState('');
    const [editEnabled, setEditEnabled] = React.useState(false);
    const [validation, setValidation] = React.useState(false);

    const _onSave = () => {
        featureName === '' ? setValidName(false) : setValidName(true)
        if(label !== 'standard') featurePrice === '' ? setValidPrice(false) : setValidPrice(true);
        if(featureName !== '' && (label === 'standard') ? true : featurePrice !== ''){
            if(!(standardFeatureArr.includes(featureName)) && ((label === 'standard') ? true : !(optionalFeatureArr.filter((e: any) => e.name === featureName).length > 0))){
                if(editEnabled){
                    if(label === 'standard') {
                        let index = standardFeatureArr.map(feature => {return feature}).indexOf(activeId);
                        standardFeatureArr[index] = featureName;
                        onSubfeatureInput('subFeature', standardFeatureArr, 'standardMachineFeature' )
                    }
                    else {
                        let index = optionalFeatureArr.map(feature => {return feature.name}).indexOf(activeId);
                        optionalFeatureArr[index] = {name: featureName, price: parseInt(featurePrice)};
                        onSubfeatureInput('subFeature', optionalFeatureArr, 'optionalMachineFeature' )
                    }
                }else{
                    if(label === 'standard') {
                        standardFeatureArr?.push(featureName)
                        onSubfeatureInput('subFeature', standardFeatureArr, 'standardMachineFeature' )
                    }
                    else {
                        optionalFeatureArr?.push({name: featureName, price: parseInt(featurePrice)})
                        onSubfeatureInput('subFeature', optionalFeatureArr, 'optionalMachineFeature' )
                    }
                }
                setFeatureName('')
                setFeaturePrice('')
                setEditEnabled(false)
            }else {
                onAlertOpen("Data Already Exist", 'error')
            }
        }else {
            onAlertOpen("Please Check Required Field", 'error')
        }
    }

    const _onSaveFeature = () => {
        if(name === ''){
            setValidation(true)
            onAlertOpen("Please Check Required Field", 'error')
        }else{
            if(label === 'standard') {
                if(standardFeatureArr.length === 0){
                    onAlertOpen("Please Add at Least 1 Sub-feature", 'warning')
                }else {
                    onSaveFeature('standard') 
                }
            }
            else {
                if(optionalFeatureArr.length === 0){
                    onAlertOpen("Please Add at Least 1 Sub-feature", 'warning')
                }else {
                    onSaveFeature('optional') 
                }
            }
        }
    }

    const _onClickEdit = (id: string, type: string) => {
        setEditEnabled(true);
        if (label === 'standard') { 
            let index = standardFeatureArr.map(feature => {return feature}).indexOf(id);
            setFeatureName(standardFeatureArr[index])
            setActiveId(standardFeatureArr[index])
        }
        else { 
            let index = optionalFeatureArr.map(feature => {return feature.name}).indexOf(id);
            setFeatureName(optionalFeatureArr[index].name);
            setFeaturePrice(optionalFeatureArr[index].price as string);
            setActiveId(optionalFeatureArr[index].name);
        }
    }

    const _onClickDelete = (id: string, type: string) => {
        if (label === 'standard') { 
            let index = standardFeatureArr.map(feature => {return feature}).indexOf(id);
            standardFeatureArr.splice(index, 1);
            onSubfeatureInput('subFeature', standardFeatureArr, 'standardMachineFeature' )
        }
        else { 
            let index = optionalFeatureArr.map(feature => {return feature.name}).indexOf(id);
            optionalFeatureArr.splice(index, 1);
            onSubfeatureInput('subFeature', optionalFeatureArr, 'optionalMachineFeature' )
        }
    }

    const _onHandleClose = () => {
        onClear()
        setFeatureName('')
        setFeaturePrice('')
        setEditEnabled(false)
    }

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth={true}
                    maxWidth="md"
                    onClose={_onHandleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    style={{ visibility: open ? 'visible' : 'hidden' }} 
                >
                    <DialogContent style={{ padding: '5px' }}>
                        <DialogTitle id="alert-dialog-slide-title" style={{ borderBottom: '1px solid #f4f4f4' }}>
                            <h6 style={{ margin: 0, lineHeight: '25px', fontSize: '16px', color: '#272B75' }}>{(label === 'standard') ? 'Standard Machine Feature' : 'Optional Machine Feature'}</h6>
                            </DialogTitle>
                        <DialogContent>
                            <Grid container justify="center" spacing={1}>
                                <Grid container item xs={12} style={{ paddingTop: 20, paddingBottom: 20 }}>
                                    <Grid item xs={6}>
                                        <RepnotesInput
                                            id="repnotes-product-feature-name"
                                            type="text"
                                            placeholder="Name"
                                            label="Name"
                                            labelPosition="left"
                                            disabled={disabled}
                                            error={ (validation && name === '') ? true : false }
                                            value={name}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                    <RepnotesInput
                                        id="repnotes-feature-image"
                                        type="file"
                                        label="image"
                                        labelPosition="left"
                                        multiUpload={true}
                                        uploadIcon={true}
                                        disabled={disabled}
                                        uploadLabel="Upload Image"
                                        onChange={onFileChange}
                                        fileAccepts="image/png, image/gif, image/jpeg, image/jpg"
                                    />
                                    { (media.length === 1 && hasMedia) &&
                                        <Grid container justify="center">
                                            <Grid item xs={4}></Grid>
                                            <Grid item xs={8}>
                                                <RepnotesMediaPreview
                                                    mediaList={media}
                                                    onDeleteClick={onDeleteMediaClick}
                                                    disabled={disabled}
                                                    type="image"
                                                />
                                                {/* <RepnotesMediaList
                                                    cols={1}
                                                    data={media}
                                                    mediaType="image"
                                                    onDeleteClick={onDeleteMediaClick}
                                                    disabled={disabled}
                                                /> */}
                                            </Grid>
                                        </Grid>
                                    }
                                    </Grid>
                                    <Grid container item xs={12}>
                                        <Typography style={{ marginTop: 20, fontSize: 12, fontWeight: 600, color: '#272B75' }}>Sub-Features</Typography>
                                        {
                                            !disabled && 
                                            <Grid item xs={12} style={{ width: '100%' }} >
                                                <Box display="flex" width="100%" p={0} >
                                                    <Box p={0} width="100%">
                                                        <RepnotesInput
                                                            id="repnotes-feature-name"
                                                            type="text"
                                                            placeholder="Name"
                                                            label="Name"
                                                            value={featureName}
                                                            disabled={disabled}
                                                            error={(featureName === '' && !validName) ? true : false}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                setFeatureName(e.target.value)
                                                                featureName === '' ? setValidName(false) : setValidName(true)
                                                            }}
                                                        />
                                                    </Box>
                                                    { (label === 'optional') && 
                                                        <Box p={0} width="50%" style={{ marginLeft: 10 }}>
                                                            <RepnotesInput
                                                                id="repnotes-feature-price"
                                                                type="text"
                                                                placeholder="Price"
                                                                label="Price"
                                                                value={featurePrice}
                                                                disabled={disabled}
                                                                error={(featurePrice === '' && !validPrice) ? true : false}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    setFeaturePrice(e.target.value.replace(/[^0-9]/g, ''))
                                                                    featurePrice === '' ? setValidPrice(false) : setValidPrice(true);
                                                                }}
                                                            />
                                                        </Box>
                                                    }
                                                    <Box p={0} style={{ paddingTop:'6px' }}>
                                                        <RepnotesPrimaryButton
                                                            onClick={_onSave}
                                                            // onClick={this._onClickAddUpdate.bind(this, 'province', activeType === 'province' ? 'Save' : 'Add')}
                                                            style={{marginRight:'0px'}}
                                                        >
                                                            {editEnabled ? 'Save' : 'Add'}
                                                        </RepnotesPrimaryButton>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        }
                                        <Grid item xs={12}>
                                            <RepnotesFeatureTable
                                                columns={(label === 'standard') ? STANDARD_TABLE_COLUMNS : OPTIONAL_TABLE_COLUMNS}
                                                data={(label === 'standard') ? map(standardMachineFeature.subFeature, name => ({ name: name })) : map(optionalMachineFeature.subFeature, (data: any) => ({ ...data }))}
                                                type='standard'
                                                onClickDelete={_onClickDelete}
                                                onClickEdit={_onClickEdit}
                                                disabled={disabled}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Box>
                                <RepnotesDefaultButton onClick={_onHandleClose}>
                                    Cancel
                                </RepnotesDefaultButton>
                                {
                                    !disabled && 
                                    <RepnotesPrimaryButton onClick={_onSaveFeature}>
                                        Save
                                    </RepnotesPrimaryButton>
                                }
                            </Box>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </React.StrictMode>
    )
}
