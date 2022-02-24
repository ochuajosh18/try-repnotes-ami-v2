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
    LocationDetails, 
    LocationState 
} from '../../../store/customerManagement/location/types';
import { 
    setLocationState, 
    loadLocationDetails, 
    saveLocation, 
    updateLocationDetails, 
    setLocationValidationState, 
    setActiveProvince,
    setActiveCity,
    setActiveType,
    setAddress,
    setLocationValidationMessage
} from '../../../store/customerManagement/location/actions';
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
import { RepnotesLocationTable } from './RepnotesLocationTable';
// material
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
// utils
import forEach from 'lodash/forEach'

interface RepnotesLocationFormProps {
    setRedirect: typeof setRedirect;
    saveLocation: typeof saveLocation;
    loadLocationDetails: typeof loadLocationDetails;
    setLocationState: typeof setLocationState;
    updateLocationDetails: typeof updateLocationDetails;
    setLocationValidationState: typeof setLocationValidationState;
    setActiveProvince: typeof setActiveProvince;
    setActiveCity: typeof setActiveCity;
    setActiveType: typeof setActiveType;
    setAddress: typeof setAddress;
    setLocationValidationMessage: typeof setLocationValidationMessage;
    setDialogOpen: typeof setDialogOpen;
    clearDialog: typeof clearDialog;
    locationState: LocationState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState
}

const EMPTY_LOCATION = {
    companyId: '',
    isActive: true,
    area:  '',
    province: []
} as LocationDetails;

const STATUS_ARRAY = [
    { id: 'true', name: 'Active'},
    { id: 'false', name: 'Inactive'}
];

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const TABLE_COLUMNS = [
    { field: 'name', title: 'Name', cellStyle, headerStyle},
    { field: 'action', title: 'Actions', cellStyle, headerStyle}
];

interface MatchParams {
    params:{ id: string}
} 

interface RouteParams extends RouteComponentProps {
    match: match & MatchParams
}

class RepnotesLocationForm extends Component<RepnotesLocationFormProps & RouteParams> {
    componentDidMount = () => {
        if(this.props.match.params.id === 'new'){ this.props.setLocationState({location: {...EMPTY_LOCATION, province: []}}) }
        else{ this.props.loadLocationDetails(this.props.match.params.id, this.props.system.session.token) } 

        this.props.setActiveProvince({activeProvince: '' as string});
        this.props.setActiveType({activeType: '' as string});
        this.props.setActiveCity({activeCity: '' as string});
    }

    _locationInput = (field: string, value: string | boolean) => {
        const { location } = this.props.locationState
        const newLocation = { ...location, [field]: value };
        this.props.setLocationState({location: newLocation});
    }
  
    _onOpenDialog = () => {
        this.props.setDialogOpen({dialogOpen: true, dialogLabel: this.props.locationState.location ? this.props.locationState.location.area : '', dialogType: 'save', docId: '' })
    }

    _onCloseDialog = () => {
        this.props.clearDialog();
        this._onSaveLocation();
    }

    _onSaveLocation = () => {
        if(this.props.match.params.id === 'new'){ this.props.saveLocation(this.props.locationState.location as LocationDetails, this.props.system, this.props.locationState.selectedCompanyId) }
        else{ this.props.updateLocationDetails(this.props.locationState.location as LocationDetails, this.props.system.session.token) }
    }

    _onClickSave = () => {
        const { location } = this.props.locationState 
        if(location){
            let required = ['area'];
            let internal = 0
            forEach(required, (item) => {
                if(location[item] === '') this.props.setLocationValidationState({validation: true});
                if(location[item] !== '') internal++;
            })
            if(required.length === internal) this._onOpenDialog();
        }
    }

    _onAddressInput = (type: string, value: string) => {
        if(type === 'province'){
            this.props.setActiveProvince({activeProvince: value as string});
        }else{
            this.props.setActiveCity({activeCity: value as string});
        }
    }

    _onClickDeleteRow = (id: string | number, type: string) => {
        const { location, activeProvince } = this.props.locationState;
        if(type === 'province'){
            let provinceList = location?.province.filter(item => item.name !== id)
            const newLocation = { ...location, [type]: provinceList };
            this.props.setLocationState({location: newLocation});
        }else{
            forEach(location?.province, (item) => {
                if(item.name === activeProvince){
                    forEach(item.city, (city, i) => {
                        if(city === id){
                            item.city.splice(i, 1);
                        }
                    })
                }
            })
        }
    }

