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
import { CompanyState } from '../../../../store/listManagement/company/types';
import { DynamicGeneralCommentsType, GeneralCommentsState } from '../../../../store/report/voiceOfCustomer/generalComments/types';
import { getCompany } from '../../../../store/listManagement/company/actions';
import { loadListManagementItems, setRedirect, resetReportsState } from '../../../../store/system/actions';
import { setCustomerState } from '../../../../store/customerManagement/customer/actions';
import { 
    getGeneralComments,
    setGeneralCommentsState,
    exportGeneralComments,
    resetFilter
} from '../../../../store/report/voiceOfCustomer/generalComments/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../../common/RepnotesContentHeader';
import {  LoadingDialog } from '../../../common/RepnotesAlerts';
import RepnotesGraphicalBar from './RepnotesGeneralCommentsBar';
import { RepnotesGeneralCommentsFilter } from './RepnotesGeneralCommentsFilter';
import { 
    RepnotesVOCCardMacroClimate, 
    RepnotesVOCCardCustomerBusiness, 
    RepnotesVOCCardProjectPipeline 
} from '../RepnotesVOCCard';
import { RepnotesInput } from '../../../common/RepnotesInput';
import { RepnotesPrimaryButton } from '../../../common/RepnotesButton';
import GeneralCommentsReport from './fragments/GeneralCommentsReport';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// utils
import forEach from 'lodash/forEach'
import map from 'lodash/map'
import Export from '../../../../assets/images/export.png';

// constants
const LIST_ITEMS: Array<ListItem> = ['Salesperson', 'Location', 'Industry', 'Customer Type', 'Customer'];

interface CategoryProps {
    setGeneralCommentsState: typeof setGeneralCommentsState;
    exportGeneralComments: typeof exportGeneralComments;
    setCustomerState: typeof setCustomerState;
    setRedirect: typeof setRedirect;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    resetFilter: typeof resetFilter;
    getCompany: typeof getCompany;
    getGeneralComments: typeof getGeneralComments;
    loadListManagementItems: typeof loadListManagementItems;
    resetReportsState: typeof resetReportsState;
    companyList: CompanyState;
    generalCommentsState: GeneralCommentsState;
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
        this.props.getCompany(this.props.system.session.token);
        this.props.setCustomerState({ salesPersonList: [], customerList: [] });
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    componentWillUnmount = () => this.props.resetReportsState();

    _validateRole = () => {
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') this._generalCommentsFilter('selectedCompanyId', this.props.system.session.userDetails.companyId as string);
        this._loadTable();
    } 

    _loadTable = () => {
        if(this.props.generalCommentsState.selectedCompanyId){
            this.props.loadListManagementItems(LIST_ITEMS, this.props.generalCommentsState.selectedCompanyId)
        }
    }

    // on component input in dynamic form
    _generalCommentsFilter = (field: string, value: DynamicGeneralCommentsType) => {
        this.props.setGeneralCommentsState({ [field]: value }); // magic setstate
        // on filter input, trigger view below
        if(field === "selectedCompanyId"){
            this.props.resetFilter(["salesPersonDocId", "province", "industryId", "customerTypeId", "customerId"])
            this.props.loadListManagementItems(LIST_ITEMS, value as string)
        }
        this.props.getGeneralComments();
    }

    _onExportClick = () => {
        if (this.props.generalCommentsState.selectedCompanyId) this.props.exportGeneralComments();
    }

