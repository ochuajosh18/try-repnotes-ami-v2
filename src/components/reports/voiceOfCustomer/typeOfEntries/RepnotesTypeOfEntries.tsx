import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { ListItem, SystemState } from '../../../../store/system/types';
import { AlertState } from '../../../../store/alert/types';
import { CustomerState } from '../../../../store/customerManagement/customer/types';
import { DialogState } from '../../../../store/dialog/types';
import { TypeOfEntriesState } from '../../../../store/report/voiceOfCustomer/typeOfEntries/types';
import { LocationState } from '../../../../store/customerManagement/location/types';
import { IndustryState } from '../../../../store/listManagement/industry/types';
import { CustomerTypeState } from '../../../../store/listManagement/customerType/types';
import { CompanyState } from '../../../../store/listManagement/company/types';
import { getCompany } from '../../../../store/listManagement/company/actions';
import { 
    getTypeOfEntries,
    setCustomerTypeFilter, 
    setDatePeriodFilter, 
    setIndustryFilter, 
    setProvinceFilter, 
    setSalesPersonDocIdFilter, 
    setTECompanyFilter,
} from '../../../../store/report/voiceOfCustomer/typeOfEntries/actions';
import { loadListManagementItems, setRedirect, resetReportsState } from '../../../../store/system/actions';
import { setCustomerState } from '../../../../store/customerManagement/customer/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../../common/RepnotesContentHeader';
import { LoadingDialog } from '../../../common/RepnotesAlerts';
import RepnotesTOEGraphicalBar from './RepnotesTypeOfEntriesBar';
import { RepnotesTypeOfEntriesFilter } from './RepnotesTypeOfEntriesFilter';
import { 
    RepnotesVOCCardCompetitionInfo, 
    RepnotesVOCCardCustomerExperience, 
    RepnotesVOCCardGeneralCommnets, 
    RepnotesVOCCardProductPerformance,
    RepnotesVOCCardProductQuality,
    RepnotesVOCCardUnmetNeed
} from '../RepnotesVOCCard';
import { RepnotesInput } from '../../../common/RepnotesInput';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// utils
import forEach from 'lodash/forEach';
import map from 'lodash/map';

// constants
const LIST_ITEMS: Array<ListItem> = ['Salesperson', 'Location', 'Industry', 'Customer Type'];

interface TypeOfEntriesProps {
    setCustomerState: typeof setCustomerState;
    resetReportsState: typeof resetReportsState;
    setRedirect: typeof setRedirect;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    setSalesPersonDocIdFilter: typeof setSalesPersonDocIdFilter;
    setProvinceFilter: typeof setProvinceFilter;
    setIndustryFilter: typeof setIndustryFilter;
    setCustomerTypeFilter: typeof setCustomerTypeFilter;
    setDatePeriodFilter: typeof setDatePeriodFilter;
    getTypeOfEntries: typeof getTypeOfEntries;
    getCompany: typeof getCompany;
    setTECompanyFilter: typeof setTECompanyFilter;
    loadListManagementItems: typeof loadListManagementItems;
    companyList: CompanyState;
    typeOfEntriesState: TypeOfEntriesState;
    customerState: CustomerState;
    locationState: LocationState;
    industryState: IndustryState;
    customerTypeState: CustomerTypeState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}

const DATE_PERIOD = [
    { id: 'YearToDate', name: 'Year To Date'},
    { id: 'Monthly', name: 'Monthly'}
];

class RepnotesTypeOfEntries extends Component<TypeOfEntriesProps> {

