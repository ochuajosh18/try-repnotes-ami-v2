import React from 'react';
import { CustomerDetails } from '../../../../store/customerManagement/customer/types';
import {
    RepnotesDefaultButton, 
    RepnotesPrimaryButton 
} from '../../../common/RepnotesButton';
import { RepnotesImportTable } from '../../../common/RepnotesImportTable';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TransitionProps } from '@material-ui/core/transitions';
import { 
    ThemeProvider, 
    unstable_createMuiStrictModeTheme 
} from '@material-ui/core/styles';

interface RepnotesImportCustomerProps {
    open: boolean;
    importData: Array<CustomerDetails>;
    onClear: () => void;
    onClose: () => void;
    disabled?: boolean;
    loading?: boolean;
    onSave: () => void;
    showImportSummary: boolean;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const IMPORT_COLUMN = [
    { field: 'name', title: 'Customer Name', cellStyle, headerStyle},
    { field: 'customerType', title: 'Type', cellStyle, headerStyle},
    { field: 'salesPerson', title: 'Salesperson', cellStyle, headerStyle},
    { field: 'contactNo1', title: 'Contact Number', cellStyle, headerStyle},
    { field: 'email', title: 'Email', cellStyle, headerStyle},
];

const theme = unstable_createMuiStrictModeTheme();

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
){
    return <Slide direction="up" ref={ref} {...props} />;
});

const RepnotesImportCustomer = (props: RepnotesImportCustomerProps) => {

    const { open, importData, onClear, onSave, onClose, disabled, loading } = props

    const _onSave = () => {
        onSave()
    }

    const _onHandleClear = () => {
        onClear()
    }

    const _onHandleClose = () => {
        onClose()
    }

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth={true}
                    maxWidth="md"
                    onClose={_onHandleClear}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    style={{ visibility: open ? 'visible' : 'hidden', zIndex: 9990 }} 
                >
                    <DialogContent style={{ padding: '5px' }}>
                        <DialogTitle id="alert-dialog-slide-title" style={{ borderBottom: '1px solid #f4f4f4' }}>
                            <h6 style={{ margin: 0, lineHeight: '25px', fontSize: '16px', color: '#272B75' }}>Data Import</h6>
                            </DialogTitle>
                        <DialogContent>
                            <Grid container justify="center" spacing={1}>
                                <Grid item xs={12} style={{ paddingTop: 20, paddingBottom: 20, textAlign: 'center' }}>
                                    { loading ?
                                        <Box>
                                            <Typography>
                                                {`Uploading... `}
                                            </Typography>
                                            <CircularProgress 
                                            style={{ 
                                                width: 40,
                                                height: 40,
                                                color: '#000',
                                                padding: 20
                                            }}
                                            />
                                        </Box>
                                        :
                                        <RepnotesImportTable 
                                            data={importData as Array<{ [key: string]: string | number }> || []}
                                            columns={(props.showImportSummary) ? [...IMPORT_COLUMN, { field: 'remarks', title: 'Remarks', cellStyle, headerStyle}] : IMPORT_COLUMN}
                                        />
                                    }
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            {props.showImportSummary ? 
                                <Box>
                                    <RepnotesDefaultButton onClick={_onHandleClose}>
                                        Close
                                    </RepnotesDefaultButton>
                                </Box> :
                                <Box>
                                    <RepnotesDefaultButton onClick={_onHandleClear}>
                                        Cancel
                                    </RepnotesDefaultButton>
                                    {
                                        !disabled && 
                                        <RepnotesPrimaryButton onClick={_onSave}>
                                            Save
                                        </RepnotesPrimaryButton>
                                    }
                                </Box>
                            }
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </React.StrictMode>
    )
}

export default RepnotesImportCustomer;