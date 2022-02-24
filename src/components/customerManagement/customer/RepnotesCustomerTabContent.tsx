import { RepnotesTable } from '../../common/RepnotesTable';
import Box from '@material-ui/core/Box';
import { Permissions } from '../../../store/system/types';

interface TabPanelProps {
    index: number;
    value: number;
    data: Array<{ [property: string]: string | number }>;
    onDialogOpen: (id: string | number, name: string | number, type: string ) => void;
    type?: string;
    permission?: Permissions;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };
const TABLE_COLUMNS = [
    { field: 'customerId', title: 'Customer ID', cellStyle, headerStyle},
    { field: 'name', title: 'Name', cellStyle, headerStyle},
    { field: 'salesPerson', title: 'Sales Person', cellStyle, headerStyle},
    { field: 'category', title: 'Category', cellStyle, headerStyle},
    { field: 'isActive', title: 'Status', cellStyle, headerStyle},
    { field: 'dateCreated', title: 'Date Created', cellStyle, headerStyle},
    { field: 'dateUpdated', title: 'Date Updated', cellStyle, headerStyle},
    { field: 'action', title: 'Actions', cellStyle, headerStyle}
];

const PENDING_TABLE_COLUMNS = [
    { field: 'name', title: 'Name', cellStyle, headerStyle},
    { field: 'salesPerson', title: 'Sales Person', cellStyle, headerStyle},
    { field: 'category', title: 'Category', cellStyle, headerStyle},
    { field: 'isActive', title: 'Status', cellStyle, headerStyle},
    { field: 'dateCreated', title: 'Date Created', cellStyle, headerStyle},
    { field: 'dateUpdated', title: 'Date Updated', cellStyle, headerStyle},
    { field: 'action', title: 'Actions', cellStyle, headerStyle}
];

export const RepnotesTabPanel = (props: TabPanelProps) => {
    const { value, index, type, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`repnotes-customer-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {(!type && value === index) ?
                <Box style={{padding:"10px 0px"}}>
                    <RepnotesTable
                        custom={true}
                        type={props.type}
                        link="customer"
                        companyFilter={( value: string ) => {}}
                        companyValidation={() =>{}}
                        columns={TABLE_COLUMNS}
                        data={props.data}
                        onDialogOpen={props.onDialogOpen}
                        permission={props.permission}
                    />
                </Box>
                :
                <Box style={{padding:"10px 0px"}}>
                    <RepnotesTable
                        custom={true}
                        type={props.type}
                        link="customer"
                        companyFilter={( value: string ) => {}}
                        companyValidation={() =>{}}
                        columns={PENDING_TABLE_COLUMNS}
                        data={props.data}
                        onDialogOpen={props.onDialogOpen}
                        permission={props.permission}
                    />
                </Box>
            }
        </Box>
    );
}