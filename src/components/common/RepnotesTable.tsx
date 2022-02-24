import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CompanyDetails } from "../../store/listManagement/company/types";
import { Permissions } from "../../store/system/types";
import { RepnotesActionButton, RepnotesAddButton, RepnotesPrimaryButton } from "./RepnotesButton";
import { RepnotesInput } from "./RepnotesInput";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Chip from "@material-ui/core/Chip";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { makeStyles } from "@material-ui/core/styles";
import filter from "lodash/filter";
import map from "lodash/map";
import omit from "lodash/omit";
import lOrderBy from "lodash/orderBy";

// icon
import PersonIcon from "@material-ui/icons/Person";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import BarChartIcon from "@material-ui/icons/BarChart";
import ListIcon from "@material-ui/icons/List";
import SettingsIcon from "@material-ui/icons/Settings";
import Export from "../../assets/images/export.png";
import moment from "moment";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 1000,
  },
});

type Order = "asc" | "desc" | undefined;
const VALID_DATE_FORMATS = ["YYYY-MM-DD", "MMMM D, YYYY", "LL"];
const orderComparator = <T extends {}>(item: T, orderBy: keyof T) => {
  const stringVal = item[orderBy] ? (item[orderBy] as unknown as string).toString() : "";
  for (const f of VALID_DATE_FORMATS) {
    // date
    if (moment(item[orderBy], f, true).isValid()) return moment(item[orderBy]);
  }
  if (
    stringVal &&
    ((item[orderBy] as unknown as string).toString().indexOf("$") > -1 ||
      isFinite(parseFloat(stringVal)))
  ) {
    // currency
    return parseFloat(stringVal.replace("$", "").replace(",", "").replace(/ +/, ""));
  }
  return stringVal.toLowerCase();
};

export interface Column {
  title: string;
  field: string;
  cellStyle?: any;
  headerStyle?: any;
}

interface RepnotesTableInterface {
  columns: Array<Column>;
  role?: string;
  companyList?: Array<CompanyDetails>;
  companyFilter: (value: string) => void;
  companyValidation: () => void;
  selectedCompany?: string;
  data: Array<{ [property: string]: string | number }>;
  link?: string;
  onDialogOpen: (id: string | number, name: string | number, type: string) => void;
  custom?: boolean;
  type?: string;
  permission?: Permissions;
  disableTopPadding?: boolean;
  tableHeaderMaxWidth?: number;
  withExport?: boolean;
  onExportClick?: () => void;
  importComponent?: ReactNode;
  getTemplateComponent?: ReactNode;
}

