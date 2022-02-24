import React from "react";
import { RepnotesTable } from '../../common/RepnotesTable';
import { RepnotesInput } from '../../common/RepnotesInput';
import { RepnotesDateRange } from './RepnotesSalesOpportunitiesDateRange';
import { CenteredLoadingDialog } from "../../common/RepnotesAlerts";
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import map from 'lodash/map';
import moment from 'moment'

interface RepnotesSalesOpportunityReportProps {
    loading: boolean;
    tableData: Array<{ [property: string]: string | number }>;
    startDate: string;
    endDate: string;
    type?: string;
    dateRange: (startDate: string, endDate: string) => void;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };
const TABLE_COLUMNS = [
    { field: 'dateCreated', title: 'Date', cellStyle, headerStyle},
    { field: 'customerName', title: 'Customer Name', cellStyle, headerStyle},
    { field: 'salesPerson', title: 'Salesperson', cellStyle, headerStyle},
    { field: 'model', title: 'Model', cellStyle, headerStyle},
    { field: 'status', title: 'Status', cellStyle, headerStyle},
    { field: 'price', title: 'Price', cellStyle, headerStyle},
    { field: 'quantity', title: 'QTY', cellStyle, headerStyle},
    { field: 'totalAmount', title: 'Total Amount', cellStyle, headerStyle},
];

export const RepnotesSalesOpportunityReport = (props: RepnotesSalesOpportunityReportProps) => {
    const [openDateRange, setOpenDateRange] = React.useState(false);

    const handleClick = () => {
        setOpenDateRange(openDateRange?false:true);
    };

    return (
        <Box style={{ padding: '10px 0' }}>
            <Grid container >
                <Grid item xs={3} style={{ padding: '0 5px' }}>
                <RepnotesInput
                    id="repnotes-so-report-date-ranges"
                    type="daterange"
                    label="Date Range"
                    labelPosition="top"
                    disabled={false}
                    firstSelectOption="None"
                    value={`${props.startDate} - ${props.endDate}`}
                    onClickDate={handleClick}
                />
                <RepnotesDateRange  
                    dateRange={props.dateRange}
                    handleClickOpenDateRange={handleClick}
                    isOpen={openDateRange}
                />
                    
                </Grid>
            </Grid>
            { props.loading ? <CenteredLoadingDialog />
                : <RepnotesTable
                    custom={true}
                    type={props.type}
                    link="report-so"
                    companyFilter={( value: string ) => {}}
                    companyValidation={( ) => {}}
                    columns={TABLE_COLUMNS}
                    data={map(props.tableData, (data) => ({
                        ...data,
                        dateUpdated: data.dateUpdated ? moment(data.dateCreated).format('MMMM D, YYYY') : '',
                        price: data.price.toLocaleString(undefined, { minimumFractionDigits: 2 }),
                        qty: data.price.toLocaleString()
                    }))} 
                    onDialogOpen={(id: string | number, name: string | number, type: string | number ) => {}}
                />
            }
        </Box>
    );
}