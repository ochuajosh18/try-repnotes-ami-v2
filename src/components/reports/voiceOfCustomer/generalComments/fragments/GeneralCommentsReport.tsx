import {
  DynamicGeneralCommentsInputInterface,
  DynamicGeneralCommentsType,
} from "../../../../../store/report/voiceOfCustomer/generalComments/types";
import { RepnotesTable } from "../../../../common/RepnotesTable";
import Box from "@material-ui/core/Box";
import map from "lodash/map";
import { formatDateForTable } from "../../../../../util/utils";
interface GeneralCommentsReportProps {
  data: Array<DynamicGeneralCommentsInputInterface<DynamicGeneralCommentsType>>;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };
const TABLE_COLUMNS = [
  { field: "dateCreated", title: "Date", cellStyle, headerStyle },
  { field: "name", title: "Customer Name", cellStyle, headerStyle },
  { field: "salesPerson", title: "Salesperson", cellStyle, headerStyle },
  { field: "projectPipeline", title: "Project Pipeline", cellStyle, headerStyle },
  { field: "customerBusiness", title: "Customer Business", cellStyle, headerStyle },
  { field: "macroBusinessClimate", title: "Macro Business Climate", cellStyle, headerStyle },
];

const GeneralCommentsReport = (props: GeneralCommentsReportProps) => {
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
        }))}
      />
    </Box>
  );
};

export default GeneralCommentsReport;
