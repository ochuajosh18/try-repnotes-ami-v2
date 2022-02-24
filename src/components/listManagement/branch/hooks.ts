import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranchList } from "../../../store/listManagement/branch/actions";
import { selectBranchState } from "../../../store/listManagement/branch/selectors";
import { selectSystemState } from "../../../store/system/actions";

export function useListPermission() {
  const { session } = useSelector(selectSystemState);
  const { modules } = session;

  const canEdit = modules.listManagement.edit;
  const canDelete = modules.listManagement.delete;
  const canAdd = modules.listManagement.add;
  const canView = modules.listManagement.view;

  return { canEdit, canDelete, canAdd, canView };
}

export function useFetchBranch() {
  const dispatch = useDispatch();

  const { status, error, data, currentCompanyId } = useSelector(selectBranchState);

  useEffect(() => {
    if (!currentCompanyId) return;

    dispatch(fetchBranchList(currentCompanyId));
  }, [currentCompanyId, dispatch]);

  return { loading: status === "loading", error, data };
}
