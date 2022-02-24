import React from "react";

import useTableUtils from "../utils/useTableUtils";
import ActivityLogTable from "./ActivityLogTable";
import DateSpanSelect from "./DateSpanSelect";
import Grid from "@material-ui/core/Grid";
import { meetingsColumn, TableColumn } from "../utils/constants";
import { useSelector } from "react-redux";
import { selectDashboardState } from "../../../../store/dashboard/actions";
import { isInNext7Days, isInPast30Days } from "../../../../util/utils";

const MeetingsActLogTable = () => {
  const {
    sort,
    sortColumn,
    sortHandler,
    paginate,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  } = useTableUtils();

  const {
    meetings: data,
    loading,
    filterSelectedCustomer,
    filterSelectedProvince,
    filterSelectedSalesperson,
    meetingsDateRange,
  } = useSelector(selectDashboardState);
  const columns = React.useMemo<TableColumn[]>(() => meetingsColumn, []);

  let filteredData = filterSelectedCustomer
    ? data.filter((n) => n.customerId === filterSelectedCustomer)
    : data;
  filteredData = filterSelectedSalesperson
    ? filteredData.filter((n) => n.salesPersonDocId === filterSelectedSalesperson)
    : filteredData;
  filteredData = filterSelectedProvince
    ? filteredData.filter((n) => n.province === filterSelectedProvince)
    : filteredData;

  filteredData = filteredData.filter((m) =>
    meetingsDateRange === "past-30-days"
      ? isInPast30Days(m.meetingDate as string)
      : isInNext7Days(m.meetingDate as string)
  );

  const sortedData = sort(filteredData, sortColumn.path, sortColumn.order);

  const paginatedData = paginate(sortedData, page, rowsPerPage);

  return (
    <Grid container>
      <Grid item xs={3}>
        <DateSpanSelect dateSpanFor='meetingsDateRange' />
      </Grid>
      <Grid item xs={12}>
        <ActivityLogTable>
          <ActivityLogTable.Container>
            <ActivityLogTable.Head
              sortColumn={sortColumn}
              columns={columns}
              onSort={sortHandler}
              topHeadingText='Meetings'
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

export default MeetingsActLogTable;
