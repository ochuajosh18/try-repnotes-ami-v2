import React from "react";
import { useSelector } from "react-redux";
import useTableUtils from "../utils/useTableUtils";
import ActivityLogTable from "./ActivityLogTable";
import DateSpanSelect from "./DateSpanSelect";
import Grid from "@material-ui/core/Grid";
import { notesColumns, TableColumn } from "../utils/constants";
import { selectDashboardState } from "../../../../store/dashboard/actions";
import { isCurrentDate, isInPast30Days } from "../../../../util/utils";

const NotesActLogTable = () => {
  const {
    sort,
    sortColumn,
    sortHandler,
    paginate,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    resetToPageOne,
  } = useTableUtils();

  const {
    notesLogs: data,
    filterSelectedCustomer,
    filterSelectedProvince,
    filterSelectedSalesperson,
    notesDateRange,
    loading,
  } = useSelector(selectDashboardState);
  const columns = React.useMemo<TableColumn[]>(() => notesColumns, []);

  let filteredData = filterSelectedCustomer
    ? data.filter((n) => n.customerId === filterSelectedCustomer)
    : data;
  filteredData = filterSelectedSalesperson
    ? filteredData.filter((n) => n.salesPersonDocId === filterSelectedSalesperson)
    : filteredData;
  filteredData = filterSelectedProvince
    ? filteredData.filter((n) => n.province === filterSelectedProvince)
    : filteredData;

  filteredData = filteredData.filter((n) =>
    notesDateRange === "current" ? isCurrentDate(n.dateCreated) : isInPast30Days(n.dateCreated)
  );

  const sortedData = sort(filteredData, sortColumn.path, sortColumn.order);

  const paginatedData = paginate(sortedData, page, rowsPerPage);

  return (
    <Grid container>
      <Grid item xs={3}>
        <DateSpanSelect dateSpanFor='notesDateRange' onChange={resetToPageOne} />
      </Grid>
      <Grid item xs={12}>
        <ActivityLogTable>
          <ActivityLogTable.Container>
            <ActivityLogTable.Head
              sortColumn={sortColumn}
              columns={columns}
              onSort={sortHandler}
              topHeadingText='Notes'
            />
            <ActivityLogTable.Body data={paginatedData} columns={columns} loading={loading} />
          </ActivityLogTable.Container>
          <ActivityLogTable.Pagination
            rowsPerPageOptions={[5, 10, 20]}
            component='div'
            count={sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </ActivityLogTable>
      </Grid>
    </Grid>
  );
};

export default NotesActLogTable;
