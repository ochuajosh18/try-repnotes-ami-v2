import React, { useState, ChangeEvent, CSSProperties } from "react";
import _ from "lodash";

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
  appColors,
  AppTableBodyProps,
  AppTableHeadProps,
  SortColumn,
  TableColumn,
} from "../../util/constants";

const headCellStyles: CSSProperties = {
  color: appColors.white,
  fontWeight: 600,
  fontSize: "12px",
  backgroundColor: appColors.violet,
  padding: "10px 16px",
  cursor: "pointer",
};

const AppTableContainer = (props: TableProps) => {
  return (
    <TableContainer style={{ maxHeight: 1000 }}>
      <Table {...props} stickyHeader>
        {props.children}
      </Table>
    </TableContainer>
  );
};

const AppTable = (props: PaperProps): JSX.Element => {
  return <Paper {...props}>{props.children}</Paper>;
};

const AppTableHead = (props: AppTableHeadProps) => {
  const { columns, sortColumn, onSort } = props;
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
      <TableRow>
        {columns.map((column) => (
          <React.Fragment key={createColumnKey(column)}>
            {column.sortable ? (
              <StyledTableCell
                sortDirection={sortColumn.path === column.property ? sortColumn.order : false}
                align={column.align ? column.align : "center"}
                style={{
                  width: column.width ? column.width : "auto",
                  ...headCellStyles,
                }}
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
              <StyledTableCell
                style={{
                  width: column.width ? column.width : "auto",
                  ...headCellStyles,
                }}
              >
                {column.label}
              </StyledTableCell>
            )}
          </React.Fragment>
        ))}
      </TableRow>
    </TableHead>
  );
};

const AppTableBody = (props: AppTableBodyProps) => {
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
    <TableBody>
      {data && data.length === 0 && !loading && (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            style={{
              backgroundColor: "white",
              padding: "20px 10px",
              textAlign: "center",
              border: 0,
            }}
          >
            <Typography>No available data.</Typography>
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
    padding: "4px 16px",
  },
  "&.MuiTableCell-body": {
    fontSize: 12,
    height: "35px",
  },
});

AppTable.Container = AppTableContainer;
AppTable.Head = AppTableHead;
AppTable.Body = AppTableBody;
AppTable.Pagination = TablePagination;

export default AppTable;

// Table Utils Hooks
interface ITableUtilsOptions {
  initialSortBy?: string;
  initialPage?: number;
  initialRowsPerPage?: number;
}

export function useTableUtils(options: ITableUtilsOptions = {}) {
  const hookOptions = {
    initialSortBy: "dateCreated",
    initialPage: 0,
    initialRowsPerPage: 5,
    ...options,
  };
  const { initialSortBy, initialPage, initialRowsPerPage } = hookOptions;

  const [sortColumn, setSortColumn] = useState<SortColumn>({
    path: initialSortBy,
    order: "desc",
  });

  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [search, setSearch] = useState("");

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const resetToPageOne = () => setPage(0);

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // sort handler
  const sortHandler = (sortCol: SortColumn) => {
    if (!sortCol) return;
    setSortColumn({ ...sortCol });
  };

  // sort function
  const sort = (items: any[], path: string, order: "asc" | "desc") =>
    _.orderBy(items, [path], [order]);

  // for table pagination
  const paginate = (items: any[], currentPage: number, pageSize: number) => {
    const startIndex = currentPage * pageSize;
    return _(items).slice(startIndex).take(pageSize).value();
  };

  // for search
  const filterBySearch = (data: any[]) =>
    _.filter(data, (row: any) => {
      const id = row.id ?? "";
      return (
        JSON.stringify(_.omit(row, "id")).toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        search === id
      );
    });

  return {
    sortColumn,
    sortHandler,
    sort,
    paginate,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    resetToPageOne,
    search,
    setSearch,
    filterBySearch,
  };
}
