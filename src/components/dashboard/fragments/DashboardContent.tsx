/**
 * Filter list for Product Performance - Voice of Customers Report
 */
import { DashboardContentContainer } from '../RepnotesDashboardComponent';

// global
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { ExpandMore } from '@material-ui/icons';

// utils
import { DashboardTable } from './DashboardTable';

interface Column {
    title: string;
    field: string;
    cellStyle?: any; 
    headerStyle?: any;
}

interface DashboardContentProps {
    title: string;
    content: Array<{ [property: string]: string | number }>;
    columns: Array<Column>;
}

const DashboardContent = (props: DashboardContentProps) => {
    const { 
        title, content, columns
    } = props;

    return (
        <DashboardContentContainer container spacing={3}>
             <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                    <Typography>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DashboardTable 
                        columns={columns}
                        data={content}
                    />
                </AccordionDetails>
            </Accordion>
        </DashboardContentContainer>
    )
}

export default DashboardContent;