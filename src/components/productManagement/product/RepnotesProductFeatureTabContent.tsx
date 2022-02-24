import { RepnotesFeatureTable } from './RepnotesFeatureTable';
import Box from '@material-ui/core/Box';

interface TabPanelProps {
    index: number;
    value: number;
    data: Array<{ [property: string]: string | number }>;
    onClickDelete: (id: string, type: string) => void;
    onClickEdit: (id: string, type: string) => void;
    type: string;
    disabled?: boolean;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const TABLE_COLUMNS = [
    { field: 'name', title: 'Name', cellStyle, headerStyle},
    { field: 'subFeature', title: 'Sub-Features', cellStyle, headerStyle},
    { field: 'action', title: 'Action', cellStyle, headerStyle}
];

export const RepnotesTabPanel = (props: TabPanelProps) => {
    const { value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`repnotes-product-feature-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box style={{padding:"10px 0px"}}>
                    <RepnotesFeatureTable
                        type={props.type}
                        columns={TABLE_COLUMNS}
                        data={props.data}
                        onClickDelete={props.onClickDelete}
                        onClickEdit={props.onClickEdit}
                        disabled={props.disabled}
                    />
                </Box>
            )}
        </Box>
    );
}