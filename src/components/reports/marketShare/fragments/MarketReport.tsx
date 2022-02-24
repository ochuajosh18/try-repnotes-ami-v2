import { DynamicMarketReportInputInterface, DynamicMarketReportType } from '../../../../store/report/marketReport/types';
import { RepnotesTable } from '../../../common/RepnotesTable';
import Box from '@material-ui/core/Box';
import map from 'lodash/map';

interface MarketReportProps {
    data: Array<DynamicMarketReportInputInterface<DynamicMarketReportType>>;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };
const TABLE_COLUMNS = [
    { field: 'period', title: 'Period', cellStyle, headerStyle },
    { field: 'salesman', title: 'Salesperson', cellStyle, headerStyle },
    { field: 'productFamily', title: 'Product Family', cellStyle, headerStyle },
    { field: 'marketSize', title: 'Market Size', cellStyle, headerStyle },
    { field: 'unitSales', title: 'Unit Sales', cellStyle, headerStyle },
];

const MarketReport = (props: MarketReportProps) => {
    return  (
        <Box marginTop="8px">
            <RepnotesTable
                columns={TABLE_COLUMNS}
                custom={true}
                companyFilter={( value: string ) => {}}
                companyValidation={() => {}}
                onDialogOpen={() => {}}
                data={map(props.data, (d) => ({
                    ...d,
                    marketSize: parseFloat(d.marketSize as string).toLocaleString(),
                    unitSales: parseFloat(d.unitSales as string).toLocaleString()
                }))}
            />
        </Box>
    )
}

export default MarketReport