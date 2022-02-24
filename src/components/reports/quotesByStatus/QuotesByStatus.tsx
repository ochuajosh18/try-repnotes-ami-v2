import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { ListItem, SystemState } from '../../../store/system/types';
import { getCompany } from '../../../store/listManagement/company/actions';
import { CustomerState } from '../../../store/customerManagement/customer/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { LocationState } from '../../../store/customerManagement/location/types';
import { CustomerTypeState } from '../../../store/listManagement/customerType/types';
import { IndustryState } from '../../../store/listManagement/industry/types';
import { AlertState } from '../../../store/alert/types';
import { DynamicQuotesByStatusType, QuotesByStatusState } from '../../../store/report/quotesByStatus/types';
import { getQuoteByStatus, resetFilter, setQuotesByStatusState, exportQuotesByStatus } from '../../../store/report/quotesByStatus/actions';
import { setCustomerState } from '../../../store/customerManagement/customer/actions';
import { loadListManagementItems, resetReportsState  } from '../../../store/system/actions';
import {
    QuotesByStatusContainer
} from './fragments/QuotesByStatusComponents';
import QuotesByStatusFilters from './fragments/QuotesByStatusFilters';
import QuotesByStatusGraph from './fragments/QuotesByStatusGraph';
import QuotesByStatusStatues from './fragments/QuotesByStatusStatuses';

// global
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { CenteredLoadingDialog } from '../../common/RepnotesAlerts';

// material ui
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import QuotesByStatusReport from './fragments/QuotesByStatusReport';
import { RepnotesInput } from '../../common/RepnotesInput';

// utils
import map from 'lodash/map';

// constants
const COLOR_LIST = ["#FFBD35", "#EC7D33", "#2A9DD7", "#1E73C6", "#7F7F7F", "#4FAF43"];
const LIST_ITEMS: Array<ListItem> = ['Salesperson', 'Location', 'Industry', 'Customer Type'];

interface QuotesByStatusProps {
    getCompany: typeof getCompany;
    setCustomerState: typeof setCustomerState;
    setQuotesByStatusState: typeof setQuotesByStatusState;
    getQuoteByStatus: typeof getQuoteByStatus;
    resetFilter: typeof resetFilter;
    loadListManagementItems: typeof loadListManagementItems;
    resetReportsState: typeof resetReportsState;
    exportQuotesByStatus: typeof exportQuotesByStatus;
    system: SystemState;
    quotesByStatusState: QuotesByStatusState;
    companyList: CompanyState;
    customerState: CustomerState;
    locationState: LocationState;
    industryState: IndustryState;
    customerTypeState: CustomerTypeState;
    alert: AlertState;
}


class QuotesByStatus extends Component<QuotesByStatusProps> {

    componentDidMount = () => {
        this.props.setCustomerState({ salesPersonList: [] });
        this.props.resetReportsState();
        this._validateRole();
        this.props.getCompany(this.props.system.session.token);
    }

    componentWillUnmount = () => {
        this.props.resetReportsState();
        this.props.setQuotesByStatusState({
            summaryCloseLost: 0,
            summaryWithdraw: 0,
            summaryOpenQuotes: 0,
            summaryCloseWon: 0,
            filterSelectedCompany: ''
        });
    }

    _validateRole = async () => {
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') await this._onQuotesByStatusInput('filterSelectedCompany', this.props.system.session.userDetails.companyId as string);
        this._loadTable();
    }

    _loadTable = () => {
        if(this.props.quotesByStatusState.filterSelectedCompany){
            this.props.loadListManagementItems(LIST_ITEMS, this.props.quotesByStatusState.filterSelectedCompany);
        }
    }

    // on component input in dynamic form
    _onQuotesByStatusInput = async (field: string, value: DynamicQuotesByStatusType) => {
        this.props.setQuotesByStatusState({ [field]: value }); // magic setstate
        // on filter input, trigger view below
        if(field === "filterSelectedCompany"){
            this.props.resetFilter(["filterSelectedSalesperson", "filterSelectedProvince", "filterSelectedIndustry", "filterSelectedCustomerType"])
            this.props.loadListManagementItems(LIST_ITEMS, value as string)
        }
        this.props.getQuoteByStatus()
    }

