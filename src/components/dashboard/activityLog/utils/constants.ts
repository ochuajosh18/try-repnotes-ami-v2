import moment from "moment";
import { DateRangeType, NotesLog } from "../../../../store/dashboard/types";
import { ReportDetails } from "../../../../store/report/salesOpportunities/types";
import { ListItem } from "../../../../store/system/types";
import { currencyConverter, getAverageRatingAsScore, getNotesLabel } from "../../../../util/utils";

export const salesColumns: TableColumn[] = [
  {
    id: "dateCreated",
    label: "Date",
    property: "dateCreated",
    sortable: true,
    align: "left",
    content: (item: ReportDetails) => moment(item.dateCreated).format("MMMM DD, YYYY"),
  },
  {
    id: "customerName",
    label: "Customer",
    property: "customerName",
    sortable: true,
  },
  {
    id: "soName",
    label: "Sales Opportunity / Quote",
    property: "soName",
    sortable: true,
  },
  {
    id: "model",
    label: "Product",
    property: "model",
    sortable: true,
  },
  {
    id: "quantity",
    label: "QTY",
    property: "quantity",
    sortable: true,
  },
  {
    id: "totalAmount",
    label: "Value",
    property: "totalAmount",
    sortable: true,
    content: (item: ReportDetails) => currencyConverter(item.totalAmount),
  },
  {
    id: "status",
    label: "Status",
    property: "status",
    sortable: true,
  },
];

export const meetingsColumn: TableColumn[] = [
  {
    id: "meetingDate",
    label: "Date",
    property: "meetingDate",
    sortable: true,
    align: "left",
    content: (item) => moment(item.meetingDate).format("MMMM DD, YYYY"),
  },
  {
    id: "time",
    label: "Time Start / End",
    property: "time",
    sortable: true,
    content: (item) =>
      item.startTime
        ? `${moment(item.startTime).format("hh:mm A")}/${moment(item.endTime).format("hh:mm A")}`
        : "N/A",
  },
  {
    id: "customerName",
    label: "Customer",
    property: "customerName",
    sortable: true,
  },
  {
    id: "purpose",
    label: "Purpose",
    property: "purpose",
    sortable: true,
  },
  {
    id: "status",
    label: "Status",
    property: "status",
    sortable: true,
  },
];

export const customerDataMap = [
  { field: "salesPerson", label: "Salesman" },
  { field: "contactNo1", label: "Phone" },
  { field: "email", label: "Email" },
  { field: "branch", label: "Branch" },
];

// subject to change
export const notesColumns: TableColumn[] = [
  {
    id: "dateCreated",
    label: "Date",
    property: "dateCreated",
    sortable: true,
    align: "left",
    content: (item: NotesLog) => moment(item.dateCreated).format("MMMM DD, YYYY"),
  },
  {
    id: "customerName",
    label: "Customer",
    property: "customerName",
    sortable: true,
  },
  {
    id: "modelName",
    label: "Product",
    property: "modelName",
    sortable: true,
  },
  {
    id: "id",
    label: "Notes",
    property: "id",
    sortable: true,
    content: (item: NotesLog) => getNotesLabel(item.id),
  },
  {
    id: "customerExperience",
    label: "Score",
    property: "customerExperience",
    sortable: true,
    content: (item: NotesLog) => getAverageRatingAsScore(item),
  },
];

export const appColors = {
  white: "#fff",
  offWhite: "#d2d6de",
  light: "#F8F9FB",
  gray: "#aaa",
  lightGray: "#C6C6C6",
  darkViolet: "#272B75",
  violet: "#9195B5",
  text: "#222",
  primary: { main: "#49BCF8", hover: "#272B75" },
  success: { main: "#50AF44", hover: "#006400" },
  danger: { main: "#d73925", hover: "#d73925" },
  warning: { main: "#F49C12", hover: "#F49C12" },
  border: "1px solid #d2d6de",
};

export type TableColumn = {
  id: string;
  label: string;
  property?: string;
  key?: number | string;
  content?: (item: any, index: number) => void;
  sortable?: boolean;
  width?: number;
  flex?: number;
  minWidth?: number;
  align?: "left" | "center";
  textColor?: string;
};

export type Order = "asc" | "desc";
export type SortColumn = { path: string; order: Order };
export type TableOwnProps = {
  rowsPerPage: number;
  searchKeyword: string;
};

export interface ActLogTableHeadProps {
  columns: TableColumn[];
  sortColumn: SortColumn;
  hasTopHeading?: boolean;
  topHeadingText?: string;
  onSort: (sortColumn: SortColumn) => void;
}

export interface ActLogTableBodyProps {
  data: any[];
  columns: TableColumn[];
  hasMoreButton?: boolean;
  loading?: boolean;
}

export const LIST_ITEMS: Array<ListItem> = ["Salesperson", "Location", "Customer"];

export interface DateSpanSelectProps {
  dateSpanFor: "salesDateRange" | "meetingsDateRange" | "notesDateRange";
  onChange?: () => void;
}

export const dateRangeOptions: DateRangeType[] = [
  { id: "current", name: "Current Date" },
  { id: "past-30-days", name: "Past 30 days" },
];

export const dateRangeOptionsMeetings: DateRangeType[] = [
  { id: "past-30-days", name: "Past 30 days" },
  { id: "next-7-days", name: "Next 7 days" },
];
