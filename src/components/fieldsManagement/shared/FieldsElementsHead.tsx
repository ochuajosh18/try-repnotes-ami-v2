import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import FieldsButton from "./FieldsButton";
import FieldSearchInput from "./FieldSearchInput";
import { appColors } from "./constants";
import useFieldsPermission from "../hooks/useFieldsPermission";

interface FieldsElementsHeadProps {
  onAddNewFieldClick: () => void;
  onSearch: (keyword: string) => void;
  searchValue: string;
}

function FieldsElementsHead(props: FieldsElementsHeadProps) {
  const { onAddNewFieldClick, onSearch, searchValue } = props;

  const { canAdd } = useFieldsPermission();

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    onSearch(e.target.value);
  }

  const handleSearchClear = () => onSearch("");

  return (
    <Box paddingX='10px' display='flex' flexDirection='column' gridRowGap='10px'>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='h6' style={{ fontWeight: 550 }}>
          Elements
        </Typography>
        {canAdd && <FieldsButton onClick={onAddNewFieldClick}>+ New Field</FieldsButton>}
      </Box>
      <FieldSearchInput
        placeholder='Search fields'
        onChange={handleSearch}
        value={searchValue}
        onClear={handleSearchClear}
      />
      <Typography
        style={{
          fontSize: "12px",
          color: appColors.lightGray,
          width: "max-content",
          textAlign: "left",
        }}
      >
        Elements here won't be shown in your app.
      </Typography>
    </Box>
  );
}

export default FieldsElementsHead;
