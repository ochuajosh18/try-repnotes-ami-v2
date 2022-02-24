import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { ListItem, SystemState } from '../../../../store/system/types';
import { DynamicProductPerformanceType, ProductPerformanceState } from '../../../../store/report/voiceOfCustomer/productPerformance/types';
import { CompanyState } from '../../../../store/listManagement/company/types';
import { CustomerState } from '../../../../store/customerManagement/customer/types';
import { LocationState } from '../../../../store/customerManagement/location/types';
import { IndustryState } from '../../../../store/listManagement/industry/types';
import { CustomerTypeState } from '../../../../store/listManagement/customerType/types';
import { ProductFamilyState } from '../../../../store/listManagement/productFamily/types';
import { AlertState } from '../../../../store/alert/types';
import { ProductState } from '../../../../store/productManagement/product/types';
import { getCompany } from '../../../../store/listManagement/company/actions';
import { loadListManagementItems, resetReportsState } from '../../../../store/system/actions';
import { setCustomerState } from '../../../../store/customerManagement/customer/actions';
import { 
    exportProductPerformance, 
    getProductPerformance, 
    resetFilter, 
    setProductPerformanceState 
} from '../../../../store/report/voiceOfCustomer/productPerformance/actions';
import {
    ProductPerformanceContainer
} from './fragments/ProductPerformanceComponents';
import ProductPerformanceFilters from './fragments/ProductPerformanceFilters';
import ProductPerformanceGraph from './fragments/ProductPerformanceGraph';
import ProductPerformanceReport from './fragments/ProductPerformanceReport';

// global
import { RepnotesContentHeader } from '../../../common/RepnotesContentHeader';
import { CenteredLoadingDialog, CenteredNoData } from '../../../common/RepnotesAlerts';
import { RepnotesInput } from '../../../common/RepnotesInput';

// material ui
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

// utils
import forEach from 'lodash/forEach';
import map from 'lodash/map'

// constants
const COLOR_LIST = ["#EC7D33", "#1E73C6", "#7F7F7F", "#FFBD35", "#2A9DD7", "#4FAF43"];
const LIST_ITEMS: Array<ListItem> = ['Salesperson', 'Location', 'Industry', 'Customer Type', 'Product Family', 'Product', 'Customer'];

interface ProductPerformanceProps {
    setCustomerState: typeof setCustomerState;
    resetReportsState: typeof resetReportsState;
    getCompany: typeof getCompany;
    setProductPerformanceState: typeof setProductPerformanceState;
    exportProductPerformance: typeof exportProductPerformance;
    getProductPerformance: typeof getProductPerformance;
    resetFilter: typeof resetFilter;
    loadListManagementItems: typeof loadListManagementItems;
    system: SystemState;
    productPerformanceState: ProductPerformanceState;
    companyList: CompanyState;
    customerState: CustomerState;
    locationState: LocationState;
    industryState: IndustryState;
    productState: ProductState;
    customerTypeState: CustomerTypeState;
    productFamilyState: ProductFamilyState;
    alert: AlertState;
}


class ProductPerformance extends Component<ProductPerformanceProps> {

    componentDidMount = () => {
        this._validateRole();
        this.props.setCustomerState({ salesPersonList: [], customerList: [] });
        this.props.getCompany(this.props.system.session.token);
    }

    componentWillUnmount = () => this.props.resetReportsState();

    _validateRole = () => {
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') this._onProductPerformanceInput('filterSelectedCompany', this.props.system.session.userDetails.companyId as string);
        this._loadTable();
    }

    _loadTable = () => {
        if(this.props.productPerformanceState.filterSelectedCompany){
            this.props.loadListManagementItems(LIST_ITEMS, this.props.productPerformanceState.filterSelectedCompany)
        }
    }

    // on component input in dynamic form
    _onProductPerformanceInput = (field: string, value: DynamicProductPerformanceType) => {
        this.props.setProductPerformanceState({ [field]: value }); // magic setstate
        // on filter input, trigger view below
        if(field === "filterSelectedCompany"){
            this.props.resetFilter(["filterSelectedSalesperson", "filterSelectedProvince", "filterSelectedIndustry", "filterSelectedCustomerType", "filterSelectedProductFamily", "filterSelectedRating"])
            this.props.loadListManagementItems(LIST_ITEMS, value as string)
        }
        this.props.getProductPerformance(this.props.system)
    }

    _onExportClick = () => {
        // trigger export
        this.props.exportProductPerformance(this.props.system)
    }
    
