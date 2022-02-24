import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { ListItem, SystemState } from '../../../store/system/types';
import { AlertState } from '../../../store/alert/types';
import { CustomerState } from '../../../store/customerManagement/customer/types';
import { DialogState } from '../../../store/dialog/types';
import { 
    DynamicSalesOpportunitiesType, 
    SalesOpportunitiesState 
} from '../../../store/report/salesOpportunities/types';
import { MakeState } from '../../../store/listManagement/make/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { LocationState } from '../../../store/customerManagement/location/types';
import { IndustryState } from '../../../store/listManagement/industry/types';
import { ProductFamilyState } from '../../../store/listManagement/productFamily/types';
import { CustomerTypeState } from '../../../store/listManagement/customerType/types';
import { ProductState } from '../../../store/productManagement/product/types';
import { getCompany } from '../../../store/listManagement/company/actions';
import { 
    getSalesOpportunitiesInfo,
    resetFilter,
    setSalesOpportunitiesState,
    exportSalesOpportunities
} from '../../../store/report/salesOpportunities/actions';

import { setCustomerState } from '../../../store/customerManagement/customer/actions';
import { loadListManagementItems, setRedirect, resetReportsState } from '../../../store/system/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { RepnotesInput } from '../../common/RepnotesInput';
import { RepnotesPrimaryButton } from '../../common/RepnotesButton';
import { RepnotesSalesOpportunityFilter } from './fragments/RepnotesSalesOpportunitiesFilter';
import { RepnotesSOStatusTab } from './RepnotesSalesOpportunitiesStatusContent';
import { RepnotesSalesOpportunityReport } from './RepnotesSalesOpportunityReport';
import {  
    CenteredNoData, 
    LoadingDialog 
} from '../../common/RepnotesAlerts';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// utils
import map from 'lodash/map';
import moment from 'moment'
import { currencyConverter } from '../../../util/utils';
import forEach from 'lodash/forEach'
import Export from '../../../assets/images/export.png';

// constants
const LIST_ITEMS: Array<ListItem> = ['Salesperson', 'Location', 'Make', 'Industry', 'Customer Type', 'Product Family', 'Product', 'Customer'];

interface SalesOpportunitiesProps {
    resetReportsState: typeof resetReportsState;
    setCustomerState: typeof setCustomerState;
    setSalesOpportunitiesState: typeof setSalesOpportunitiesState;
    setRedirect: typeof setRedirect;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    resetFilter: typeof resetFilter;
    getSalesOpportunitiesInfo: typeof getSalesOpportunitiesInfo;
    getCompany: typeof getCompany;
    loadListManagementItems: typeof loadListManagementItems;
    exportSalesOpportunities: typeof exportSalesOpportunities;
    companyList: CompanyState;
    salesOpportunitiesState: SalesOpportunitiesState;
    customerState: CustomerState;
    locationState: LocationState;
    industryState: IndustryState;
    productFamilyState: ProductFamilyState;
    customerTypeState: CustomerTypeState;
    productState: ProductState;
    makeState: MakeState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}


class RepnotesSalesOpportunities extends Component<SalesOpportunitiesProps> {

