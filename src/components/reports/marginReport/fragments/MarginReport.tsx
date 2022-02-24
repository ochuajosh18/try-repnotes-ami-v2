import {
  DynamicMarginReportInputInterface,
  DynamicMarginReportType,
} from "../../../../store/report/marginReport/types";
import { RepnotesTable } from "../../../common/RepnotesTable";
import Box from "@material-ui/core/Box";
import map from "lodash/map";
import { currencyConverter, formatDateForTable } from "../../../../util/utils";

interface MarginReportProps {
  data: Array<DynamicMarginReportInputInterface<DynamicMarginReportType>>;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };
const TABLE_COLUMNS = [
  { field: "dateCreated", title: "Date", cellStyle, headerStyle },
  {
    field: "country",
    title: "Country",
    cellStyle: { ...cellStyle, width: "48px!important" },
    headerStyle: { ...headerStyle, width: "48px!important" },
  },
  { field: "customer", title: "Customer", cellStyle, headerStyle },
  { field: "salesman", title: "Salesperson", cellStyle, headerStyle },
  { field: "province", title: "Province", cellStyle, headerStyle },
  { field: "model", title: "Model", cellStyle, headerStyle },
  { field: "productFamily", title: "Product Family", cellStyle, headerStyle },
  { field: "invoiceNo", title: "Invoice No.", cellStyle, headerStyle },
  { field: "invoiceQty", title: "Invoice QTY", cellStyle, headerStyle },
  { field: "invoiceAmount", title: "Invoice Amount", cellStyle, headerStyle },
  { field: "cost", title: "Cost", cellStyle, headerStyle },
  { field: "margin", title: "Margin", cellStyle, headerStyle },
];

const MarginReport = (props: MarginReportProps) => {
  return (
    <Box marginTop='8px'>
      <RepnotesTable
        columns={TABLE_COLUMNS}
        custom={true}
        companyFilter={(value: string) => {}}
        companyValidation={() => {}}
        onDialogOpen={() => {}}
        tableHeaderMaxWidth={60}
        data={map(props.data, (d) => ({
          ...d,
          dateCreated: formatDateForTable(d.date as string),
          cost: currencyConverter(parseFloat(d.cost as string)),
          invoiceAmount: currencyConverter(parseFloat(d.invoiceAmount as string)),
          invoiceQty: parseFloat(d.invoiceAmount as string).toLocaleString(),
        }))}
      />
    </Box>
  );
};

export default MarginReport;
