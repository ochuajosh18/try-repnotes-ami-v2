import {
  DynamicVisitsCompletedInputInterface,
  DynamicVisitsCompletedType,
} from "../../../../../store/report/customerTouchpoint/visitsCompleted/types";
import { RepnotesTable } from "../../../../common/RepnotesTable";
import Box from "@material-ui/core/Box";
import map from "lodash/map";
import moment from "moment";
import { formatDateForTable } from "../../../../../util/utils";

interface VisitsCompletedReportProps {
  data: Array<DynamicVisitsCompletedInputInterface<DynamicVisitsCompletedType>>;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };
const TABLE_COLUMNS = [
  { field: "start_date", title: "Date", cellStyle, headerStyle },
  { field: "purpose", title: "Purpose", cellStyle, headerStyle },
  { field: "customer_name", title: "Customer Name", cellStyle, headerStyle },
  { field: "sales_rep", title: "Salesperson", cellStyle, headerStyle },
  { field: "date_created", title: "Date Created", cellStyle, headerStyle },
  { field: "month_year", title: "Month Year", cellStyle, headerStyle },
  { field: "week", title: "Week", cellStyle, headerStyle },
  { field: "status", title: "Status", cellStyle, headerStyle },
];

const VisitsCompletedReport = (props: VisitsCompletedReportProps) => {
  return (
    <Box marginTop='8px'>
      <RepnotesTable
        columns={TABLE_COLUMNS}
        custom={true}
        companyFilter={(value: string) => {}}
        companyValidation={() => {}}
        onDialogOpen={() => {}}
        data={map(props.data, (d) => ({
          ...d,
          start_date: formatDateForTable(d.start_date as string),
          date_created: formatDateForTable(d.date_created as string),
          month_year: moment(d.month_year as string).format("MMMM[-]YYYY"),
          week: moment(d.date_created as string).format("WW"),
        }))}
      />
    </Box>
  );
};

export default VisitsCompletedReport;
