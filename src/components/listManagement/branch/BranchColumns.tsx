import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import { Branch } from "../../../store/listManagement/branch/types";
import { appColors, TableColumn } from "../../../util/constants";
import { formatDateForTable, useDialog } from "../../../util/utils";
import { RepnotesActionButton } from "../../common/RepnotesButton";
import { useListPermission } from "./hooks";

const BranchActionButton = ({ branch }: { branch: Branch }) => {
  const { canEdit, canDelete } = useListPermission();
  const { openDeleteDialog } = useDialog();

  return (
    <Box display='flex' flexDirection='row' height={35}>
      {canEdit && <RepnotesActionButton link='branch' docId={branch.id} type='edit' />}
      {canDelete && (
        <RepnotesActionButton
          onClick={() => openDeleteDialog(branch.name, branch.id)}
          type='delete'
        />
      )}
    </Box>
  );
};

const BranchColumns: TableColumn[] = [
  {
    id: "name",
    label: "Name",
    property: "name",
    sortable: true,
    align: "left",
  },
  {
    id: "isActive",
    label: "Status",
    key: "branch-isActive",
    sortable: true,
    content: (branch: Branch) => (
      <Chip
        size='small'
        label={!branch.isActive ? "Inactive" : "Active"}
        style={{
          backgroundColor: branch.isActive ? appColors.active : appColors.inactive,
          color: appColors.white,
        }}
      />
    ),
  },
  {
    id: "dateCreated",
    label: "Date Created",
    property: "dateCreated",
    sortable: true,
    content: (branch: Branch) => formatDateForTable(branch.dateCreated),
  },
  {
    id: "dateUpdated",
    label: "Date Updated",
    property: "dateUpdated",
    sortable: true,
    content: (branch: Branch) => formatDateForTable(branch.dateUpdated),
  },
  {
    id: "action",
    label: "Actions",
    key: "branch-actions",
    sortable: false,
    content: (branch: Branch) => <BranchActionButton branch={branch} />,
  },
];

export default BranchColumns;
