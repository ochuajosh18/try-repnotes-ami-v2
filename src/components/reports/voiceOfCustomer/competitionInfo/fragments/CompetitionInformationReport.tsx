import {
  DynamicCompetitionInformationInterface,
  DynamicCompetitionInformationType,
} from "../../../../../store/report/voiceOfCustomer/competitionInfo/types";
import { RepnotesTable } from "../../../../common/RepnotesTable";
import Box from "@material-ui/core/Box";
import map from "lodash/map";
import { formatDateForTable } from "../../../../../util/utils";
interface CompetitionInformationReportProps {
  data: Array<DynamicCompetitionInformationInterface<DynamicCompetitionInformationType>>;
}

const cellStyle = { textAlign: "left", wordBreak: "break-all", fontSize: 12 };
const headerStyle = { textAlign: "left" };
const TABLE_COLUMNS = [
  { field: "dateCreated", title: "Date", cellStyle, headerStyle },
  { field: "name", title: "Customer Name", cellStyle, headerStyle },
  { field: "salesPerson", title: "Salesperson", cellStyle, headerStyle },
  { field: "paymentTerms", title: "Payment Terms", cellStyle, headerStyle },
  { field: "extendedWarranty", title: "Extended Warranty", cellStyle, headerStyle },
  { field: "financing", title: "Financing", cellStyle, headerStyle },
  { field: "others", title: "Others", cellStyle, headerStyle },
  { field: "zeroDownPayment", title: "Zero Down Payment", cellStyle, headerStyle },
  { field: "partsAndServicePackage", title: "Parts And Service Package", cellStyle, headerStyle },
  { field: "price", title: "Price", cellStyle, headerStyle },
  { field: "incoTerms", title: "Inco Terms", cellStyle, headerStyle },
  { field: "specialCondition", title: "Special Conditions", cellStyle, headerStyle },
  { field: "specialPromo", title: "Special Promo", cellStyle, headerStyle },
  { field: "termsOthers", title: "Terms Others", cellStyle, headerStyle },
  { field: "productIntroduction", title: "Product Introduction", cellStyle, headerStyle },
];

const CompetitionInformationReport = (props: CompetitionInformationReportProps) => {
  return (
    <Box marginTop='8px'>
      <RepnotesTable
        columns={TABLE_COLUMNS}
        custom={true}
        companyFilter={(value: string) => {}}
        companyValidation={() => {}}
        onDialogOpen={() => {}}
        tableHeaderMaxWidth={50}
        data={map(props.data, (d) => ({
          ...d,
          dateCreated: formatDateForTable(d.dateCreated as string),
          price: parseFloat(d.price as string).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
        }))}
      />
    </Box>
  );
};

export default CompetitionInformationReport;
