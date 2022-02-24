import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table, { TableProps } from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TablePagination from "@material-ui/core/TablePagination";
import Typography from "@material-ui/core/Typography";
import { styled } from "@material-ui/core/styles";
import {
  ActLogTableHeadProps,
  ActLogTableBodyProps,
  TableColumn,
  SortColumn,
  appColors,
} from "../utils/constants";

const ActivityLogTableContainer = (props: TableProps) => {
  return (
    <TableContainer>
      <Table size='small'>{props.children}</Table>
    </TableContainer>
  );
};

const ActivityLogTable = (props: PaperProps): JSX.Element => {
  return <Paper style={{ marginBottom: "36px" }}>{props.children}</Paper>;
};

const ActivityLogTableHead = ({ hasTopHeading = true, ...props }: ActLogTableHeadProps) => {
  const { columns, sortColumn, onSort, topHeadingText } = props;
  // create column head cell key
  function createColumnKey(column: TableColumn) {
    return `col-${column.id}`;
  }

  function handleSort(sortColumnProperty: string) {
    if (!sortColumnProperty) return;

    const isAsc = sortColumn.path === sortColumnProperty && sortColumn.order === "asc";
    const newSortColumn: SortColumn = {
      path: sortColumnProperty,
      order: isAsc ? "desc" : "asc",
    };

    onSort(newSortColumn);
  }

  return (
    <TableHead>
      {hasTopHeading && topHeadingText && (
        <TableRow>
          <StyledTableCell
            align='left'
            style={{ fontSize: "12px", borderColor: "#bbb" }}
            colSpan={columns.length}
          >
            {topHeadingText}
          </StyledTableCell>
        </TableRow>
      )}
      <TableRow>
        {columns.map((column) => (
          <React.Fragment key={createColumnKey(column)}>
            {column.sortable ? (
              <StyledTableCell
                sortDirection={sortColumn.path === column.property ? sortColumn.order : false}
                align={column.align ? column.align : "center"}
                style={{ width: column.width ? column.width : "auto" }}
              >
                <StyledTableSortLabel
                  active={sortColumn.path === column.id}
                  direction={sortColumn.path === column.id ? sortColumn.order : "asc"}
                  onClick={() => handleSort(column.id)}
                  style={{
                    color: "white",
                    marginLeft: column.align ? 0 : "20px",
                  }}
                >
                  {column.label}
                </StyledTableSortLabel>
              </StyledTableCell>
            ) : (
              <StyledTableCell>{column.label}</StyledTableCell>
            )}
          </React.Fragment>
        ))}
      </TableRow>
    </TableHead>
  );
};

const ActivityLogTableBody = ({ hasMoreButton = true, ...props }: ActLogTableBodyProps) => {
  const { data, columns, loading } = props;

  // create row cell key
  function createRowCellKey(rowItem: any, column: any, index: number) {
    return `${rowItem.id ? rowItem.id : index}-${column.id}`;
  }

  // cell content renderer
  function renderCellContent(rowItem: any, rowIndex: number, column: any) {
    if (column.content) return column.content(rowItem, rowIndex);
    return rowItem[column.property];
  }

  if (loading)
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columns.length}
            height={100}
            style={{
              backgroundColor: "white",
              padding: "20px 10px",
              textAlign: "center",
            }}
          >
            <CircularProgress color='inherit' size={30} />
          </TableCell>
        </TableRow>
      </TableBody>
    );

  return (
    <TableBody style={{ border: appColors.border }}>
      {data && data.length === 0 && !loading && (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            style={{
              backgroundColor: "white",
              padding: "20px 10px",
              textAlign: "center",
            }}
          >
            <Typography>No results found.</Typography>
          </TableCell>
        </TableRow>
      )}
      {data.length > 0 &&
        data.map((item, index) => (
          <TableRow key={item.id + index.toString()}>
            {columns.map((column, colIndex) => (
              <StyledTableBodyCell
                key={createRowCellKey(item, column, colIndex)}
                style={{ textAlign: column.align ? column.align : "center" }}
              >
                {renderCellContent(item, index, column)}
              </StyledTableBodyCell>
            ))}
          </TableRow>
        ))}
    </TableBody>
  );
};

export const StyledTableCell = styled(TableCell)({
  "&.MuiTableCell-root": {
    backgroundColor: appColors.violet,
    color: "#fff",
    whiteSpace: "nowrap",
  },
  "&.MuiTableCell-body": {
    fontSize: 14,
  },
});

const StyledTableSortLabel = styled(TableSortLabel)({
  "&.MuiTableSortLabel-root": {
    marginLeft: "20px",
  },
  "&.MuiTableSortLabel-active": {
    color: "#fff",
  },
  "&.MuiTableSortLabel-icon": {
    color: "yellow",
  },
});

export const StyledTableBodyCell = styled(TableCell)({
  "&.MuiTableCell-root": {
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  "&.MuiTableCell-body": {
    fontSize: 12,
  },
});

// const StyledPagination = styled(TablePagination)({
//   "&.MuiTablePagination-root": {
//     width: "100%",
//     fontSize: "12px",
//     backgroundColor: "red",
//   },
// });

ActivityLogTable.Container = ActivityLogTableContainer;
ActivityLogTable.Head = ActivityLogTableHead;
ActivityLogTable.Body = ActivityLogTableBody;
ActivityLogTable.Pagination = TablePagination;

export default ActivityLogTable;
