import { useSelector } from "react-redux";
import { selectSystemState } from "../../../store/system/actions";

export default function useFieldsPermission() {
  // get permissions
  const systemState = useSelector(selectSystemState);

  const { modules } = systemState.session;
  const { fields } = modules;

  const canEdit = fields.edit;
  const canDelete = fields.delete;
  const canAdd = fields.add;

  return { canEdit, canDelete, canAdd };
}
