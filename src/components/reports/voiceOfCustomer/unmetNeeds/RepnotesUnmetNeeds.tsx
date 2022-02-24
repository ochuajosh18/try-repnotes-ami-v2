import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { SystemState, ListItem } from '../../../../store/system/types';
import { AlertState } from '../../../../store/alert/types';
import { CustomerState } from '../../../../store/customerManagement/customer/types';
import { DialogState } from '../../../../store/dialog/types';
import { LocationState } from '../../../../store/customerManagement/location/types';
import { IndustryState } from '../../../../store/listManagement/industry/types';
import { CustomerTypeState } from '../../../../store/listManagement/customerType/types';
import { ProductState } from '../../../../store/productManagement/product/types';
import { CompanyState } from '../../../../store/listManagement/company/types';
import { UnmetNeedsState } from '../../../../store/report/voiceOfCustomer/unmetNeeds/types';
import { 
    getUnmetNeeds,
    setCustomerTypeFilter, 
    setIndustryFilter, 
    setModelFilter, 
    setProvinceFilter, 
    setSalesPersonDocIdFilter, 
    setUNCompanyFilter,
    setUnmetNeedsState,
    exportUnmetNeeds
} from '../../../../store/report/voiceOfCustomer/unmetNeeds/actions';
import { getCompany } from '../../../../store/listManagement/company/actions';
import { loadListManagementItems, setRedirect, resetReportsState} from '../../../../store/system/actions';
import { setCustomerState } from '../../../../store/customerManagement/customer/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../../common/RepnotesContentHeader';
import {  CenteredNoData, LoadingDialog } from '../../../common/RepnotesAlerts';
import RepnotesGraphicalBar from './RepnotesUnmetNeedsBar';
import { RepnotesUnmetNeedsFilter } from './RepnotesUnmetNeedsFilter';
import { 
    RepnotesDynamicVOCCard
} from '../RepnotesVOCCard';
import { RepnotesInput } from '../../../common/RepnotesInput';
import { RepnotesPrimaryButton } from '../../../common/RepnotesButton';
import { UnmetNeedsContainer } from './fragments/UnmetNeedsComponents';
import UnmetNeedsReport from './fragments/UnmetNeedsReport';
import UnmetNeedsDateRange from './fragments/UnmetNeedsDateRange';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// utils
import forEach from 'lodash/forEach'
import map from 'lodash/map'
import moment from 'moment';

import Export from '../../../../assets/images/export.png';


// constants
const LIST_ITEMS: Array<ListItem> = ['Salesperson', 'Location', 'Industry', 'Customer Type', 'Product'];
const COLOR_LIST = [ "#EC7D33", "#1E73C6", "#7F7F7F", "#FFBD35", "#2A9DD7", "#4FAF43" ];

interface UnmetNeedsProps {
    exportUnmetNeeds: typeof exportUnmetNeeds;
    setUnmetNeedsState: typeof setUnmetNeedsState;
    setCustomerState: typeof setCustomerState;
    resetReportsState: typeof resetReportsState;
    setRedirect: typeof setRedirect;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getCompany: typeof getCompany;
    setSalesPersonDocIdFilter: typeof setSalesPersonDocIdFilter;
    setProvinceFilter: typeof setProvinceFilter;
    setIndustryFilter: typeof setIndustryFilter;
    setCustomerTypeFilter: typeof setCustomerTypeFilter;
    setModelFilter: typeof setModelFilter;
    setUNCompanyFilter: typeof setUNCompanyFilter;
    getUnmetNeeds: typeof getUnmetNeeds;
    loadListManagementItems: typeof loadListManagementItems;
    companyList: CompanyState;
    unmetNeedsState: UnmetNeedsState;
    customerState: CustomerState;
    locationState: LocationState;
    industryState: IndustryState;
    customerTypeState: CustomerTypeState;
    productState: ProductState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}