    render = () => {
        const { 
            filterSelectedSalesperson, filterSelectedProvince, filterSelectedIndustry, filterSelectedCustomerType,
            filterSelectedProductFamily, filterSelectedRating, loading, filterSelectedCompany, productPerformanceList,
            activeTab, report, filterSelectedCustomer, filterSelectedViewType, filterSelectedModel, filterSelectedServiceRanking
        } = this.props.productPerformanceState;

        const role = this.props.system.session ? this.props.system.session.userDetails.role as string : '';

        let productPerformancesLabels: Array<string> = [];
        let productPerformancesValues: Array<number> = [];
        forEach(productPerformanceList, (data) => {
            productPerformancesLabels.push(data.name)
            productPerformancesValues.push(data.newCount)
        })

        return (
            <ProductPerformanceContainer>
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Reports" subModule="Voice of Customer" secondSubModule="Product Performance" />
                    </Grid>
                </Grid>
                <ProductPerformanceFilters
                    onProductPerformanceInput={this._onProductPerformanceInput}
                    role={role}
                    filterCompanies={this.props.companyList.companyArray}
                    company={filterSelectedCompany}
                    onExportClick={this._onExportClick}
                    salespersons={this.props.customerState.salesPersonList}
                    filterSelectedSalesperson={filterSelectedSalesperson}
                    provinces={this.props.locationState.locationList}
                    filterSelectedProvince={filterSelectedProvince}
                    industries={this.props.industryState.industryList}
                    filterSelectedIndustry={filterSelectedIndustry}
                    customerTypes={this.props.customerTypeState.customerTypeList}
                    filterSelectedCustomerType={filterSelectedCustomerType}
                    customers={this.props.customerState.customerList}
                    filterSelectedCustomer={filterSelectedCustomer}
                    models={this.props.productState.productList}
                    filterSelectedModel={filterSelectedModel}
                    productFamilies={this.props.productFamilyState.productFamilyList}
                    filterSelectedProductFamily={filterSelectedProductFamily}
                    filterSelectedRating={filterSelectedRating}
                    filterSelectedServiceRanking={filterSelectedServiceRanking}
                />
                {/* Uncomment the Summary Total if needed, else remove on API integration */}
                {/* <Grid container>
                    <Typography variant="h6" style={{ fontWeight: 550, paddingBottom: 15 }}>Summary Total</Typography>
                </Grid> */}
                <Tabs value={activeTab} TabIndicatorProps={{ style: { height: 3 } }} >
                    <Tab 
                        value="REPORT" 
                        label="Report" 
                        onClick={() => this.props.setProductPerformanceState({ activeTab: 'REPORT' })} 
                        style={{ color:'green', minWidth:80, fontWeight: 600 }} 
                    />
                    <Tab 
                        value="STATUS" 
                        label="Status" 
                        onClick={() => this.props.setProductPerformanceState({ activeTab: 'STATUS' })} 
                        style={{ color:'red', minWidth:80, fontWeight: 600 }} 
                    />
                </Tabs>
                {activeTab === 'REPORT' &&
                    <>
                        {loading ? <CenteredLoadingDialog /> :
                            <ProductPerformanceReport
                                data={report}
                            />
                        }
                    </>
                }
                {activeTab === 'STATUS' &&
                    <>
                        {(productPerformancesValues.length > 0 || loading) ?
                            <>
                                {loading ? <CenteredLoadingDialog />
                                :   
                                <Box>
                                    <Grid container >
                                        <Grid item xs={3} style={{ paddingTop: 10 }}>
                                            <RepnotesInput
                                                id="repnotes-view-type"
                                                type="select"
                                                label="View Type"
                                                labelPosition="top"
                                                value={filterSelectedViewType}
                                                options={map(["Make-Model", "Product Performance Type"], (n) => ({
                                                    id: n,
                                                    name: n
                                                }))}
                                                onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                    this._onProductPerformanceInput('filterSelectedViewType', e.target.value as string)
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={12} style={{ height: 'calc(100vh - 288px)', paddingTop: 8 }}>
                                            <ProductPerformanceGraph
                                                data={productPerformancesLabels} 
                                                colors={COLOR_LIST}
                                                values={productPerformancesValues}
                                                viewType={filterSelectedViewType}
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
            </ProductPerformanceContainer>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    productPerformanceState: state.productPerformanceState,
    customerState: state.customerState,
    locationState: state.locationState,
    industryState: state.industryState,
    companyList: state.companyList,
    productState: state.productState,
    customerTypeState: state.customerTypeState,
    productFamilyState: state.productFamilyState,
    system: state.system,
    alert: state.alert
});

const mapDispatchToProps = {
    setProductPerformanceState,
    getCompany,
    exportProductPerformance,
    getProductPerformance,
    resetFilter,
    loadListManagementItems,
    resetReportsState,
    setCustomerState
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductPerformance);