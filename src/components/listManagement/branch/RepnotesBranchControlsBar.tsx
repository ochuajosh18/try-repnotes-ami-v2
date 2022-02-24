import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import AddRoundedIcon from "@material-ui/icons/AddRounded";

import { RepnotesContentHeader } from "../../common/RepnotesContentHeader";
import { RepnotesInput } from "../../common/RepnotesInput";
import { RepnotesAddButton } from "../../common/RepnotesButton";
import useCompany from "../../../util/utils";
import { setBranchCurrentCompany } from "../../../store/listManagement/branch/actions";
import { selectBranchState } from "../../../store/listManagement/branch/selectors";
import { superAdminCompanyValidation } from "../../../store/userManagement/user/actions";

interface Props {
  search: string;
  onSearch: React.Dispatch<React.SetStateAction<string>>;
}

const RepnotesBranchControlsBar = (props: Props) => {
  const { search, onSearch } = props;
  const dispatch = useDispatch();
  const history = useHistory();

  const { currentCompanyId } = useSelector(selectBranchState);

  const changeCallback = (company: string) => dispatch(setBranchCurrentCompany(company));

  const { isUserSuper, companySelectOptions, selectedCompany, handleCompanyChange } = useCompany(
    currentCompanyId,
    changeCallback
  );

  const handleAddClick = () => {
    if (!selectedCompany) return dispatch(superAdminCompanyValidation());
    history.push("/branch/new");
  };

  const handleSearchClear = () => onSearch("");

  return (
    <>
      <Box style={{ textAlign: "left", paddingTop: "10px 0px" }}>
        <RepnotesContentHeader moduleName='List Management' subModule='Branch' />
      </Box>
      <Grid container style={{ paddingTop: "20px" }}>
        {isUserSuper && (
          <Grid item xs={2}>
            <RepnotesInput
              id='repnotes-list-branch'
              type='select'
              label='Company Name'
              labelPosition='top'
              options={companySelectOptions}
              value={selectedCompany}
              onSelectChange={handleCompanyChange}
            />
          </Grid>
        )}
        <Box alignSelf='end' ml='auto' display='flex'>
          <Box width='130px'>
            <RepnotesInput
              id='search'
              type='search'
              placeholder='Search'
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onSearch(e.target.value);
              }}
              onClear={handleSearchClear}
            />
          </Box>
          <RepnotesAddButton onClick={handleAddClick}>
            <AddRoundedIcon />
          </RepnotesAddButton>
        </Box>
      </Grid>
    </>
  );
};

export default RepnotesBranchControlsBar;
