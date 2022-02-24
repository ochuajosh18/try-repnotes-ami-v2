import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { ListItem, SystemState } from '../../../../store/system/types';
import { AlertState } from '../../../../store/alert/types';
import { CustomerState } from '../../../../store/customerManagement/customer/types';
import { DialogState } from '../../../../store/dialog/types';
import { CompetitionState, DynamicCompetitionInformationType } from '../../../../store/report/voiceOfCustomer/competitionInfo/types';
import { LocationState } from '../../../../store/customerManagement/location/types';
import { IndustryState } from '../../../../store/listManagement/industry/types';
import { CustomerTypeState } from '../../../../store/listManagement/customerType/types';
import { CompanyState } from '../../../../store/listManagement/company/types';
import { getCompany } from '../../../../store/listManagement/company/actions';
import { 
    getCompetitionInfo, 
    setCompetitionInformationState,
    exportCompetitionInformation,
    resetFilter
} from '../../../../store/report/voiceOfCustomer/competitionInfo/actions';
import { loadListManagementItems, setRedirect, resetReportsState } from '../../../../store/system/actions';
import { setCustomerState } from '../../../../store/customerManagement/customer/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../../common/RepnotesContentHeader';
import {  LoadingDialog } from '../../../common/RepnotesAlerts';
import RepnotesGraphicalBar from './RepnotesCompetitionBar';
import { RepnotesCompetitionFilter } from './RepnotesCompetitionFilter';
import { 
    RepnotesVOCCardActivities, 
    RepnotesVOCCardCommercial, 
    RepnotesVOCCardPricing 
} from '../RepnotesVOCCard';
import { RepnotesInput } from '../../../common/RepnotesInput';
import { RepnotesPrimaryButton } from '../../../common/RepnotesButton';
import CompetitionInformationReport from './fragments/CompetitionInformationReport';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// utils
import forEach from 'lodash/forEach';
import map from 'lodash/map';

import Export from '../../../../assets/images/export.png';

// constants
const LIST_ITEMS: Array<ListItem> = ['Salesperson', 'Location', 'Industry', 'Customer Type', 'Customer'];

interface CategoryProps {
    exportCompetitionInformation: typeof exportCompetitionInformation;
    setCustomerState: typeof setCustomerState;
    resetReportsState: typeof resetReportsState;
    getCompetitionInfo: typeof getCompetitionInfo;
    setRedirect: typeof setRedirect;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    resetFilter: typeof resetFilter;
    getCompany: typeof getCompany;
    loadListManagementItems: typeof loadListManagementItems;
    setCompetitionInformationState: typeof setCompetitionInformationState;
    companyList: CompanyState;
    competitionState: CompetitionState;
    customerState: CustomerState;
    locationState: LocationState;
    industryState: IndustryState;
    customerTypeState: CustomerTypeState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}

class RepnotesCompetitionInfo extends Component<CategoryProps> {

    componentDidMount = () => {
        this._validateRole();
        this.props.setCustomerState({ salesPersonList: [], customerList: [] });
        this.props.getCompany(this.props.system.session.token);
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }
    
    componentWillUnmount = () => this.props.resetReportsState();

    _validateRole = () => {
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') this._competitionFilter('selectedCompanyId', this.props.system.session.userDetails.companyId as string);
        this._loadTable();
    } 

    _loadTable = () => {
        if(this.props.competitionState.selectedCompanyId){
            this.props.loadListManagementItems(LIST_ITEMS, this.props.competitionState.selectedCompanyId)
        }
    }

    // on component input in dynamic form
    _competitionFilter = (field: string, value: DynamicCompetitionInformationType) => {
        this.props.setCompetitionInformationState({ [field]: value }); // magic setstate
        // on filter input, trigger view below
        if(field === "selectedCompanyId"){
            this.props.resetFilter(["salesPersonDocId", "province", "industryId", "customerTypeId", "customerId"])
            this.props.loadListManagementItems(LIST_ITEMS, value as string)
        }
        this.props.getCompetitionInfo();
    }

    _onExportClick = () => {
        this.props.exportCompetitionInformation();
    }