class RepnotesUnmetNeeds extends Component<UnmetNeedsProps> {

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
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') await this.props.setUNCompanyFilter({selectedCompanyId: this.props.system.session.userDetails.companyId as string});
        this._loadTable();
    } 

    _loadTable = () => {
        if(this.props.unmetNeedsState.selectedCompanyId !== ''){
            this.props.getUnmetNeeds(this.props.system, this.props.unmetNeedsState);
            this.props.loadListManagementItems(LIST_ITEMS, this.props.unmetNeedsState.selectedCompanyId)
        }
    }

    _unmetNeedsFilter = async(field: string, value: string ) => {
        if(field === 'salesPersonDocId') await this.props.setSalesPersonDocIdFilter({salesPersonDocId: value as string});
        if(field === 'province') await this.props.setProvinceFilter({province: value as string});
        if(field === 'industryId') await this.props.setIndustryFilter({industryId: value as string});
        if(field === 'customerTypeId') await this.props.setCustomerTypeFilter({customerTypeId: value as string});
        if(field === 'modelId') await this.props.setModelFilter({modelId: value as string});
        this.props.getUnmetNeeds(this.props.system, this.props.unmetNeedsState);
        // call function
    }

    _companyFilter = async(value: string ) => {
        await this.props.setUNCompanyFilter({selectedCompanyId: value as string});
        this._loadTable(); 
    }

    _onExportClick = () => {
        this.props.exportUnmetNeeds();
    }

    render = () => {
        const { unmetNeedsStartDate, unmetNeedsEndDate, loading, salesPersonDocId, province, customerTypeId, report, activeTab, industryId, modelId, selectedCompanyId, unmetNeedsInfo } = this.props.unmetNeedsState;
        const { salesPersonList } = this.props.customerState;
        const { locationList } = this.props.locationState;
        const { customerTypeList } = this.props.customerTypeState;
        const { industryList } = this.props.industryState;
        const { productList } = this.props.productState;
        const { userDetails } = this.props.system.session;
        const { companyArray } = this.props.companyList;
        const role = (userDetails.role as string).toLowerCase();

        let locationDataList: {  province: string; }[] = [];
        forEach(locationList, (area) => {
            forEach(area.province, (province) => {
                locationDataList.push({'province': province.name})
            })
        })

        const unmetNeedsLabels = ['Jobsite Regulation Gap', 'Operator Protection Gap', 'Product Operation Gap', 'Product Capability Gap', 'Others'] as Array<string>;
        const { jobsiteRegulationGap, operatorProtectionGap, others, productOperationGap, productCapabilityGap } = unmetNeedsInfo;
        const unmetNeedsValues= [jobsiteRegulationGap, operatorProtectionGap, productOperationGap, productCapabilityGap, others] as Array<number>;
        return (
            <UnmetNeedsContainer className="repnotes-content">
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Reports" subModule="Voice of Customer" secondSubModule="Unmet Needs" />
                    </Grid>
                </Grid>

                <Grid container style={{ padding:'20px 5px' }} spacing={2} >
                    <Grid container spacing={1}>
                        {   userDetails.role === 'SUPER ADMIN' && 
                            <Grid item xs={3} style={{padding:"0 5px"}}>
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
                                       this._unmetNeedsFilter('salesPersonDocId', o ? o.value : '');
                                   }}
                                   disableAutocompletePopover={true}
                                />
                            </Grid>
                        }
                        <Grid item xs={3} style={{ padding:"0 5px" }}>
                            <RepnotesInput
                                  id="repnotes-customer-province"
                                  type="searchabledropdown"
                                  label="Province"
                                  labelPosition="top"
                                  value={province}
                                  autocompleteOptions={map(locationDataList, (f) => ({ label: f.province, value: f.province }))}
                                  onAutocompleteChange={(e, o) => {
                                      this._unmetNeedsFilter('province', o ? o.value : '');
                                  }}
                                  disableAutocompletePopover={true}
                            />
                        </Grid>
                        <Grid item xs={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Box width="100px">
                                <RepnotesUnmetNeedsFilter 
                                    unmetNeedsFilter={this._unmetNeedsFilter}
                                    industryId={industryId}
                                    customerTypeId={customerTypeId}
                                    modelId={modelId}
                                    industryList={industryList} 
                                    customerTypeList={customerTypeList}
                                    modelList={productList} 
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
                        <UnmetNeedsDateRange
                            startDate={unmetNeedsStartDate}
                            endDate={unmetNeedsEndDate}
                            onDateChange={(start, end) => {
                                if (start && end) {
                                    this.props.setUnmetNeedsState({ 
                                        unmetNeedsStartDate: moment(start).format('YYYY-MM-DD'),
                                        unmetNeedsEndDate: moment(end).format('YYYY-MM-DD')
                                    });

                                    this.props.getUnmetNeeds(this.props.system, {
                                        ...this.props.unmetNeedsState,
                                        unmetNeedsStartDate: moment(start).format('YYYY-MM-DD'),
                                        unmetNeedsEndDate: moment(end).format('YYYY-MM-DD')
                                    });
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Tabs value={activeTab} TabIndicatorProps={{ style: { height: 3 } }} >
                    <Tab 
                        value="REPORT" 
                        label="Report" 
                        onClick={() => this.props.setUnmetNeedsState({ activeTab: 'REPORT' })} 
                        style={{ color:'green', minWidth:80, fontWeight: 600 }} 
                    />
                    <Tab 
                        value="STATUS" 
                        label="Status" 
                        onClick={() => this.props.setUnmetNeedsState({ activeTab: 'STATUS' })} 
                        style={{ color:'red', minWidth:80, fontWeight: 600 }} 
                    />
                </Tabs>
                {activeTab === 'REPORT' &&
                    <>
                        {loading ? <LoadingDialog /> :
                            <UnmetNeedsReport
                                data={report}
                            />
                        }
                    </>
                }
                {activeTab === 'STATUS' &&
                    <>
                        {(unmetNeedsValues.length > 0 || loading) ?
                            <>
                                <Grid container >
                                    <Typography variant="h6" style={{ fontWeight: 550,  paddingBottom:"15px" }} >Summary Total</Typography>
                                </Grid>
                                { loading ? <LoadingDialog />
                                    :<Grid item>
                                        <Grid item container spacing={1}>
                                            { unmetNeedsLabels.map((label, index) => (
                                                <Grid item xs={12} sm={2}>
                                                    <RepnotesDynamicVOCCard count={unmetNeedsValues[index]} label={label} color={COLOR_LIST[index]}/>
                                                </Grid>
                                            ))}
                                        </Grid>
                                        <Grid container  style={{ height:'300px' }}>
                                                <RepnotesGraphicalBar
                                                    data={unmetNeedsLabels}
                                                    values={unmetNeedsValues}
                                                    colors={COLOR_LIST}
                                                />
                                        </Grid>
                                    </Grid>
                                }
                            </>
                        :
                            <CenteredNoData />
                        }
                    </>
                }
            </UnmetNeedsContainer>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    unmetNeedsState: state.unmetNeedsState,
    customerState: state.customerState,
    locationState: state.locationState,
    industryState: state.industryState,
    companyList: state.companyList,
    customerTypeState: state.customerTypeState,
    productState: state.productState,
    system: state.system,
    alert: state.alert,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setRedirect,
    clearDialog,
    getCompany,
    setSalesPersonDocIdFilter,
    setProvinceFilter,
    setIndustryFilter,
    setCustomerTypeFilter,
    setModelFilter,
    setUNCompanyFilter,
    setDialogOpen,
    getUnmetNeeds,
    loadListManagementItems,
    resetReportsState,
    setCustomerState,
    setUnmetNeedsState,
    exportUnmetNeeds
})(RepnotesUnmetNeeds);