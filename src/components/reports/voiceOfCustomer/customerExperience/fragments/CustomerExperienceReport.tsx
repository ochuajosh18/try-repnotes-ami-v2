import {
  DynamicCustomerExperienceInputInterface,
  DynamicCustomerExperienceType,
} from "../../../../../store/report/voiceOfCustomer/customerExperience/types";
import { RepnotesTable } from "../../../../common/RepnotesTable";
import Box from "@material-ui/core/Box";
import map from "lodash/map";
import { formatDateForTable } from "../../../../../util/utils";

interface CustomerExperienceReportProps {
  data: Array<DynamicCustomerExperienceInputInterface<DynamicCustomerExperienceType>>;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };
const TABLE_COLUMNS = [
  { field: "dateCreated", title: "Date", cellStyle, headerStyle },
  { field: "name", title: "Customer Name", cellStyle, headerStyle },
  { field: "salesPerson", title: "Salesperson", cellStyle, headerStyle },
  { field: "rating", title: "Rating", cellStyle, headerStyle },
  { field: "subArea", title: "Sub Area", cellStyle, headerStyle },
  { field: "comment", title: "Comment", cellStyle, headerStyle },
];

const CustomerExperienceReport = (props: CustomerExperienceReportProps) => {
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

export default CustomerExperienceReport;
