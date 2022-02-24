import React from 'react';
import { ProductDetails } from '../../../../store/productManagement/product/types';
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

interface RepnotesProductImportProps {
    open: boolean;
    importData: Array<ProductDetails>;
    onClear: () => void;
    disabled?: boolean;
    loading?: boolean;
    onSave: () => void;
}

const cellStyle = { textAlign: 'left', wordBreak: 'break-all', fontSize: 12 };
const headerStyle  = { textAlign: 'left' };

const IMPORT_COLUMN = [
    { field: 'modelName', title: 'Title', cellStyle, headerStyle},
    { field: 'make', title: 'Make', cellStyle, headerStyle},
    { field: 'productFamily', title: 'Product Family', cellStyle, headerStyle},
];

const theme = unstable_createMuiStrictModeTheme();

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
){
    return <Slide direction="up" ref={ref} {...props} />;
});

const RepnotesProductImport = (props: RepnotesProductImportProps) => {

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
                    maxWidth="md"
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
                                            data={importData as Array<{ [key: string]: string | number }> || []}
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

export default RepnotesProductImport;