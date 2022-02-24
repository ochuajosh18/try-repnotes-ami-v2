import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { ListItem, SystemState } from '../../../../store/system/types';
import { AlertState } from '../../../../store/alert/types';
import { CustomerState } from '../../../../store/customerManagement/customer/types';
import { DialogState } from '../../../../store/dialog/types';
import { LocationState } from '../../../../store/customerManagement/location/types';
import { IndustryState } from '../../../../store/listManagement/industry/types';
import { CustomerTypeState } from '../../../../store/listManagement/customerType/types';
import { CustomerExperienceState, DynamicCustomerExperienceType } from '../../../../store/report/voiceOfCustomer/customerExperience/types';
import { CompanyState } from '../../../../store/listManagement/company/types';
import { 
    setCustomerExperienceState,
    getCustomerExperience,
    exportCustomerExperience, 
    resetFilter
} from '../../../../store/report/voiceOfCustomer/customerExperience/actions';
import { loadListManagementItems, setRedirect, resetReportsState } from '../../../../store/system/actions';
import { setCustomerState } from '../../../../store/customerManagement/customer/actions';
import { getCompany } from '../../../../store/listManagement/company/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../../common/RepnotesContentHeader';
import { LoadingDialog } from '../../../common/RepnotesAlerts';
import RepnotesCEGraphicalBar from './RepnotesCustomerExperienceBar';
import { RepnotesCustomerExperienceFilter } from './RepnotesCustomerExperienceFilter';
import { 
    RepnotesVOCCardCommunicationOfOrderStatus,
    RepnotesVOCCardDeliveryExperience,
    RepnotesVOCCardOthers, 
    RepnotesVOCCardPartsAvailability, 
    RepnotesVOCCardPartsPricing, 
    RepnotesVOCCardProductLeadTime,
    RepnotesVOCCardPurchasingExperience,
    RepnotesVOCCardServiceTechnicianSupport,
} from '../RepnotesVOCCard';
import { RepnotesInput } from '../../../common/RepnotesInput';
import CustomerExperienceReport from './fragments/CustomerExperienceReport';
import { RepnotesPrimaryButton } from '../../../common/RepnotesButton';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// utils
import forEach from 'lodash/forEach';
import map from 'lodash/map';

import Export from '../../../../assets/images/export.png';

// constants
const LIST_ITEMS: Array<ListItem> = ['Salesperson', 'Location', 'Industry', 'Customer Type', 'Customer'];

interface CustomerExperienceProps {
    setCustomerExperienceState: typeof setCustomerExperienceState;
    setCustomerState: typeof setCustomerState;
    resetReportsState: typeof resetReportsState;
    setRedirect: typeof setRedirect;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getCompany: typeof getCompany;
    resetFilter: typeof resetFilter;
    getCustomerExperience: typeof getCustomerExperience;
    loadListManagementItems: typeof loadListManagementItems;
    exportCustomerExperience: typeof exportCustomerExperience;
    companyList: CompanyState;
    customerExperienceState: CustomerExperienceState;
    customerState: CustomerState;
    locationState: LocationState;
    industryState: IndustryState;
    customerTypeState: CustomerTypeState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}

class RepnotesCustomerExperience extends Component<CustomerExperienceProps> {