    render = () => {
        const { selectedCompanyId, loading, salesPersonDocId, province, report, activeTab, customerTypeId, industryId, generalComments, customerId } = this.props.generalCommentsState;
        const { salesPersonList, customerList } = this.props.customerState;
        const { locationList } = this.props.locationState;
        const { customerTypeList } = this.props.customerTypeState;
        const { industryList } = this.props.industryState;
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
                    <Grid item xs={12} style={{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Reports" subModule="Voice of Customer" secondSubModule="General Comments" />
                    </Grid>
                </Grid>

                <Grid container style={{ padding:'20px 5px' }} spacing={2} >
                    <Grid container spacing={1}>
                        {   userDetails.role === 'SUPER ADMIN' && 
                            <Grid item xs={2} style={{ padding:"0 5px" }}>
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
                                        this._generalCommentsFilter('selectedCompanyId', e.target.value as string);
                                    }}
                                />
                            </Grid>
                        }
                        {role !== 'sales engineer' &&
                            <Grid item xs={2} style={{ padding:"0 5px" }}>
                                <RepnotesInput
                                    id="repnotes-salesperson-selection"
                                    type="searchabledropdown"
                                    label="Salesperson"
                                    labelPosition="top"
                                    value={salesPersonDocId}
                                    autocompleteOptions={map(salesPersonList, (f) => ({ label: f.name, value: f.id }))}
                                    onAutocompleteChange={(e, o) => {
                                        this._generalCommentsFilter('salesPersonDocId', o ? o.value : '');
                                    }}
                                    disableAutocompletePopover={true}
                                />
                            </Grid>
                        }
                        <Grid item xs={2} style={{ padding:"0 5px" }}>
                            <RepnotesInput
                                id="repnotes-customer-status"
                                type="searchabledropdown"
                                label="Province"
                                labelPosition="top"
                                value={province}
                                autocompleteOptions={map(locationDataList, (f) => ({ label: f.province, value: f.province }))}
                                onAutocompleteChange={(e, o) => {
                                    this._generalCommentsFilter('province', o ? o.value : '');
                                }}
                                disableAutocompletePopover={true}
                            />
                        </Grid>
                        <Grid item xs={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <Box width="100px">
                                <RepnotesGeneralCommentsFilter 
                                    generalCommentsFilter={this._generalCommentsFilter}
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
                                style={{ height: 36, alignSelf: 'unset', width: 100, boxSizing: 'border-box'}}
                                onClick={this._onExportClick}
                            >
                                    Export
                            </RepnotesPrimaryButton>
                        </Grid>
                        <Grid item xs={4} style={{padding:"0 5px"}} />
                    </Grid>
                </Grid>
                <Tabs value={activeTab} TabIndicatorProps={{ style: { height: 3 } }} >
                    <Tab 
                        value="REPORT" 
                        label="Report" 
                        onClick={() => this.props.setGeneralCommentsState({ activeTab: 'REPORT' })} 
                        style={{ color:'green', minWidth:80, fontWeight: 600 }} 
                    />
                    <Tab 
                        value="STATUS" 
                        label="Status" 
                        onClick={() => this.props.setGeneralCommentsState({ activeTab: 'STATUS' })} 
                        style={{ color:'red', minWidth:80, fontWeight: 600 }} 
                    />
                </Tabs>
                {activeTab === 'REPORT' &&
                    <>
                        {loading ? <LoadingDialog /> :
                            <GeneralCommentsReport
                                data={report}
                            />
                        }
                    </>
                }
                {activeTab === 'STATUS' &&
                    <>
                        <Grid container >
                            <Typography variant="h6" style={{ fontWeight: 550,  paddingBottom:"15px" }}>Summary Total</Typography>
                        </Grid>
                        { loading ? <LoadingDialog />
                            :<Grid item>
                                <Grid item container spacing = {1}>
                                    <Grid item xs={12} sm= {2}>
                                        <RepnotesVOCCardProjectPipeline count={generalComments.projectPipeline}></RepnotesVOCCardProjectPipeline>
                                    </Grid>
                                    <Grid item xs={12} sm= {2}>
                                        <RepnotesVOCCardCustomerBusiness count={generalComments.customerBusiness}></RepnotesVOCCardCustomerBusiness>
                                    </Grid>
                                    <Grid item xs={12} sm= {2}>
                                        <RepnotesVOCCardMacroClimate count={generalComments.macroBusinessClimate}></RepnotesVOCCardMacroClimate>
                                    </Grid>
                                </Grid>
                                <Grid container  style={{ height:'230px' }}>
                                    <RepnotesGraphicalBar
                                        projectPipeline={generalComments.projectPipeline}
                                        customerBusiness={generalComments.customerBusiness}
                                        macroBusinessClimate={generalComments.macroBusinessClimate}
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
    generalCommentsState: state.generalCommentsState,
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
    setRedirect,
    clearDialog,
    resetFilter,
    getCompany,
    setDialogOpen,
    getGeneralComments,
    loadListManagementItems,
    resetReportsState,
    setCustomerState,
    exportGeneralComments,
    setGeneralCommentsState
})(RepnotesCompetitionInfo);