    componentDidMount = () => {
        this.props.setCustomerState({ salesPersonList: [], customerList: [] });
        this.props.resetReportsState();
        this._validateRole(this.props.system.session.userDetails.role === 'SUPER ADMIN');
        this.props.getCompany(this.props.system.session.token);
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    componentWillUnmount = () => this.props.resetReportsState();

    _validateRole = (isAdmin: boolean) => {
        if(!isAdmin) {
            this._onSalesOpportunityInput('selectedCompanyId', this.props.system.session.userDetails.companyId as string);
            this._loadTable();
        }
    } 

    _loadTable = () => {
        if(this.props.salesOpportunitiesState.selectedCompanyId){
            this.props.loadListManagementItems(LIST_ITEMS, this.props.salesOpportunitiesState.selectedCompanyId);
        }
    }

    _salesOpportunitiesReportRange = (startDate: string, endDate: string ) => {
        this._onSalesOpportunityInput('startDate', moment(startDate).format('YYYY-MM-DD') as string);
        this._onSalesOpportunityInput('endDate', moment(endDate).format('YYYY-MM-DD') as string);
        this.props.getSalesOpportunitiesInfo();
    }

    // on component input in dynamic form
    _onSalesOpportunityInput = async (field: string, value: DynamicSalesOpportunitiesType) => {
        this.props.setSalesOpportunitiesState({ [field]: value }); // magic setstate
        // on filter input, trigger view below
        if(field === "selectedCompanyId"){
            this.props.resetFilter(["salesPersonDocId", "makeDocId", "province", "industryId", "customerTypeId", "modelId", "customerDocId",  "productFamilyId"])
            this.props.loadListManagementItems(LIST_ITEMS, value as string)
        }
        this.props.getSalesOpportunitiesInfo()
    }

    _getSOWithoutDateRange = () => {
        if (this.props.salesOpportunitiesState.selectedCompanyId) {
            this.props.getSalesOpportunitiesInfo();
        }
    }

    _onExportClick = () => {
        this.props.exportSalesOpportunities(this.props.system);
    }
    
    render = () => {
        const { loading, datePeriod, salesPersonDocId, customerDocId, salesOpportunities, startDate, endDate, makeDocId, selectedCompanyId, customerTypeId, province, modelId, productFamilyId, industryId, viewType, activeTab } = this.props.salesOpportunitiesState;
        const { salesPersonList, customerList } = this.props.customerState;
        const { makeList } = this.props.makeState;
        const { locationList } = this.props.locationState;
        const { productFamilyList } = this.props.productFamilyState;
        const { customerTypeList } = this.props.customerTypeState;
        const { industryList } = this.props.industryState;
        const { productList } = this.props.productState;
        const { userDetails } = this.props.system.session;
        const { companyArray } = this.props.companyList;
        let locationDataList: {  province: string; }[] = [];
        const role = (userDetails.role as string).toLowerCase();

        forEach(locationList, (area) => {
            forEach(area.province, (province) => {
                locationDataList.push({'province': province.name})
            })
        })
    
        return (
            <Box className="repnotes-content">
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName = "Reports" subModule= "Sales Opportunities" />
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
                                        this._onSalesOpportunityInput('selectedCompanyId', e.target.value as string);
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
                                        this._onSalesOpportunityInput('salesPersonDocId', o ? o.value : '');
                                    }}
                                    disableAutocompletePopover={true}
                                />
                            </Grid>
                        }
                        <Grid item xs={2} style={{padding:"0 5px"}}>
                            <RepnotesInput
                                id="repnotes-customer-selection"
                                type="searchabledropdown"
                                label="Customer"
                                labelPosition="top"
                                value={customerDocId}
                                autocompleteOptions={map(customerList, (f) => ({ label: f.name, value: f.id }))}
                                onAutocompleteChange={(e, o) => {
                                    this._onSalesOpportunityInput('customerDocId', o ? o.value : '');
                                }}
                                disableAutocompletePopover={true}
                            />
                        </Grid>
                        <Grid item xs={2} style={{ padding:"0 5px" }}>
                            <RepnotesInput
                                id="repnotes-customer-status"
                                type="searchabledropdown"
                                label="Province"
                                labelPosition="top"
                                value={province}
                                autocompleteOptions={map(locationDataList, (f) => ({ label: f.province, value: f.province }))}
                                onAutocompleteChange={(e, o) => {
                                    this._onSalesOpportunityInput('province', o ? o.value : '');
                                }}
                                disableAutocompletePopover={true}
                            />
                        </Grid>
                        <Grid item xs={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Box width="100px">
                                <RepnotesSalesOpportunityFilter 
                                    salesOpportunityFilter={this._onSalesOpportunityInput}
                                    industryId={industryId}
                                    customerTypeId={customerTypeId}
                                    modelId={modelId}
                                    makeDocId={makeDocId}
                                    productFamilyId={productFamilyId}
                                    industryList={industryList} 
                                    customerTypeList={customerTypeList}
                                    modelList={productList}
                                    makeList={makeList} 
                                    productFamilyList={productFamilyList} 
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
                        <Grid item xs={5} style={{padding:"0 5px"}} />
                    </Grid>
                </Grid>
                <Tabs value={activeTab} TabIndicatorProps={{ style: { height: 3 } }} >
                    <Tab 
                        value="REPORT" 
                        label="Report" 
                        onClick={() => this.props.setSalesOpportunitiesState({ activeTab: 'REPORT' })} 
                        style={{ color:'green', minWidth:80, fontWeight: 600 }} 
                    />
                    <Tab 
                        value="STATUS" 
                        label="Status" 
                        onClick={() => this.props.setSalesOpportunitiesState({ activeTab: 'STATUS' })} 
                        style={{ color:'red', minWidth:80, fontWeight: 600 }} 
                    />
                </Tabs>
                {activeTab === 'REPORT' &&
                    <>
                        <RepnotesSalesOpportunityReport
                            loading= {loading}
                            dateRange={this._salesOpportunitiesReportRange}
                            tableData={map(salesOpportunities.report, (data) => ({
                                ...data,
                                price: currencyConverter(data.price),
                                totalAmount: currencyConverter(data.totalAmount)
                            }))}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </>
                }
                {activeTab === 'STATUS' &&
                    <>
                        { loading ? <LoadingDialog />
                            :
                            <>  
                                {((salesOpportunities.status.yearToDate.openSales > 0 || salesOpportunities.status.yearToDate.lostDealTodate > 0) || loading) ?
                                    <RepnotesSOStatusTab
                                        loading={loading}
                                        statusData={salesOpportunities.status}
                                        datePeriod={datePeriod}
                                        setDatePeriod={this._onSalesOpportunityInput}
                                        viewType={viewType}
                                    />
                                :
                                    <CenteredNoData />
                                }
                            </>
                                    
                        }
                    </>
                }
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    salesOpportunitiesState: state.salesOpportunitiesState,
    customerState: state.customerState,
    companyList: state.companyList,
    makeState: state.makeState,
    locationState: state.locationState,
    industryState: state.industryState,
    productFamilyState: state.productFamilyState,
    customerTypeState: state.customerTypeState,
    productState: state.productState,
    system: state.system,
    alert: state.alert,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    setRedirect,
    clearDialog,
    getSalesOpportunitiesInfo,
    getCompany,
    setDialogOpen,
    loadListManagementItems,
    setSalesOpportunitiesState,
    resetReportsState,
    setCustomerState,
    resetFilter,
    exportSalesOpportunities
})(RepnotesSalesOpportunities);