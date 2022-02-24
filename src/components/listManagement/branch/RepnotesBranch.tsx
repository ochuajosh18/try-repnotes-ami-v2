import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@material-ui/core/Box";

import AppTable, { useTableUtils } from "../../common/RepnotesAMITable";
import BranchColumns from "./BranchColumns";
import { useFetchBranch, useListPermission } from "./hooks";
import RepnotesBranchControlsBar from "./RepnotesBranchControlsBar";
import { LoadingDialog, RepnotesDialog } from "../../common/RepnotesAlerts";
import { useDialog } from "../../../util/utils";
import { deleteBranch } from "../../../store/listManagement/branch/actions";
import { selectBranchState } from "../../../store/listManagement/branch/selectors";

const RepnotesBranch = () => {
  const {
    sort,
    paginate,
    sortColumn,
    sortHandler,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    search,
    setSearch,
    filterBySearch,
  } = useTableUtils({ initialRowsPerPage: 10 });

  const dispatch = useDispatch();
  const { canEdit, canDelete } = useListPermission();
  const { dialog, closeDialog } = useDialog();
  const { data, status } = useSelector(selectBranchState);
  const loading = status === "loading";

  useFetchBranch();

  const filteredData = search ? filterBySearch(data) : data;

  const sortedData = sort(filteredData, sortColumn.path, sortColumn.order);

  const paginatedData = paginate(sortedData, page, rowsPerPage);

  const columns = !canEdit && !canDelete ? BranchColumns.slice(0, -1) : BranchColumns;

  const handleDelete = () => {
    dispatch(deleteBranch(dialog.docId as string));
  };

  return (
    <>
      <Box className='repnotes-content'>
        <RepnotesBranchControlsBar search={search} onSearch={setSearch} />
        {loading ? (
          <LoadingDialog />
        ) : (
          <AppTable>
            <AppTable.Container>
              <AppTable.Head sortColumn={sortColumn} onSort={sortHandler} columns={columns} />
              <AppTable.Body columns={columns} data={paginatedData} />
            </AppTable.Container>
            <AppTable.Pagination
              rowsPerPageOptions={[10, 20, 30, 40, 50]}
              component='div'
              count={sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </AppTable>
        )}
      </Box>
      <RepnotesDialog
        label={dialog.dialogLabel}
        open={dialog.dialogOpen}
        severity={dialog.dialogType}
        onClick={handleDelete}
        onClear={closeDialog}
      />
    </>
  );
};

export default RepnotesBranch;
