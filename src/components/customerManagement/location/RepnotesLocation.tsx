import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { AlertState } from '../../../store/alert/types';
import { setRedirect } from '../../../store/system/actions';
import { LocationState } from '../../../store/customerManagement/location/types';
import { DialogState } from '../../../store/dialog/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { getCompany } from '../../../store/listManagement/company/actions';
import { superAdminCompanyValidation } from '../../../store/userManagement/user/actions';
import { 
    deleteLocation, 
    getLocationList,
    setLocationCompanyFilter,
    setLocationState
} from '../../../store/customerManagement/location/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { 
    LoadingDialog, 
    // RepnotesAlert, 
    RepnotesDialog 
} from '../../common/RepnotesAlerts';
import { RepnotesTable } from '../../common/RepnotesTable';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import map from 'lodash/map'
import forEach from 'lodash/forEach';
import moment from 'moment';

interface LocationProps {
    setLocationState: typeof setLocationState;
    setRedirect: typeof setRedirect;
    deleteLocation: typeof deleteLocation;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getLocationList: typeof getLocationList;
    getCompany: typeof getCompany;
    superAdminCompanyValidation: typeof superAdminCompanyValidation;
    setLocationCompanyFilter: typeof setLocationCompanyFilter;
    companyList: CompanyState;
    locationState: LocationState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const TABLE_COLUMNS = [
    { field: 'area', title: 'Area', cellStyle, headerStyle},
    { field: 'province', title: 'Province', cellStyle, headerStyle},
    { field: 'name', title: 'City', cellStyle, headerStyle},
    { field: 'action', title: 'Actions', cellStyle, headerStyle}
];

class RepnotesLocation extends Component<LocationProps> {

    componentDidMount = () => {
        const isFromCrud = this.props.system.redirectPage.redirectTo === '/location';
        this.props.setLocationState({ 
            selectedCompanyId: isFromCrud  ? this.props.locationState.selectedCompanyId : '', 
            locationList: [] 
        });
        this._validateRole(this.props.system.session.userDetails.role === 'SUPER ADMIN');
        this._loadOptions();
        if (isFromCrud) this._loadTable(this.props.locationState.selectedCompanyId)
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    _validateRole = (isAdmin: boolean) => {
        if(!isAdmin) {
            this.props.setLocationCompanyFilter({ selectedCompanyId: this.props.system.session.userDetails.companyId as string });
            this._loadTable();
        }
    } 

    _loadTable = (companyId?: string) => {
        if(this.props.locationState.selectedCompanyId || companyId) this.props.getLocationList(this.props.system, companyId ? companyId : this.props.locationState.selectedCompanyId);
    }

    _loadOptions = () =>{
        this.props.getCompany(this.props.system.session.token);
    }

    _onDialogOpen = (id: string | number, name: string | number) => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: name, dialogType: 'delete', docId: id })
    }

    _deleteLocation = () => {
        let city = (this.props.dialog.dialogLabel as string).split('-')[1]
        let province = (this.props.dialog.dialogLabel as string).split('-')[0]
        this.props.deleteLocation(this.props.dialog.docId, this.props.system.session.token, province, city);
        this.props.clearDialog();
        setTimeout(() => {
            this._loadTable();
        },500)
    }

    _companyFilter = async(value: string ) => {
        await this.props.setLocationCompanyFilter({selectedCompanyId: value as string});
        this._loadTable(); 
    }

    _companyValidation = () =>{
        this.props.superAdminCompanyValidation()
    }

    render = () => {
        const { locationList, loading, selectedCompanyId } = this.props.locationState;
        const { userDetails, modules } = this.props.system.session;
        const { companyArray } = this.props.companyList;

        let filteredCompanyList = companyArray.filter(item => item.isActive);

        let locationDataList: { area: string; province: string; city: string; id: string; dateCreated: string; dateUpdated: string; }[] = [];
        forEach(locationList, (area) => {
            if(area.province.length === 0) locationDataList.push({"area": area.area, "province": "","city": "", "id": area.id as string, "dateCreated": area.dateCreated as string, "dateUpdated": area.dateUpdated as string});
            forEach(area.province, (province) => {
                if(province.city.length === 0) locationDataList.push({"area": area.area, "province": province.name,"city": "", "id": area.id as string, "dateCreated": area.dateCreated as string, "dateUpdated": area.dateUpdated as string});
                forEach(province.city, (city) => {
                    locationDataList.push({"area": area.area, "province": province.name,"city": city, "id": area.id as string, "dateCreated": area.dateCreated as string, "dateUpdated": area.dateUpdated as string});
                })
            })
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
                    onClick={this._deleteLocation.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{textAlign: 'left', paddingTop: '10px 0px'}}>
                        <RepnotesContentHeader moduleName = "Customer Management" subModule= "Location" />
                    </Grid>
                </Grid>
                <Grid>
                     <Grid item xs={12}>
                        { loading ? <LoadingDialog />
                            : <RepnotesTable
                                link="location"
                                role={userDetails.role as string}
                                companyList={filteredCompanyList}
                                companyFilter={this._companyFilter}
                                companyValidation={this._companyValidation}
                                selectedCompany={selectedCompanyId}
                                columns={TABLE_COLUMNS}
                                data={map(locationDataList, (data: any) => ({
                                    ...data,
                                    name: data.city,
                                    dateCreated: data.dateCreated ? moment(data.dateCreated).format('MMMM D, YYYY') : '',
                                    dateUpdated: data.dateUpdated ? moment(data.dateUpdated).format('MMMM D, YYYY') : ''
                                }))}
                                onDialogOpen={this._onDialogOpen}
                                permission={modules.location}
                            />
                        }
                    </Grid>
                </Grid>
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    locationState: state.locationState,
    companyList: state.companyList,
    system: state.system,
    // alert: state.alert,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setRedirect,
    clearDialog,
    setDialogOpen,
    deleteLocation,
    getCompany,
    setLocationCompanyFilter,
    superAdminCompanyValidation,
    getLocationList,
    setLocationState
})(RepnotesLocation);
