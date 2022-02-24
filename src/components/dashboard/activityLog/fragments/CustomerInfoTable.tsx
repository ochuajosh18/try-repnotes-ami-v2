import React, { useEffect } from "react";
import ActivityLogTable, { StyledTableBodyCell, StyledTableCell } from "./ActivityLogTable";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import { useDispatch, useSelector } from "react-redux";
import { selectDashboardState } from "../../../../store/dashboard/actions";
import { selectCustomerState } from "../../../../store/customerManagement/customer/actions";
import { selectBranchMap } from "../../../../store/listManagement/branch/selectors";
import { fetchBranchList } from "../../../../store/listManagement/branch/actions";

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = (props: InfoRowProps) => {
  const { label, value } = props;
  return (
    <TableRow>
      <StyledTableBodyCell style={{ textAlign: "left" }}>{label}</StyledTableBodyCell>
      <StyledTableBodyCell style={{ textAlign: "left" }}>{value}</StyledTableBodyCell>
    </TableRow>
  );
};

const InfoHead = (props: Partial<InfoRowProps>) => {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell align='left' style={{ fontSize: "12px", borderColor: "#bbb" }} colSpan={2}>
          {props.label}
        </StyledTableCell>
      </TableRow>
    </TableHead>
  );
};

const CustomerInfoTable = () => {
  const dispatch = useDispatch();
  const { filterSelectedCustomer, filterSelectedSalesperson, filterSelectedCompany } =
    useSelector(selectDashboardState);
  const { salesPersonList, customerList } = useSelector(selectCustomerState);
  const branchMap = useSelector(selectBranchMap);

  useEffect(() => {
    if (!filterSelectedCompany) return;
    dispatch(fetchBranchList(filterSelectedCompany));
  }, [dispatch, filterSelectedCompany]);

  const currentSalesPerson = salesPersonList.find((s) => s.id === filterSelectedSalesperson) as any;
  const currentCustomer = customerList.find((c) => c.id === filterSelectedCustomer);

  const noDataToDisplay = !currentCustomer && !currentSalesPerson;

  return (
    <ActivityLogTable>
      <ActivityLogTable.Container>
        <InfoHead label='Customer Information' />
        <InfoHead label={currentCustomer ? currentCustomer.name : "No selected customer."} />
        <TableBody>
          {!noDataToDisplay ? (
            <>
              {currentSalesPerson && (
                <>
                  <InfoRow label='Salesman' value={currentSalesPerson.name} />
                  <InfoRow label='Phone' value={currentSalesPerson.contactNo} />
                  <InfoRow label='Email' value={currentSalesPerson.email} />
                </>
              )}
              {currentCustomer && (
                <>
                  <InfoRow label='Branch' value={branchMap[currentCustomer.branch]} />
                  <InfoRow label='Contact 1' value={currentCustomer.name} />
                  <InfoRow label='Position' value='' />
                  <InfoRow label='Phone' value={currentCustomer.contactNo1} />
                  <InfoRow label='Email' value={currentCustomer.email} />
                </>
              )}
            </>
          ) : (
            <TableRow>
              <StyledTableBodyCell
                colSpan={2}
                style={{
                  backgroundColor: "white",
                  padding: "20px 10px",
                  textAlign: "center",
                }}
              >
                <Typography>No data to display.</Typography>
              </StyledTableBodyCell>
            </TableRow>
          )}
        </TableBody>
      </ActivityLogTable.Container>
    </ActivityLogTable>
  );
};

export default CustomerInfoTable;
