import {
  DynamicUnmetNeedsInputInterface,
  DynamicUnmetNeedsType,
} from "../../../../../store/report/voiceOfCustomer/unmetNeeds/types";
import { RepnotesTable } from "../../../../common/RepnotesTable";
import Box from "@material-ui/core/Box";
import map from "lodash/map";
import { formatDateForTable } from "../../../../../util/utils";

interface UnmetNeedsReportProps {
  data: Array<DynamicUnmetNeedsInputInterface<DynamicUnmetNeedsType>>;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };
const TABLE_COLUMNS = [
  { field: "dateCreated", title: "Date", cellStyle, headerStyle },
  { field: "name", title: "Customer Name", cellStyle, headerStyle },
  { field: "salesPerson", title: "Salesperson", cellStyle, headerStyle },
  { field: "modelName", title: "Model", cellStyle, headerStyle },
  { field: "productFamily", title: "Product Family", cellStyle, headerStyle },
  { field: "jobsiteRegulationGap", title: "Jobsite Regulation Gap", cellStyle, headerStyle },
  { field: "operatorProtectionGap", title: "Operation Protection Gap", cellStyle, headerStyle },
  { field: "productOperationGap", title: "Product Operation Gap", cellStyle, headerStyle },
  { field: "productCapabilityGap", title: "Product Capability Gap", cellStyle, headerStyle },
  { field: "others", title: "Others", cellStyle, headerStyle },
];

const UnmetNeedsReport = (props: UnmetNeedsReportProps) => {
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
          dateCreated: formatDateForTable(d.dateCreated as string),
          cost: parseFloat(d.cost as string).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          invoiceAmount: parseFloat(d.invoiceAmount as string).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          invoiceQty: parseFloat(d.invoiceAmount as string).toLocaleString(),
        }))}
      />
    </Box>
  );
};

export default UnmetNeedsReport;