    _onClickSelectedRow = (id: string | number, type: string) => {
        const { activeProvince, activeCity } = this.props.locationState;
        if(type === 'province'){
            this.props.setActiveProvince({activeProvince: id as string});
            if(activeProvince !== id){
                this.props.setActiveType({activeType: '' as string});
                this.props.setAddress({address: '' as string});
            } 
        }else{
            this.props.setActiveCity({activeCity: id as string});
            if(activeCity !== id){
                this.props.setActiveType({activeType: '' as string});
                this.props.setAddress({address: '' as string});
            } 
        }
    }

    _onClickEditRow = (id: string | number, type: string) => {
        this.props.setActiveType({activeType: type as string});
        this.props.setAddress({address: id as string});
    }

    _onClickAddUpdate = ( type: string, saveType: string) => {
        const { location, activeProvince, activeCity, address } = this.props.locationState;
        if(type === 'province'){
            let validateExistingProvince = location?.province.some(item => item.name.toUpperCase() === activeProvince.toUpperCase());
            if(activeProvince === ''){
                this._validationMessage('Please input province!')
            }
            else if(!validateExistingProvince) {
                if(saveType === 'Add'){
                    let newProvince : { name: string, city:Array<string>} = { name: activeProvince, city: [] };
                    let provinceList = location?.province;
                    provinceList?.push(newProvince)
                    const newLocation = { ...location, [type]: provinceList };
                    this.props.setLocationState({location: newLocation});
                }else{
                    forEach(location?.province, (item) => {
                        if(item.name === address) item.name = activeProvince;
                    })
                }
                this.props.setActiveProvince({activeProvince: '' as string});
                this.props.setActiveType({activeType: '' as string});
            }else{
                this._validationMessage('Already exist')
            }
        }else{
            let validateExistingCity: boolean = true;
            forEach(location?.province, (item) => {
                if(item.name === activeProvince){
                    validateExistingCity = item.city.some(name => name.toUpperCase() === activeCity.toUpperCase());
                }
            })
            if(activeCity === ''){
                this._validationMessage('Please input city!');
            }else if(activeProvince === ''){
                this._validationMessage('Please select province first!');
            }else if(!validateExistingCity) {
                if(saveType === 'Add'){
                    forEach(location?.province, (item) => {
                        if(item.name === activeProvince){
                            item.city.push(activeCity)
                        }
                    })
                }else{
                    forEach(location?.province, (item) => {
                        if(item.name === activeProvince){
                            item.city = item.city.map(items => items === address ? activeCity : items)
                        }
                    })
                }
                this.props.setActiveCity({activeCity: '' as string});
                this.props.setActiveType({activeType: '' as string});
            }else{
                this._validationMessage('Already exist')
            }
        }
    }

    _validationMessage = (message: string) => {
        this.props.setLocationValidationMessage({validationMessage: message})
    }

