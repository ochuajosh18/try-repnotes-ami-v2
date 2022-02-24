import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFields,
  setCompanyForFields,
} from "../../../store/fieldsManagement/actions";
import { selectCompanyIdForFields } from "../../../store/fieldsManagement/selectors";
import { selectCurrentUserCompany } from "../../../store/system/actions";

export default function useFetchFields(companyId?: string) {
  const dispatch = useDispatch();
  const currentCompanyId = useSelector(selectCompanyIdForFields);
  const currentUserCompany = useSelector(selectCurrentUserCompany);

  const companyIdRef = useRef(companyId);
  useEffect(() => {
    if (!companyIdRef.current) return;
    dispatch(fetchFields(companyIdRef.current));
  }, [dispatch]);

  useEffect(() => {
    if (!currentUserCompany) return;
    dispatch(setCompanyForFields(currentUserCompany));
  }, [currentUserCompany, dispatch]);

  useEffect(() => {
    if (!currentCompanyId || currentCompanyId === "SUPERADMIN") return;
    dispatch(fetchFields(currentCompanyId));
  }, [currentCompanyId, dispatch]);
}
