import { RepnotesDangerButton, RepnotesDefaultButton, RepnotesWarningButton } from "../../common/RepnotesButton";
import { RepnotesLabel } from "../../common/RepnotesLabel";
import { ApprovalDialog, ApprovalDialogActions, ApprovalDialogContent, ApprovalDialogTitle } from "./RepnotesCustomerComponents"
import Grid from '@material-ui/core/Grid';
import Box from "@material-ui/core/Box";



interface CustomerApprovalDialogInterface {
    open: boolean;
    onClose: (action: string, id: string) => void;
    salesPerson: string;
    name: string;
    category: string;
    area: string;
    province: string;
    city: string;
    id: string;
    disabled: boolean;
}

export const CustomerApprovalDialog = (props: CustomerApprovalDialogInterface) =>{
    const { open, onClose, salesPerson, name, category, province, city, area, id, disabled} = props;
    return (
        <ApprovalDialog id="role-approval-dialog" fullWidth={true} maxWidth="md"  open={open} onClose={onClose}>
            <ApprovalDialogTitle >Customer Approval</ApprovalDialogTitle>
            <ApprovalDialogContent dividers>
                <Grid container>
                    <Grid item xs={6}>
                        <RepnotesLabel 
                            id="repnotes-customer-street-address"
                            label="Name"
                            labelPosition="left"
                            value={name}
                        />
                        <RepnotesLabel 
                            id="repnotes-customer-street-address"
                            label="Sales Person"
                            labelPosition="left"
                            value={salesPerson}
                        />
                        <RepnotesLabel 
                            id="repnotes-customer-street-address"
                            label="Category"
                            labelPosition="left"
                            value={category}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <RepnotesLabel 
                            id="repnotes-customer-street-address"
                            label="Area"
                            labelPosition="left"
                            value={area}
                        />
                        <RepnotesLabel 
                            id="repnotes-customer-street-address"
                            label="Province"
                            labelPosition="left"
                            value={province}
                        />
                        <RepnotesLabel 
                            id="repnotes-customer-street-address"
                            label="City"
                            labelPosition="left"
                            value={city}
                        />
                    </Grid>
                </Grid>
            </ApprovalDialogContent>
            <ApprovalDialogActions>
                <RepnotesDefaultButton onClick={() => props.onClose('cancel', id)}>Cancel</RepnotesDefaultButton>
                {
                    disabled &&
                    <Box>
                        <RepnotesDangerButton onClick={() => props.onClose('rejected', id)} style={{marginRight:'0px'}}>Reject</RepnotesDangerButton>
                        <RepnotesWarningButton onClick={() => props.onClose('approved', id)}> Approve</RepnotesWarningButton>
                    </Box>
                }
            </ApprovalDialogActions>
        </ApprovalDialog>
    )
}