import RepnotesSOGraphicalBar from './RepnotesSalesOpportunitiesBar';
import { RepnotesInput } from '../../common/RepnotesInput';
import { 
    RepnotesVOCCardOpenSO, 
    RepnotesVOCCardLostDealtoDate 
} from '../voiceOfCustomer/RepnotesVOCCard';
import { StatusDetails } from '../../../store/report/salesOpportunities/types';
import { LoadingDialog } from '../../common/RepnotesAlerts';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// utils
import map from 'lodash/map';
import { currencyConverter } from '../../../util/utils';

interface RepnotesSOStatusProps {
    loading: boolean;
    statusData: StatusDetails;
    datePeriod: string;
    viewType: string;
    setDatePeriod: (field: string, value: string) => void;
};

const DATE_PERIOD = [
    { id: 'yeartodate', name: 'Year To Date'},
    { id: 'monthly', name: 'Monthly'}
];

export const RepnotesSOStatusTab = (props: RepnotesSOStatusProps) => {
    return (
            <Grid item>
                <Grid item container spacing = {1}>
                    <Grid item container xs={12}>
                        <Grid item xs={3} style={{ padding:"5px" }}>
                            <RepnotesInput
                                id="repnotes-so-report-period"
                                type="select"
                                label="Date Period"
                                labelPosition="top"
                                firstSelectOption="None"
                                value={props.datePeriod}
                                options={DATE_PERIOD}
                                onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                    props.setDatePeriod('datePeriod', e.target.value as string)
                                }}
                            />
                        </Grid>
                        <Grid item xs={3} style={{ padding:"5px" }}>
                            <RepnotesInput
                                id="repnotes-view-type"
                                type="select"
                                label="View Type"
                                labelPosition="top"
                                value={props.viewType}
                                options={map(["Count", "Dollar"], (n) => ({
                                    id: n,
                                    name: n
                                }))}
                                onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                    props.setDatePeriod('viewType', e.target.value as string)
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container>
                    <Typography variant= "h6" style={{fontWeight: 550, paddingBottom:"10px"}}>Summary Total</Typography>
                </Grid>
                { props.loading ? <LoadingDialog /> 
                    :<Grid item container spacing={1} style={{ marginBottom: 8 }}>
                        <Grid item xs={12} sm={2}>
                            <RepnotesVOCCardOpenSO count={(props.viewType === 'Dollar') ? currencyConverter(props.statusData.yearToDate.openSales) : props.statusData.yearToDate.openSales}/>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <RepnotesVOCCardLostDealtoDate count={(props.viewType === 'Dollar') ? currencyConverter(props.statusData.yearToDate.lostDealTodate) : props.statusData.yearToDate.lostDealTodate}/>
                        </Grid>
                    </Grid>
                }
                
                { props.loading ? <LoadingDialog /> : 
                    <Grid container  style={{ height: 300 }}>
                        <RepnotesSOGraphicalBar
                            statusData={props.statusData}
                            datePeriod={props.datePeriod}
                        />
                    </Grid>
                }
            </Grid>
    );
}