    render = () => {
        const { selectedCompanyId, competitionInfo, loading, activeTab, report, salesPersonDocId, province, customerTypeId, industryId, customerId } = this.props.competitionState;
        const { salesPersonList, customerList } = this.props.customerState;
        const { locationList } = this.props.locationState;
        const { customerTypeList } = this.props.customerTypeState;
        const { industryList } = this.props.industryState;
        const { userDetails } = this.props.system.session;
        const { companyArray } = this.props.companyList;
        const role = (userDetails.role as string).toLowerCase();
        let locationDataList: {  province: string; }[] = [];
        forEach(locationList, (area) => {
            forEach(area.province, (province) => {
                locationDataList.push({'province': province.name})
            })
        })
        return (
            <Box className= 'repnotes-content'>
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName = "Reports" subModule= "Voice of Customer" secondSubModule= "Competition Info" />
                    </Grid>
                </Grid>

                <Grid container style={{padding:'20px 5px'}} spacing={2} >
                    <Grid container spacing={1}>
                        { userDetails.role === 'SUPER ADMIN' && 
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
                                        this._competitionFilter('selectedCompanyId', e.target.value as string)
                                    }}
                                />
                            </Grid>
                        }
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
                                        this._competitionFilter('salesPersonDocId', o ? o.value : '');
                                    }}
                                    disableAutocompletePopover={true}
                                />
                            </Grid>
                        }
                        <Grid item xs={2} style={{padding:"0 5px"}}>
                            <RepnotesInput
                                id="repnotes-customer-status"
                                type="searchabledropdown"
                                label="Province"
                                labelPosition="top"
                                value={province}
                                autocompleteOptions={map(locationDataList, (f) => ({ label: f.province, value: f.province }))}
                                onAutocompleteChange={(e, o) => {
                                    this._competitionFilter('province', o ? o.value : '');
                                }}
                                disableAutocompletePopover={true}
                            />
                        </Grid>
                        <Grid item xs={3} style={{ display: 'flex', alignItems: 'flex-end', paddingTop: 0 }}>
                            <Box width="100px">
                                <RepnotesCompetitionFilter 
                                    competitionFilter={this._competitionFilter}
                                    industryId={industryId}
                                    customerTypeId={customerTypeId}
                                    customerId={customerId}
                                    industryList={industryList}
                                    customerTypeList={customerTypeList}
                                    customerList={customerList}
                                />
                            </Box>
                            <RepnotesPrimaryButton 
                                startIcon={<img src={Export} alt="" style={{ width: 18, height: 18, objectFit: 'cover' }} />}
                                style={{ height: 36, alignSelf: 'unset', width: 120, boxSizing: 'border-box'}}
                                onClick={this._onExportClick}
                            >
                                Export
                            </RepnotesPrimaryButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Tabs value={activeTab} TabIndicatorProps={{ style: { height: 3 } }} >
                    <Tab 
                        value="REPORT" 
                        label="Report" 
                        onClick={() => this.props.setCompetitionInformationState({ activeTab: 'REPORT' })} 
                        style={{ color:'green', minWidth:80, fontWeight: 600 }} 
                    />
                    <Tab 
                        value="STATUS" 
                        label="Status" 
                        onClick={() => this.props.setCompetitionInformationState({ activeTab: 'STATUS' })} 
                        style={{ color:'red', minWidth:80, fontWeight: 600 }} 
                    />
                </Tabs>
                {activeTab === 'REPORT' &&
                    <>
                        {loading ? <LoadingDialog /> :
                            <CompetitionInformationReport
                                data={report}
                            />
                        }
                    </>
                }
                {activeTab === 'STATUS' &&
                    <>
                        <Grid container >
                            <Typography variant= "h6" style={{ fontWeight: 550,  paddingBottom:"15px" }} >Summary Total</Typography>
                        </Grid>
                        { loading ? <LoadingDialog />
                            :<Grid item>
                                <Grid item container spacing = {1}>
                                    <Grid item xs={12} sm= {2}>
                                        <RepnotesVOCCardCommercial count={competitionInfo.commercialTerms}></RepnotesVOCCardCommercial>
                                    </Grid>
                                    <Grid item xs={12} sm= {2}>
                                        <RepnotesVOCCardPricing count={competitionInfo.pricing}></RepnotesVOCCardPricing>
                                    </Grid>
                                    <Grid item xs={12} sm= {2}>
                                        <RepnotesVOCCardActivities count={competitionInfo.activities}></RepnotesVOCCardActivities>
                                    </Grid>
                                </Grid>
                                <Grid container  style={{height:'230px'}}>
                                    <RepnotesGraphicalBar
                                        pricing={competitionInfo.pricing}
                                        activities={competitionInfo.activities}
                                        commercialTerms={competitionInfo.commercialTerms}
                                    />
                                </Grid>
                            </Grid>
                        }
                    </>
                }
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    competitionState: state.competitionState,
    customerState: state.customerState,
    companyList: state.companyList,
    locationState: state.locationState,
    industryState: state.industryState,
    customerTypeState: state.customerTypeState,
    system: state.system,
    alert: state.alert,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    getCompetitionInfo,
    setRedirect,
    clearDialog,
    resetFilter,
    getCompany,
    setDialogOpen,
    loadListManagementItems,
    resetReportsState,
    setCustomerState,
    setCompetitionInformationState,
    exportCompetitionInformation
})(RepnotesCompetitionInfo);