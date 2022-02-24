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
import { ProductState } from '../../../../store/productManagement/product/types';
import { CompanyState } from '../../../../store/listManagement/company/types';
import { ProductFamilyState } from '../../../../store/listManagement/productFamily/types';
import { DynamicProductQualityType, ProductQualityState } from '../../../../store/report/voiceOfCustomer/productQuality/types';
import { 
    getProductQuality,
    setProductQualityState,
    exportProductQuality,
    resetFilter
} from '../../../../store/report/voiceOfCustomer/productQuality/actions';
import { getCompany } from '../../../../store/listManagement/company/actions';
import { loadListManagementItems, setRedirect, resetReportsState } from '../../../../store/system/actions';
import { setCustomerState } from '../../../../store/customerManagement/customer/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../../common/RepnotesContentHeader';
import {  CenteredLoadingDialog, CenteredNoData, LoadingDialog } from '../../../common/RepnotesAlerts';
import RepnotesGraphicalBar from './RepnotesProductQualityBar';
import { RepnotesProductQualityFilter } from './RepnotesProductQualityFilter';
import { RepnotesInput } from '../../../common/RepnotesInput';
import { RepnotesPrimaryButton } from '../../../common/RepnotesButton';
import ProductQualityReport from './fragments/ProductQualityReport';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// utils
import forEach from 'lodash/forEach'
import map from 'lodash/map'
import Export from '../../../../assets/images/export.png';

interface ProductQualityProps {
    setProductQualityState: typeof setProductQualityState;
    setCustomerState: typeof setCustomerState;
    resetReportsState: typeof resetReportsState;
    setRedirect: typeof setRedirect;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getCompany: typeof getCompany;
    resetFilter: typeof resetFilter;
    getProductQuality: typeof getProductQuality;
    loadListManagementItems: typeof loadListManagementItems;
    exportProductQuality: typeof exportProductQuality;
    companyList: CompanyState;
    productQualityState: ProductQualityState;
    customerState: CustomerState;
    locationState: LocationState;
    industryState: IndustryState;
    productFamilyState: ProductFamilyState;
    customerTypeState: CustomerTypeState;
    productState: ProductState;
    system: SystemState;
    alert: AlertState;
    dialog: DialogState;
}

// constants
const LIST_ITEMS: Array<ListItem> = ['Salesperson', 'Location', 'Industry', 'Customer Type', 'Product', 'Customer', 'Product Family'];
const COLOR_LIST = ["#EC7D33", "#1E73C6", "#7F7F7F", "#FFBD35", "#2A9DD7", "#4FAF43"];

class RepnotesProductQuality extends Component<ProductQualityProps> {

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
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') this._productQualityFilter('selectedCompanyId', this.props.system.session.userDetails.companyId as string);
        this._loadTable();
    } 

    _loadTable = () => {
        if(this.props.productQualityState.selectedCompanyId !== ''){
            this.props.loadListManagementItems(LIST_ITEMS, this.props.productQualityState.selectedCompanyId)
        }
    }

    // on component input in dynamic form
    _productQualityFilter = (field: string, value: DynamicProductQualityType) => {
        this.props.setProductQualityState({ [field]: value }); // magic setstate
        // on filter input, trigger view below
        if(field === "selectedCompanyId"){
            this.props.resetFilter(["salesPersonDocId", "province", "industryId", "customerTypeId", "modelId", "customerId",  "productFamilyId"])
            this.props.loadListManagementItems(LIST_ITEMS, value as string)
        }
        this.props.getProductQuality();
    }

    _onExportClick = () => {
        if (this.props.productQualityState.selectedCompanyId) this.props.exportProductQuality();
    }

    render = () => {
        const { loading, salesPersonDocId, province, customerTypeId, report, activeTab, industryId, modelId, selectedCompanyId, productQuality, customerId, productFamilyId, rating, viewType } = this.props.productQualityState;
        const { salesPersonList, customerList } = this.props.customerState;
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

        let unmetNeedsLabels: Array<string> = [];
        let unmetNeedsValues: Array<number> = [];
        forEach(productQuality, (p) => {
            unmetNeedsLabels.push(p.name)
            unmetNeedsValues.push(p.newCount)
        });

        return (
            <Box className="repnotes-content">
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Reports" subModule="Voice of Customer" secondSubModule="Product Quality" />
                    </Grid>
                </Grid>

                <Grid container style={{ padding:'20px 5px' }} spacing={2} >
                    <Grid container spacing={1}>
                        {   userDetails.role === 'SUPER ADMIN' && 
                            <Grid item xs={3} style={{padding:"0 5px"}}>
                                <RepnotesInput
                                    id="repnotes-salesperson-selection"
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
                                        this._productQualityFilter('selectedCompanyId', e.target.value as string)
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
                                        this._productQualityFilter('salesPersonDocId', o ? o.value : '');
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
                                    this._productQualityFilter('province', o ? o.value : '');
                                }}
                                disableAutocompletePopover={true}
                            />
                        </Grid>
                        <Grid item xs={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Box width="100px">
                                <RepnotesProductQualityFilter 
                                    productQualityFilter={this._productQualityFilter}
                                    industryId={industryId}
                                    customerTypeId={customerTypeId}
                                    modelId={modelId}
                                    customerId={customerId}
                                    productFamilyId={productFamilyId}
                                    rating={rating}
                                    industryList={industryList} 
                                    customerTypeList={customerTypeList}
                                    modelList={productList}
                                    customerList={customerList} 
                                    productFamilyList={productFamilyList} 
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
                        onClick={() => this.props.setProductQualityState({ activeTab: 'REPORT' })} 
                        style={{ color:'green', minWidth:80, fontWeight: 600 }} 
                    />
                    <Tab 
                        value="STATUS" 
                        label="Status" 
                        onClick={() => this.props.setProductQualityState({ activeTab: 'STATUS' })} 
                        style={{ color:'red', minWidth:80, fontWeight: 600 }} 
                    />
                </Tabs>
                {activeTab === 'REPORT' &&
                    <>
                        {loading ? <CenteredLoadingDialog /> :
                            <ProductQualityReport
                                data={report}
                            />
                        }
                    </>
                }
                {activeTab === 'STATUS' &&
                    <>
                        {(unmetNeedsValues.length > 0 || loading) ?
                            <>  
                                { loading ? <LoadingDialog />
                                    :
                                    <Box>
                                        <Grid container >
                                            <Grid item xs={3} style={{ paddingTop: 10 }}>
                                                <RepnotesInput
                                                    id="repnotes-view-type"
                                                    type="select"
                                                    label="View Type"
                                                    labelPosition="top"
                                                    value={viewType}
                                                    options={map(["Product Family", "Product Quality Type"], (n) => ({
                                                        id: n,
                                                        name: n
                                                    }))}
                                                    onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                        this._productQualityFilter('viewType', e.target.value as string)
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}></Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container  style={{ height:'300px' }}>
                                                    <RepnotesGraphicalBar
                                                        data={unmetNeedsLabels}
                                                        values={unmetNeedsValues}
                                                        colors={COLOR_LIST}
                                                        viewType={viewType}
                                                    />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                }
                            </>
                        :
                            <CenteredNoData />
                        }
                    </>
                }
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    productQualityState: state.productQualityState,
    customerState: state.customerState,
    locationState: state.locationState,
    industryState: state.industryState,
    productFamilyState: state.productFamilyState,
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
    resetFilter,
    setDialogOpen,
    getProductQuality,
    loadListManagementItems,
    resetReportsState,
    setCustomerState,
    setProductQualityState,
    exportProductQuality
})(RepnotesProductQuality);