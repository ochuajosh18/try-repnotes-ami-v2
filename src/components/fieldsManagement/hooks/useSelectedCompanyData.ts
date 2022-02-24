import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyForFields } from "../../../store/fieldsManagement/actions";
import {
  selectActiveFieldModuleId,
  selectCompanyIdForFields,
  selectCurrentFieldModule,
} from "../../../store/fieldsManagement/selectors";
import {
  getCompany,
  selectCompanyList,
} from "../../../store/listManagement/company/actions";
import { selectSystemSessionToken } from "../../../store/system/actions";

export default function useSelectedCompanyData() {
  const dispatch = useDispatch();

  const sessionToken = useSelector(selectSystemSessionToken);

  const companyId = useSelector(selectCompanyIdForFields);

  const [selectedCompany, setSelectedCompany] = useState<string>("");

  const { companyArray } = useSelector(selectCompanyList);
  const companySelectOptions = companyArray
    .filter((c) => c.isActive)
    .map((item) => ({
      id: item.companyId,
      name: item.name,
    }));

  const fieldModuleId = useSelector(selectActiveFieldModuleId);
  const currentFieldModule = useSelector(selectCurrentFieldModule);

  const noCompanySelected = !selectedCompany || !companyId;
  const isButtonDisabled = noCompanySelected || !fieldModuleId;
  const isSuperAdmin = companyId === "SUPERADMIN";

  useEffect(() => {
    if (isSuperAdmin) return setSelectedCompany("");
    const _companyId = companyId ? companyId : "";
    setSelectedCompany(_companyId);
  }, [companyId, isSuperAdmin]);

  useEffect(() => {
    dispatch(getCompany(sessionToken));
  }, [dispatch, sessionToken]);

  function handleCompanyChange(e: React.ChangeEvent<HTMLInputElement | any>) {
    const companyName = e.target.value;
    if (!companyName) return;
    setSelectedCompany(companyName);

    // update store
    dispatch(setCompanyForFields(companyName));
  }

  return {
    selectedCompany,
    currentFieldModule,
    fieldModuleId,
    noCompanySelected,
    companySelectOptions,
    handleCompanyChange,
    isButtonDisabled,
    isSuperAdmin,
  };
}