    componentDidMount = () => {
        this._validateRole();
        this.props.getCompany(this.props.system.session.token);
        this.props.setCustomerState({ salesPersonList: [] });
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    componentWillUnmount = () => this.props.resetReportsState();

    _validateRole = async() => {
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') await this.props.setTECompanyFilter({selectedCompanyId: this.props.system.session.userDetails.companyId as string});
        this._loadTable();
    } 

    _loadTable = () => {
        if(this.props.typeOfEntriesState.selectedCompanyId !== ''){
            this.props.getTypeOfEntries(this.props.system, this.props.typeOfEntriesState);
            this.props.loadListManagementItems(LIST_ITEMS, this.props.typeOfEntriesState.selectedCompanyId)
        }
    }

    _typeOfEntriesFilter = async(field: string, value: string ) => {
        if(field === 'datePeriod') await this.props.setDatePeriodFilter({datePeriod: value as string});
        if(field === 'salesPersonDocId') await this.props.setSalesPersonDocIdFilter({salesPersonDocId: value as string});
        if(field === 'province') await this.props.setProvinceFilter({province: value as string});
        if(field === 'industryId') await this.props.setIndustryFilter({industryId: value as string});
        if(field === 'customerTypeId') await this.props.setCustomerTypeFilter({customerTypeId: value as string});
        // call function
        this.props.getTypeOfEntries(this.props.system, this.props.typeOfEntriesState);
    }

    _companyFilter = async(value: string ) => {
        await this.props.setTECompanyFilter({selectedCompanyId: value as string});
        this._loadTable(); 
    }

    render = () => {
        const { selectedCompanyId, loading, datePeriod, salesPersonDocId, province, customerTypeId, industryId, typeOfEntriesInfo } = this.props.typeOfEntriesState;
        const { salesPersonList } = this.props.customerState;
        const { locationList } = this.props.locationState;
        const { customerTypeList } = this.props.customerTypeState;
        const { industryList } = this.props.industryState;
        const { userDetails } = this.props.system.session;
        const { companyArray } = this.props.companyList;
        
        let locationDataList: {  id: string; name: string; }[] = [];
        const role = (userDetails.role as string).toLowerCase();
        forEach(locationList, (area) => {
            forEach(area.province, (province) => {
                locationDataList.push({'id': province.name, 'name': province.name})
            })
        })

        return (
            <Box className="repnotes-content">
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Reports" subModule="Voice of Customer" secondSubModule="Type of Entries"/>
                    </Grid>
                </Grid>

                <Grid container style={{padding:'20px 5px'}} spacing={2} >
                    <Grid container spacing={1}>
                        {   userDetails.role === 'SUPER ADMIN' && 
                            <Grid item xs={2} style={{padding:"0 5px"}}>
                                <RepnotesInput
                                    id="repnotes-company-selection"
                                    type="select"
                                    label="Company Name"
                                    labelPosition="top"
                                    firstSelectOption={selectedCompanyId !== '' ? "removeall" : ''}
                                    value={selectedCompanyId}
                                    options={map(companyArray, (data) => ({
                                        id: data.companyId,
                                        name: data.name
                                    }))}
                                    onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                        this._companyFilter(e.target.value as string)
                                    }}
                                />
                            </Grid>
                        }
                        <Grid item xs={2} style={{padding:"0 5px"}}>
                            <RepnotesInput
                                id="repnotes-customer-status"
                                type="select"
                                label="Date Period"
                                labelPosition="top"
                                firstSelectOption="None"
                                value={datePeriod}
                                options={DATE_PERIOD}
                                onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                    this._typeOfEntriesFilter('datePeriod', e.target.value as string)
                                }}
                            />
                        </Grid>
                        {role !== 'sales engineer' &&
                            <Grid item xs={2} style={{padding:"0 5px"}}>
                                <RepnotesInput
                                   id="repnotes-salesperson-selection"
                                   type="searchabledropdown"
                                   label="Salesperson"
                                   labelPosition="top"
                                   value={salesPersonDocId}
                                   autocompleteOptions={map(salesPersonList, (f) => ({ label: f.name, value: f.id }))}
                                   onAutocompleteChange={(e, o) => {
                                       this._typeOfEntriesFilter('salesPersonDocId', o ? o.value : '');
                                   }}
                                   disableAutocompletePopover={true}
                                />
                            </Grid>
                        }
                        <Grid item xs={2} style={{ padding:"2px 70px 2px 2px" }}>
                            <RepnotesTypeOfEntriesFilter 
                                province={province}
                                typeOfEntriesFilter={this._typeOfEntriesFilter}
                                industryId={industryId}
                                customerTypeId={customerTypeId}
                                locationDataList={locationDataList}
                                industryList={industryList}
                                customerTypeList={customerTypeList} 
                            />
                        </Grid>
                        <Grid item xs={4} style={{padding:"0 5px"}} />
                    </Grid>
                </Grid>
                <Grid container >
                    <Typography variant= "h6" style={{ fontWeight: 550,  paddingBottom:"15px" }} >Summary Total</Typography>
                </Grid>
                { loading ? <LoadingDialog />
                    :<Grid item>
                        <Grid item container spacing={1}>
                            <Grid item xs={12} sm={2}>
                                <RepnotesVOCCardCompetitionInfo count={typeOfEntriesInfo.YearToDate.competitionInfo}/>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <RepnotesVOCCardCustomerExperience count={typeOfEntriesInfo.YearToDate.customerExperience} />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <RepnotesVOCCardGeneralCommnets count={typeOfEntriesInfo.YearToDate.generalComments}/>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <RepnotesVOCCardProductPerformance count={typeOfEntriesInfo.YearToDate.productPerformance}/>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <RepnotesVOCCardProductQuality count={typeOfEntriesInfo.YearToDate.productQuality}/>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <RepnotesVOCCardUnmetNeed count={typeOfEntriesInfo.YearToDate.unmetNeed}/>
                            </Grid>
                        </Grid>
                        <Grid container  style={{height:'300px'}}>
                            <RepnotesTOEGraphicalBar
                                data={typeOfEntriesInfo}
                                datePeriod={datePeriod}
                            />
                        </Grid>
                    </Grid>
                }
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    typeOfEntriesState: state.typeOfEntriesState,
    customerState: state.customerState,
    locationState: state.locationState,
    industryState: state.industryState,
    companyList: state.companyList,
    customerTypeState: state.customerTypeState,
    system: state.system,
    alert: state.alert,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setRedirect,
    clearDialog,
    setSalesPersonDocIdFilter,
    setProvinceFilter,
    setIndustryFilter,
    setCustomerTypeFilter,
    setDatePeriodFilter,
    getTypeOfEntries,
    getCompany,
    setTECompanyFilter,
    setDialogOpen,
    loadListManagementItems,
    resetReportsState,
    setCustomerState
})(RepnotesTypeOfEntries);