    render = () => {
        const { modules } = this.props.system.session;
        const { location, validation, loading, activeProvince, activeCity, activeType } = this.props.locationState;
        let provinceList: { name: string; id: string; }[] =[];
        let cityList: { name: string; id: string; }[] =[];
        forEach(location?.province, (item) => {
            provinceList.push({'name': item.name, 'id': item.name});
            if(item.name === activeProvince){
                forEach(item.city, (city) => {
                    cityList.push({'name': city, 'id': city});
                })
            }
        })

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
                        <RepnotesContentHeader moduleName = "Customer Management" subModule= "Location" />
                    </Grid>
                </Grid>
                <Grid container justify="flex-end" style={{ padding: '10px 0', position: 'relative', right: -3 }}>
                    <RepnotesDefaultButton onClick={() => this.props.setRedirect({ shallRedirect: true, redirectTo: '/location' })} >
                        Cancel
                    </RepnotesDefaultButton>
                    {
                        (modules.location.edit || this.props.match.params.id === 'new' ) &&
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
                        { location ? (
                            <Grid container spacing={2}>

                                <Grid item xs={6} >
                                    <RepnotesInput
                                        id="repnotes-location-area"
                                        type="text"
                                        placeholder="area"
                                        label="Area"
                                        labelPosition="left"
                                        labelSize="small"
                                        fieldSize="small"
                                        disabled={(!modules.location.edit && this.props.match.params.id !== 'new' ) ? true : false}
                                        error={ !validation ? false : ( validation && location.area === '' ? true : false) }
                                        value={location.area}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            this._locationInput('area', e.target.value)
                                        }}
                                    />
                
                                    <Grid container item xs={12} >
                                        <Grid item xs={12} style={{ width: '100%' }} >
                                            {
                                                (modules.location.edit || this.props.match.params.id === 'new' ) &&
                                                <Box display="flex" width="100%" p={0} >
                                                    <Box p={0} width="100%">
                                                        <RepnotesInput
                                                            id="repnotes-Location-province"
                                                            type="text"
                                                            placeholder="Province"
                                                            label="Province"
                                                            value={activeProvince}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                this._onAddressInput('province', e.target.value);
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box p={0} style={{ paddingTop:'6px' }}>
                                                        <RepnotesPrimaryButton 
                                                            onClick={this._onClickAddUpdate.bind(this, 'province', activeType === 'province' ? 'Save' : 'Add')}
                                                            style={{marginRight:'0px'}}
                                                        >
                                                            {activeType === 'province' ? 'Save' : 'Add'}
                                                        </RepnotesPrimaryButton>
                                                    </Box>
                                                </Box>
                                            }
                                        </Grid>
                                    </Grid>
                                    <RepnotesLocationTable
                                        columns={TABLE_COLUMNS}
                                        type='province'
                                        data={provinceList}
                                        onClickDelete={this._onClickDeleteRow}
                                        onClickSelected={this._onClickSelectedRow}
                                        onClickEdit={this._onClickEditRow}
                                        disabled={modules.location.edit as boolean}
                                    />  
                                </Grid>

                                <Grid item xs={6} >
                                    <RepnotesInput
                                        id="repnotes-customer-status"
                                        type="select"
                                        label="Status"
                                        labelSize="small"
                                        fieldSize="small"
                                        labelPosition="left"
                                        value={true}
                                        options={STATUS_ARRAY}
                                        onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                            this._locationInput('isActive', (e.target.value === 'true') ? true : false)
                                        }}
                                    />
                                    <Grid container item xs={12}>
                                        <Grid item xs={12} style={{ width: '100%' }} >
                                            {
                                                (modules.location.edit || this.props.match.params.id === 'new' ) &&
                                                <Box display="flex" width="100%" p={0} >
                                                    <Box p={0} width="100%">
                                                        <RepnotesInput
                                                            id="repnotes-Location-city-town"
                                                            type="text"
                                                            placeholder="City/Town"
                                                            label="City/Town"
                                                            value={activeCity}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                this._onAddressInput('city', e.target.value);
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box p={0} style={{ paddingTop:'6px' }}>
                                                        <RepnotesPrimaryButton 
                                                            onClick={this._onClickAddUpdate.bind(this, 'city', activeType === 'city' ? 'Save' : 'Add')}
                                                            style={{marginRight:'0px'}}
                                                        >
                                                            {activeType === 'city' ? 'Save' : 'Add'}
                                                        </RepnotesPrimaryButton>
                                                    </Box>
                                                </Box>
                                            }
                                        </Grid>
                                    </Grid>
                                    <RepnotesLocationTable
                                        columns={TABLE_COLUMNS}
                                        type='city'
                                        data={cityList}
                                        onClickDelete={this._onClickDeleteRow}
                                        onClickSelected={this._onClickSelectedRow}
                                        onClickEdit={this._onClickEditRow}
                                        disabled={modules.location.edit as boolean}
                                    />  
                                </Grid>
                            </Grid> 
                        )
                        :<LoadingDialog /> }
                    </Grid>
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    system: state.system,
    // alert: state.alert,
    locationState: state.locationState,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setLocationState,
    saveLocation,
    updateLocationDetails,
    setLocationValidationState,
    loadLocationDetails,
    setActiveProvince,
    setActiveCity,
    setActiveType,
    setAddress,
    setLocationValidationMessage,
    setDialogOpen,
    clearDialog,
    setRedirect
})(RepnotesLocationForm);