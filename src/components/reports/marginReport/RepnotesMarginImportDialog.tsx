import React from 'react';
import {
    RepnotesDefaultButton, 
    RepnotesPrimaryButton 
} from '../../common/RepnotesButton';
import { RepnotesImportTable } from './RepnotesImportTable';
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

interface RepnotesMarginImportProps {
    open: boolean;
    importData: Array<{ [property: string]: string | number }>;
    onClear: () => void;
    disabled?: boolean;
    loading?: boolean;
    onSave: () => void;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const IMPORT_COLUMN = [
    { field: 'date', title: 'Date', cellStyle, headerStyle},
    { field: 'country', title: 'Country', cellStyle, headerStyle},
    { field: 'customer', title: 'Customer', cellStyle, headerStyle},
    { field: 'customerType', title: 'Customer Type', cellStyle, headerStyle},
    { field: 'model', title: 'Model', cellStyle, headerStyle},
    { field: 'invoiceNo', title: 'Invoice No', cellStyle, headerStyle},
    { field: 'invoiceQty', title: 'Invoice Qty', cellStyle, headerStyle},
    { field: 'invoiceAmount', title: 'Invoice Amount', cellStyle, headerStyle},
    { field: 'cost', title: 'Cost', cellStyle, headerStyle},
    { field: 'margin', title: 'Margin', cellStyle, headerStyle}
];

const theme = unstable_createMuiStrictModeTheme();

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
){
    return <Slide direction="up" ref={ref} {...props} />;
});

export const RepnotesMarginImport = (props: RepnotesMarginImportProps) => {

    const { open, importData, onClear, onSave, disabled, loading } = props

    const _onSave = () => {
        onSave()
    }

    const _onHandleClose = () => {
        onClear()
    }

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth={true}
                    maxWidth="lg"
                    onClose={_onHandleClose}
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
                                            data={importData}
                                            columns={IMPORT_COLUMN}
                                        />
                                    }
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Box>
                                <RepnotesDefaultButton onClick={_onHandleClose}>
                                    Cancel
                                </RepnotesDefaultButton>
                                {
                                    !disabled && 
                                    <RepnotesPrimaryButton onClick={_onSave}>
                                        Save
                                    </RepnotesPrimaryButton>
                                }
                            </Box>
                        </DialogActions>
                    </DialogContent>
                </Dialog>
            </ThemeProvider>
        </React.StrictMode>
    )
}
