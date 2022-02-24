import { DynamicActualToTargetType, ProvinceDetails } from '../../../../store/report/actualToTarget/types';
import { 
    ActualToTargetReportFilterGridContainer, 
    ActualToTargetReportFiltersContainer 
} from './ActualToTargetComponents';
import { RepnotesInput } from '../../../common/RepnotesInput';
import { ActualToTargetTable } from './ActualToTargetTable';
import Box from '@material-ui/core/Box';

// utils
import map from 'lodash/map';

interface ActualToTargetReportsProps {
    salesReport: Array<{ [property: string]: string | number }>;
    gapData: Array<number>;
    filterSelectedStartQuarter: string;
    filterSelectedEndQuarter: string;
    provinces: Array<ProvinceDetails>;
    filterSelectedProvince: string;
    viewType: string;
    onActualToTargetInput: (field: string, value: DynamicActualToTargetType) => void;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const salesHeaderStyle = { textAlign: 'left', backgroundColor: '#fec000' };
const blueHeaderStyle = { textAlign: 'left', backgroundColor: '#4472c4' };
const greenHeaderStyle = { textAlign: 'left', backgroundColor: '#70ad47' };
const grayHeaderStyle = { textAlign: 'left', backgroundColor: '#a5a5a5' };

const SALES_REPORTS_COLUMNS = [
    { title: '', field: 'name', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Jan', field: 'january', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Feb', field: 'february', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Mar', field: 'march', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Apr', field: 'april', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'May', field: 'may', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Jun', field: 'june', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Jul', field: 'july', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Aug', field: 'august', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Sept', field: 'september', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Oct', field: 'october', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Nov', field: 'november', cellStyle, headerStyle: salesHeaderStyle },
    { title: 'Dec', field: 'december', cellStyle, headerStyle: salesHeaderStyle }
]

const YTD_COLUMNS = [
    { title: 'YTD', field: 'ytd', cellStyle, headerStyle: blueHeaderStyle }, 
    { title: 'FY', field: 'fy', cellStyle, headerStyle: grayHeaderStyle }
]

const QTD_COLUMN = [
    { title: 'QTD', field: 'qtd', cellStyle, headerStyle: greenHeaderStyle }
]

const ActualToTargetReports = (props: ActualToTargetReportsProps) => {
    return (
        <Box boxSizing="border-box" padding="8px">
            <ActualToTargetReportFiltersContainer container spacing={2}>
                <ActualToTargetReportFilterGridContainer xs={2}>
                    <RepnotesInput
                        id="repnotes-province-selection"
                        type="searchabledropdown"
                        label="Province"
                        labelPosition="top"
                        value={props.filterSelectedProvince}
                        autocompleteOptions={map(props.provinces, (f) => ({ label: f.area, value: f.area }))}
                        onAutocompleteChange={(e, o) => {
                            props.onActualToTargetInput('filterSelectedProvince', o ? o.value : '');
                        }}
                        disableAutocompletePopover={true}
                    />
                </ActualToTargetReportFilterGridContainer>
                {props.viewType === "QTD" &&
                    <ActualToTargetReportFilterGridContainer xs={2}>
                        <RepnotesInput
                            id="repnotes-graphy-type-selection"
                            type="select"
                            label="From"
                            labelPosition="top"
                            firstSelectOption="None"
                            value={props.filterSelectedStartQuarter}
                            options={map(['Q1', 'Q2', 'Q3', 'Q4'], (t) => ({
                                id: t,
                                name: t
                            }))}
                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                props.onActualToTargetInput('filterSelectedStartQuarter', e.target.value as string)
                            }}
                        />
                    </ActualToTargetReportFilterGridContainer>
                }
                {props.viewType === "QTD" &&
                    <ActualToTargetReportFilterGridContainer xs={2}>
                        <RepnotesInput
                            id="repnotes-graphy-type-selection"
                            type="select"
                            label="To"
                            labelPosition="top"
                            firstSelectOption="None"
                            value={props.filterSelectedEndQuarter}
                            options={map(['Q1', 'Q2', 'Q3', 'Q4'], (t) => ({
                                id: t,
                                name: t
                            }))}
                            onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown}>) => {
                                props.onActualToTargetInput('filterSelectedEndQuarter', e.target.value as string)
                            }}
                        />
                    </ActualToTargetReportFilterGridContainer>
                }
            </ActualToTargetReportFiltersContainer>
            <Box fontSize="18px" fontWeight="bold" paddingBottom={2}>Sales Report</Box>
            <ActualToTargetTable 
                columns={(props.viewType === "QTD") ? [...SALES_REPORTS_COLUMNS, ...QTD_COLUMN] : [...SALES_REPORTS_COLUMNS, ...YTD_COLUMNS]}
                gapData={props.gapData}
                data={props.salesReport}
            />
        </Box>
    )
}

export default ActualToTargetReports;