    _onExportClick = () => {
        // trigger export
        this.props.exportQuotesByStatus();
    }
    
    render = () => {
        const { 
            filterSelectedSalesperson, filterSelectedProvince,filterSelectedIndustry,
            filterSelectedCustomerType, loading, filterSelectedCompany, summaryCloseLost,
            summaryWithdraw, summaryOpenQuotes, summaryCloseWon,
            activeTab, report, filterSelectedViewType
        } = this.props.quotesByStatusState;
        const role = this.props.system.session ? this.props.system.session.userDetails.role as string : '';
        
        return (
            <QuotesByStatusContainer>
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Reports" subModule="Quotations" />
                    </Grid>
                </Grid>
                <QuotesByStatusFilters
                    onQuotesByStatusInput={this._onQuotesByStatusInput}
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
                />
                <Tabs value={activeTab} >
                    <Tab 
                        value="REPORT" 
                        label="Report" 
                        onClick={() => this.props.setQuotesByStatusState({ activeTab: 'REPORT' })} 
                        style={{ color:'green', minWidth:80, fontWeight: 600 }} 
                    />
                    <Tab 
                        value="STATUS" 
                        label="Status" 
                        onClick={() => this.props.setQuotesByStatusState({ activeTab: 'STATUS' })} 
                        style={{ color:'red', minWidth:80, fontWeight: 600 }} 
                    />
                </Tabs>
               
                { loading ? <CenteredLoadingDialog />
                    :<Grid container>
                        {activeTab === 'STATUS' &&
                            <>
                                <Grid container xs={12}>
                                    <Grid item xs={3} style={{ padding:"5px" }}>
                                        <RepnotesInput
                                            id="repnotes-view-type"
                                            type="select"
                                            label="View Type"
                                            labelPosition="top"
                                            value={filterSelectedViewType}
                                            options={map(["Count", "Dollar"], (n) => ({
                                                id: n,
                                                name: n
                                            }))}
                                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                                this._onQuotesByStatusInput('filterSelectedViewType', e.target.value as string)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Typography variant="h6" style={{ fontWeight: 550, marginBottom: 15, marginTop: 8 }}>Summary Total</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <QuotesByStatusStatues
                                        closeLost={summaryCloseLost}
                                        withdraw={summaryWithdraw}
                                        openQuotes={summaryOpenQuotes}
                                        closeWon={summaryCloseWon}
                                        viewType={filterSelectedViewType}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ height: 300, marginTop: 16 }}>
                                    <QuotesByStatusGraph
                                        data={['Open Quotes', 'Close Lost', 'Close Won', 'Withdraw']} 
                                        colors={COLOR_LIST}
                                        values={[summaryOpenQuotes, summaryCloseLost, summaryCloseWon, summaryWithdraw]}
                                    />
                                </Grid>
                            </>
                        }
                        {activeTab === 'REPORT' && 
                            <Grid item xs={12} style={{ height: 300 }}>
                                <QuotesByStatusReport
                                    data={report} 
                                />
                            </Grid>
                        }
                    </Grid>
                }
            </QuotesByStatusContainer>
        )
    }
}

const mapStateToProps = (state: AppState) => ({
    quotesByStatusState: state.quotesByStatusState,
    customerState: state.customerState,
    locationState: state.locationState,
    industryState: state.industryState,
    companyList: state.companyList,
    customerTypeState: state.customerTypeState,
    system: state.system,
    alert: state.alert
});

const mapDispatchToProps = {
    setQuotesByStatusState,
    getCompany,
    getQuoteByStatus,
    resetFilter,
    loadListManagementItems,
    setCustomerState,
    resetReportsState,
    exportQuotesByStatus
};

export default connect(mapStateToProps, mapDispatchToProps)(QuotesByStatus);