export const RepnotesTable = (props: RepnotesTableInterface) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState("dateUpdated");
  const [search, setSearch] = React.useState("");

  let tableData = props.data;

  if (search) {
    tableData = filter(props.data, (row) => {
      const id = row.id ?? "";
      return (
        JSON.stringify(omit(row, "id")).toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        search === id
      );
    });
  }

  const handleSearchClear = () => setSearch("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSortRequest = (cellId: string) => {
    const newOrder: typeof order =
      cellId === orderBy ? (order ? (order === "asc" ? "desc" : undefined) : "asc") : "asc";
    setOrder(newOrder);
    setOrderBy(newOrder ? cellId : "dateUpdated");
  };

  const handleSearch = (value: any) => {
    setSearch(value);
  };

  return (
    <Box>
      {!props.custom && (
        <Grid style={{ paddingTop: !props.disableTopPadding ? "20px" : 0 }}>
          <Grid container item xs={12}>
            <Grid item xs={2}>
              {props.role === "SUPER ADMIN" && (
                <RepnotesInput
                  id='repnotes-margin-model'
                  type='select'
                  label='Company Name'
                  labelPosition='top'
                  firstSelectOption={props.selectedCompany !== "" ? "removeall" : ""}
                  value={props.selectedCompany}
                  options={map(props.companyList, (data) => ({
                    id: data.companyId,
                    name: data.name,
                  }))}
                  onSelectChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                    props.companyFilter(e.target.value as string);
                  }}
                />
              )}
            </Grid>
            <Grid
              item
              xs={10}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                marginTop: !props.disableTopPadding ? "18px" : 0,
              }}
            >
              <Box display='flex' p={0} height='45px'>
                {props.getTemplateComponent}
                {props.importComponent}
                {props.withExport && (
                  <Box
                    display='flex'
                    marginRight='8px'
                    height='100%'
                    boxSizing='border-box'
                    paddingBottom='5px'
                    alignItems='flex-end'
                  >
                    <RepnotesPrimaryButton
                      startIcon={
                        <img
                          src={Export}
                          alt=''
                          style={{ width: 18, height: 18, objectFit: "cover" }}
                        />
                      }
                      style={{
                        height: 34,
                        alignSelf: "unset",
                        width: 120,
                        boxSizing: "border-box",
                        marginRight: 0,
                      }}
                      onClick={props.onExportClick}
                    >
                      Export
                    </RepnotesPrimaryButton>
                  </Box>
                )}
                <Box p={0} width='130px'>
                  <RepnotesInput
                    id='search'
                    type='search'
                    placeholder='Search'
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleSearch(e.target.value);
                    }}
                    onClear={handleSearchClear}
                  />
                </Box>
                {props.permission?.add && (
                  <Box p={0} style={{ paddingTop: "6px" }}>
                    {props.selectedCompany === "" ? (
                      <RepnotesAddButton onClick={() => props.companyValidation()}>
                        <AddRoundedIcon />
                      </RepnotesAddButton>
                    ) : (
                      <Link
                        to={`/${props.link}/new`}
                        style={{
                          textTransform: "none",
                          textDecoration: "none",
                        }}
                      >
                        <RepnotesAddButton>
                          <AddRoundedIcon />
                        </RepnotesAddButton>
                      </Link>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow key='empty-1'>
                {props.columns.map((column) => (
                  <TableCell
                    component='th'
                    scope='row'
                    key={`header-${column.field}`}
                    align={column.cellStyle.textAlign}
                    style={{
                      ...column.headerStyle,
                      color: "#fff",
                      fontWeight: 600,
                      backgroundColor: "#9195B5",
                      padding: "10px 16px",
                      cursor: "pointer",
                      width: column.field === "action" ? "80px" : "auto",
                    }}
                  >
                    <TableSortLabel
                      disabled={column.field === "action" ? true : false}
                      style={{
                        color: "#fff",
                        ...column.headerStyle,
                        padding: 0,
                        maxWidth: props.tableHeaderMaxWidth ? props.tableHeaderMaxWidth : "unset",
                      }}
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : "asc"}
                      onClick={() => {
                        handleSortRequest(column.field);
                      }}
                    >
                      {column.title}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {lOrderBy(tableData, (a) => orderComparator(a, orderBy), order)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover key={`row-${JSON.stringify(row)}-${index}`}>
                      {props.columns.map((column, colIndex) => {
                        const value = row[column.field];
                        return (
                          <TableCell
                            key={`${row.name}-${index}-${column.field}-${colIndex}`}
                            component='th'
                            scope='row'
                            style={{
                              ...column.cellStyle,
                              padding: "4px 16px",
                            }}
                          >
                            {column.field === "isActive" && "status" in row ? (
                              <Box>
                                {row["status"] === "Pending" && (
                                  <Chip
                                    size='small'
                                    label='Pending'
                                    style={{
                                      backgroundColor: "#faa71d",
                                      color: "#fff",
                                    }}
                                  />
                                )}
                                {row["status"] === "Approved" && (
                                  <Chip
                                    size='small'
                                    label={row["isActive"] ? "Active" : "Inactive"}
                                    style={{
                                      backgroundColor: row["isActive"] ? "#4FAF43" : "#DE4C38",
                                      color: "#fff",
                                    }}
                                  />
                                )}
                              </Box>
                            ) : null}
                            {column.field === "isActive" &&
                              !("status" in row) &&
                              typeof value === "boolean" && (
                                <Chip
                                  size='small'
                                  label={value ? "Active" : "Inactive"}
                                  style={{
                                    backgroundColor: value ? "#4CAF50" : "#DE4C38",
                                    color: "#fff",
                                  }}
                                />
                              )}
                            {column.field === "meetingStatus" && (
                              <Chip
                                size='small'
                                label={value}
                                style={{
                                  backgroundColor: value !== "Cancelled" ? "#4CAF50" : "#DE4C38",
                                  color: "#fff",
                                }}
                              />
                            )}
                            {column.field === "action" ? (
                              <Box
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  height: 35,
                                }}
                              >
                                {props.type === "view" ? (
                                  <RepnotesActionButton
                                    onClick={() =>
                                      props.onDialogOpen(
                                        row.id as string,
                                        row.name,
                                        props.type as string
                                      )
                                    }
                                    type='view'
                                  />
                                ) : (
                                  <RepnotesActionButton
                                    link={props.link}
                                    docId={row.id}
                                    type='edit'
                                  />
                                )}
                                {props.permission?.delete && (
                                  <RepnotesActionButton
                                    onClick={() =>
                                      props.onDialogOpen(
                                        row.id,
                                        props.link === "location"
                                          ? `${row.province}-${row.name}`
                                          : row.name,
                                        "delete"
                                      )
                                    }
                                    type='delete'
                                  />
                                )}
                              </Box>
                            ) : null}
                            {column.field === "modules" ? (
                              <Box>
                                {(JSON.parse(value as string).rolesAndPermission.view ||
                                  JSON.parse(value as string).user.view) && (
                                  <PersonIcon
                                    style={{
                                      margin: "0 10px 0 0",
                                    }}
                                  />
                                )}
                                {(JSON.parse(value as string).customer.view ||
                                  JSON.parse(value as string).location.view) && (
                                  <SupervisorAccountIcon
                                    style={{
                                      margin: "0 10px",
                                    }}
                                  />
                                )}
                                {(JSON.parse(value as string).brochure.view ||
                                  JSON.parse(value as string).product.view ||
                                  JSON.parse(value as string).promotion.view) && (
                                  <LocalShippingIcon
                                    style={{
                                      margin: "0 10px",
                                    }}
                                  />
                                )}
                                {(JSON.parse(value as string).salesOpportunities.view ||
                                  JSON.parse(value as string).marginReport.view ||
                                  JSON.parse(value as string).marketShare.view ||
                                  JSON.parse(value as string).actualVsTarget.view ||
                                  JSON.parse(value as string).quotesByStatus.view ||
                                  JSON.parse(value as string).voiceOfCustomer.view ||
                                  JSON.parse(value as string).customerTouchpoint.view) && (
                                  <BarChartIcon
                                    style={{
                                      margin: "0 10px",
                                    }}
                                  />
                                )}
                                {JSON.parse(value as string).listManagement.view && (
                                  <ListIcon
                                    style={{
                                      margin: "0 10px",
                                    }}
                                  />
                                )}
                                {JSON.parse(value as string).fields?.view && (
                                  <SettingsIcon
                                    style={{
                                      margin: "0 10px",
                                    }}
                                  />
                                )}
                              </Box>
                            ) : column.field === "meetingStatus" ? null : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {tableData.length === 0 && (
                <TableRow key='empty-row' style={{ height: 40 }}>
                  <TableCell
                    key='cempty-row'
                    component='td'
                    scope='row'
                    style={{ textAlign: "center" }}
                    colSpan={props.columns.length}
                  >
                    No available data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          component='div'
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