    componentDidMount = () => {
        this._validateRole();
        this.props.getCompany(this.props.system.session.token);
        this.props.setCustomerState({ salesPersonList: [], customerList: [] });
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    componentWillUnmount = () => this.props.resetReportsState();

    _validateRole = () => {
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') this._customerExperienceFilter('selectedCompanyId', this.props.system.session.userDetails.companyId as string);
        this._loadTable();
    } 

    _loadTable = () => {
        if(this.props.customerExperienceState.selectedCompanyId){
            this.props.loadListManagementItems(LIST_ITEMS, this.props.customerExperienceState.selectedCompanyId)
        }
    }

    // on component input in dynamic form
    _customerExperienceFilter = (field: string, value: DynamicCustomerExperienceType) => {
        this.props.setCustomerExperienceState({ [field]: value }); // magic setstate
        // on filter input, trigger view below
        if(field === "selectedCompanyId"){
            this.props.resetFilter(["salesPersonDocId", "province", "customerId", "rating", "industryId", "customerTypeId"])
            this.props.loadListManagementItems(LIST_ITEMS, value as string)
        }
        this.props.getCustomerExperience();
    }

    _onExportClick = () => {
        if (this.props.customerExperienceState.selectedCompanyId) this.props.exportCustomerExperience();
    }

    render = () => {
        const { loading, salesPersonDocId, activeTab, report, province, customerTypeId, industryId, selectedCompanyId, customerExperienceInfo, customerId, rating, yearDate } = this.props.customerExperienceState;
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
            <Box className="repnotes-content">
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Reports" subModule="Voice of Customer" secondSubModule="Customer Experience" />
                    </Grid>
                </Grid>

                <Grid container style={{ padding:'20px 5px' }} spacing={2} >
                    <Grid container spacing={1}>
                        {   userDetails.role === 'SUPER ADMIN' && 
                            <Grid item xs={3} style={{ padding:"0 5px" }}>
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
                                        this._customerExperienceFilter('selectedCompanyId', e.target.value as string)
                                    }}
                                />
                            </Grid>
                        }
                        {role !== 'sales engineer' &&
                            <Grid item xs={3} style={{ padding:"0 5px" }}>
                                <RepnotesInput
                                    id="repnotes-salesperson-selection"
                                    type="searchabledropdown"
                                    label="Salesperson"
                                    labelPosition="top"
                                    value={salesPersonDocId}
                                    autocompleteOptions={map(salesPersonList, (f) => ({ label: f.name, value: f.id }))}
                                    onAutocompleteChange={(e, o) => {
                                        this._customerExperienceFilter('salesPersonDocId', o ? o.value : '');
                                    }}
                                    disableAutocompletePopover={true}
                                />
                            </Grid>
                        }
                        <Grid item xs={3} style={{ padding:"0 5px" }}>
                        <RepnotesInput
                                id="repnotes-customer-status"
                                type="searchabledropdown"
                                label="Province"
                                labelPosition="top"
                                value={province}
                                autocompleteOptions={map(locationDataList, (f) => ({ label: f.province, value: f.province }))}
                                onAutocompleteChange={(e, o) => {
                                    this._customerExperienceFilter('province', o ? o.value : '');
                                }}
                                disableAutocompletePopover={true}
                            />
                        </Grid>
                        <Grid item xs={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Box width="100px">
                                <RepnotesCustomerExperienceFilter
                                    customerExperienceFilter={this._customerExperienceFilter}
                                    industryId={industryId}
                                    customerTypeId={customerTypeId}
                                    rating={rating}
                                    customerId={customerId}
                                    yearDate={yearDate}
                                    industryList={industryList}
                                    customerTypeList={customerTypeList}
                                    customerList={customerList}
                                />
                            </Box>
                            <RepnotesPrimaryButton 
                                startIcon={<img src={Export} alt="" style={{ width: 18, height: 18, objectFit: 'cover' }} />}
                                style={{ height: 36, alignSelf: 'unset', width: 100, boxSizing: 'border-box'}}
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
                        onClick={() => this.props.setCustomerExperienceState({ activeTab: 'REPORT' })} 
                        style={{ color:'green', minWidth:80, fontWeight: 600 }} 
                    />
                    <Tab 
                        value="STATUS" 
                        label="Status" 
                        onClick={() => this.props.setCustomerExperienceState({ activeTab: 'STATUS' })} 
                        style={{ color:'red', minWidth:80, fontWeight: 600 }} 
                    />
                </Tabs>
                {activeTab === 'REPORT' &&
                    <>
                        {loading ? 
                            <LoadingDialog />
                        :
                            <CustomerExperienceReport
                                data={report}
                            />
                         }
                    </>
                }
                {activeTab === 'STATUS' &&
                    <>
                        <Grid container >
                            <Typography variant="h6" style={{ fontWeight: 550,  paddingBottom:"15px" }} >Summary Total</Typography>
                        </Grid>
                        { loading ? 
                            <LoadingDialog />
                            :
                            <Grid item>
                                <Grid item container spacing={1}>
                                    <Grid item xs={12} sm={2}>
                                        <RepnotesVOCCardPurchasingExperience count={customerExperienceInfo.purchasingExperience} />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <RepnotesVOCCardCommunicationOfOrderStatus count={customerExperienceInfo.communicationOfOrderStatus} />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <RepnotesVOCCardProductLeadTime count={customerExperienceInfo.productLeadTime} />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <RepnotesVOCCardDeliveryExperience count={customerExperienceInfo.deliveryExperience} />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <RepnotesVOCCardPartsAvailability count={customerExperienceInfo.partsAvailability} />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <RepnotesVOCCardPartsPricing count={customerExperienceInfo.partsPricing} />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <RepnotesVOCCardServiceTechnicianSupport count={customerExperienceInfo.serviceTechnicianSupport} />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <RepnotesVOCCardOthers count={customerExperienceInfo.others} />
                                    </Grid>
                                </Grid>
                                <Grid container  style={{ height:'300px' }}>
                                        <RepnotesCEGraphicalBar 
                                            purchasingExperience={customerExperienceInfo.purchasingExperience}
                                            communicationOfOrderStatus={customerExperienceInfo.communicationOfOrderStatus}
                                            productLeadTime={customerExperienceInfo.productLeadTime}
                                            deliveryExperience={customerExperienceInfo.deliveryExperience}
                                            partsAvailability={customerExperienceInfo.partsAvailability}
                                            partsPricing={customerExperienceInfo.partsPricing}
                                            serviceTechnicianSupport={customerExperienceInfo.serviceTechnicianSupport}
                                            others={customerExperienceInfo.others}
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
    customerExperienceState: state.customerExperienceState,
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
    getCompany,
    resetFilter,
    setDialogOpen,
    getCustomerExperience,
    loadListManagementItems,
    resetReportsState,
    setCustomerState,
    setCustomerExperienceState,
    exportCustomerExperience
})(RepnotesCustomerExperience);