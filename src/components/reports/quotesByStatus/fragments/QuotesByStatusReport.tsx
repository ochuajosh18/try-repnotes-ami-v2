import {
  DynamicQuotesByStatusInputInterface,
  DynamicQuotesByStatusType,
} from "../../../../store/report/quotesByStatus/types";
import { RepnotesTable } from "../../../common/RepnotesTable";
import Box from "@material-ui/core/Box";
import map from "lodash/map";
import { formatDateForTable } from "../../../../util/utils";

interface QuotesByStatusReportProps {
  data: Array<DynamicQuotesByStatusInputInterface<DynamicQuotesByStatusType>>;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };
const TABLE_COLUMNS = [
  { field: "dateCreated", title: "Date", cellStyle, headerStyle },
  { field: "name", title: "Customer Name", cellStyle, headerStyle },
  { field: "salesRep", title: "Salesperson", cellStyle, headerStyle },
  { field: "productName", title: "Model", cellStyle, headerStyle },
  { field: "status", title: "Status", cellStyle, headerStyle },
  { field: "price", title: "Price", cellStyle, headerStyle },
  { field: "quantity", title: "QTY", cellStyle, headerStyle },
  { field: "totalAmount", title: "Total Amount", cellStyle, headerStyle },
];

const QuotesByStatusReport = (props: QuotesByStatusReportProps) => {
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
          dateCreated: formatDateForTable(d.dateCreated as string),
          price: parseFloat(d.price as string).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          quantity: parseFloat(d.quantity as string).toLocaleString(),
          totalAmount: parseFloat(d.totalAmount as string).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
        }))}
      />
    </Box>
  );
};

export default QuotesByStatusReport;
