import { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { SystemState } from '../../../store/system/types';
import { DialogState } from '../../../store/dialog/types';
// import { AlertState } from '../../../store/alert/types';
import { CompanyState } from '../../../store/listManagement/company/types';
import { getCompany } from '../../../store/listManagement/company/actions';
import { superAdminCompanyValidation } from '../../../store/userManagement/user/actions';
import { PromotionState } from '../../../store/productManagement/promotion/types';
import { 
    deletePromotion, 
    getPromotionList, 
    setPromotionCompanyFilter,
    setPromotionState
} from '../../../store/productManagement/promotion/actions';
import { setRedirect } from '../../../store/system/actions';
import { 
    clearDialog, 
    setDialogOpen 
} from '../../../store/dialog/actions';
import { RepnotesContentHeader } from '../../common/RepnotesContentHeader';
import { RepnotesTable } from '../../common/RepnotesTable';
import { 
    LoadingDialog, 
    // RepnotesAlert, 
    RepnotesDialog
} from '../../common/RepnotesAlerts';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import map from 'lodash/map'
import moment from 'moment';

interface RepnotesPromotionProps {
    setPromotionState: typeof setPromotionState;
    setRedirect: typeof setRedirect;
    getPromotionList: typeof getPromotionList;
    deletePromotion: typeof deletePromotion;
    clearDialog: typeof clearDialog;
    setDialogOpen: typeof setDialogOpen;
    getCompany: typeof getCompany;
    superAdminCompanyValidation: typeof superAdminCompanyValidation;
    setPromotionCompanyFilter: typeof setPromotionCompanyFilter;
    companyList: CompanyState;
    promotionState: PromotionState;
    system: SystemState;
    // alert: AlertState;
    dialog: DialogState;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const TABLE_COLUMNS = [
    { field: 'name', title: 'Promo Name', cellStyle, headerStyle},
    { field: 'dateRange', title: 'Promo Validity Date', cellStyle, headerStyle},
    { field: 'isActive', title: 'Status', cellStyle, headerStyle},
    { field: 'dateCreated', title: 'Date Created', cellStyle, headerStyle},
    { field: 'dateUpdated', title: 'Date Updated', cellStyle, headerStyle},
    { field: 'action', title: 'Action', cellStyle, headerStyle}
];

class RepnotePromotion extends Component<RepnotesPromotionProps> {

    componentDidMount = () => {
        const isFromCrud = this.props.system.redirectPage.redirectTo === '/promotion';
        this.props.setPromotionState({ 
            selectedCompanyId: isFromCrud ? this.props.promotionState.selectedCompanyId : '', 
            promotionList: [] 
        });
        this._validateRole();
        this._loadOptions();
        if(isFromCrud) this._loadTable(this.props.promotionState.selectedCompanyId);
        this.props.setRedirect({
            shallRedirect: false,
            redirectTo: ''
        })
    }

    _validateRole = () => {
        if(this.props.system.session.userDetails.role !== 'SUPER ADMIN') {
            this.props.setPromotionCompanyFilter({ selectedCompanyId: this.props.system.session.userDetails.companyId as string} );
            this._loadTable(this.props.system.session.userDetails.companyId as string);
        }
    } 

    _loadTable = (companyId?: string) => {
        if(this.props.promotionState.selectedCompanyId || companyId){
            this.props.getPromotionList(this.props.system, companyId ? companyId : this.props.promotionState.selectedCompanyId );
        }
    }

    _loadOptions = () => {
        this.props.getCompany(this.props.system.session.token); 
    }

    _onDialogOpen = (id: string | number, name: string | number) => {
        this.props.setDialogOpen({ dialogOpen: true, dialogLabel: name, dialogType: 'delete', docId: id })
    }

    _deletePromotion = async() => {
        this.props.deletePromotion(this.props.dialog.docId, this.props.system.session.token);
        this.props.clearDialog();
        await this._loadTable();
    }

    _companyFilter = async(value: string ) => {
        await this.props.setPromotionCompanyFilter({selectedCompanyId: value as string});
        this._loadTable(); 
    }

    _companyValidation = () =>{
        this.props.superAdminCompanyValidation();
    }

    render = () => {
        const { userDetails, modules } = this.props.system.session;
        const { promotionList, loading, selectedCompanyId } = this.props.promotionState;
        const { companyArray } = this.props.companyList;

        let filteredCompanyList = companyArray.filter(item => item.isActive);

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
                    onClick={this._deletePromotion.bind(this)}
                    onClear={this.props.clearDialog}
                />
                <Grid container>
                    <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '10px 0px' }}>
                        <RepnotesContentHeader moduleName="Product Management" subModule="Promotion" />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        { loading ? <LoadingDialog />
                            :<RepnotesTable
                                link="promotion"
                                role={userDetails.role as string}
                                companyList={filteredCompanyList}
                                companyFilter={this._companyFilter}
                                companyValidation={this._companyValidation}
                                selectedCompany={selectedCompanyId}
                                columns={TABLE_COLUMNS}
                                data={map(promotionList, (data) => ({
                                    ...data,
                                    dateRange: (data.startDate && data.endDate) ? `${moment(data.startDate).format('MMMM D, YYYY')} - ${moment(data.endDate).format('MMMM D, YYYY')}` : '',
                                    dateCreated: data.dateCreated ? moment(data.dateCreated as string).format('MMMM D, YYYY') : '',
                                    dateUpdated: data.dateUpdated ? moment(data.dateUpdated as string).format('MMMM D, YYYY') : ''
                                })) as Array<{}>}
                                onDialogOpen={this._onDialogOpen}
                                permission={modules.promotion}
                            />
                        }
                    </Grid>
                </Grid>
            </Box>
        )
    }
}

export const mapStateToProps = (state: AppState) => ({
    system: state.system,
    // alert: state.alert,
    promotionState: state.promotionState,
    companyList: state.companyList,
    dialog: state.dialog
})

export default connect(mapStateToProps, {
    getPromotionList,
    setRedirect,
    deletePromotion,
    clearDialog,
    setDialogOpen,
    getCompany,
    setPromotionCompanyFilter,
    superAdminCompanyValidation,
    setPromotionState
})(RepnotePromotion);
