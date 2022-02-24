import {
  DynamicProductQualityInputInterface,
  DynamicProductQualityType,
} from "../../../../../store/report/voiceOfCustomer/productQuality/types";
import { RepnotesTable } from "../../../../common/RepnotesTable";
import Box from "@material-ui/core/Box";
import map from "lodash/map";
import { formatDateForTable } from "../../../../../util/utils";
interface ProductQualityReportProps {
  data: Array<DynamicProductQualityInputInterface<DynamicProductQualityType>>;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };
const TABLE_COLUMNS = [
  { field: "dateCreated", title: "Date", cellStyle, headerStyle },
  { field: "name", title: "Customer Name", cellStyle, headerStyle },
  { field: "salesPerson", title: "Salesperson", cellStyle, headerStyle },
  { field: "modelName", title: "Model", cellStyle, headerStyle },
  { field: "productFamily", title: "Product Family", cellStyle, headerStyle },
  { field: "manufacturer", title: "Manufacturer", cellStyle, headerStyle },
  { field: "rating", title: "Rating", cellStyle, headerStyle },
  { field: "subArea", title: "Sub Area", cellStyle, headerStyle },
];

const ProductQualityReport = (props: ProductQualityReportProps) => {
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
        }))}
      />
    </Box>
  );
};

export default ProductQualityReport;
