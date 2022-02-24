import React from 'react';
import { useDispatch } from "react-redux";
import { clearAlert } from '../../store/alert/actions';
import { 
    RepnotesDangerButton, 
    RepnotesDefaultButton, 
    RepnotesPrimaryButton 
} from './RepnotesButton';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Alert from '@material-ui/lab/Alert';
// import AlertTitle from '@material-ui/lab/AlertTitle';
import { TransitionProps } from '@material-ui/core/transitions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import { 
    ThemeProvider, 
    unstable_createMuiStrictModeTheme 
} from '@material-ui/core/styles';

interface RepnotesAlertProps {
    open: boolean;
    label: string;
    severity: 'success' | 'error' | 'warning' | 'info'
}

interface RepnotesDialogProps {
    open: boolean;
    label: string | number;
    severity: 'save' | 'delete' | 'default',
    docId?: string | number;
    onClick: () => void;
    onClear: () => void;
}

const theme = unstable_createMuiStrictModeTheme();

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
){
    return <Slide direction="up" ref={ref} {...props} />;
});

export const RepnotesAlert = (props: RepnotesAlertProps) => {
    const { open, label, severity } = props
    const dispatch = useDispatch();
    const _onHandleClose = () => {
        dispatch(clearAlert());
    }

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={open}
                    autoHideDuration={3000}
                    onClose={_onHandleClose}
                >
                    <Alert variant="filled" severity={severity}>
                        {/* <AlertTitle>{severity.charAt(0).toUpperCase() + severity.slice(1)}</AlertTitle> */}
                        {label}
                    </Alert>
                </Snackbar>
                {/* <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onEnter={_onAutoClose}
                    onClose={_onHandleClose}
                    aria-describedby="alert-dialog-slide-description"
                    style={{ visibility: open ? 'visible' : 'hidden', zIndex: 9999 }} 
                >
                    <DialogContent style={{ padding: 0 }}>
                        <DialogContentText id="alert-dialog-slide-description" style={{ margin: 0 }}>
                        <Alert variant="filled" severity={severity} onClose={_onHandleClose}>
                            <AlertTitle>{severity.charAt(0).toUpperCase() + severity.slice(1)}</AlertTitle>
                            {label}
                        </Alert>
                        </DialogContentText>
                    </DialogContent>
                </Dialog> */}
            </ThemeProvider>
        </React.StrictMode>
    )
}

export const RepnotesDialog = (props: RepnotesDialogProps) => {

    const { open, label, severity, onClick, onClear } = props

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
                    onClose={_onHandleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    style={{ visibility: open ? 'visible' : 'hidden' }} 
                >
                    {severity === 'delete' && 
                        <DialogContent style={{ width: 320, padding: '5px' }}>
                            <DialogTitle id="alert-dialog-slide-title"><h6 style={{ margin: 0, lineHeight: '25px', fontSize: '16px' }}>Are you sure you want to delete?</h6></DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    <label style={{ fontSize: 12 }}>If yes, {label} will be deleted</label>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <RepnotesDefaultButton onClick={_onHandleClose}>
                                    Cancel
                                </RepnotesDefaultButton>
                                <RepnotesDangerButton onClick={onClick}>
                                    Delete
                                </RepnotesDangerButton>
                            </DialogActions>
                        </DialogContent>
                    }
                    {severity === 'save' && 
                        <DialogContent style={{ width: 320, padding: '5px' }}>
                            <DialogTitle id="alert-dialog-slide-title"><h4 style={{ margin: 0, lineHeight: '25px', fontSize: '16px' }}>{"Are you sure you want to save?"}</h4></DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    <label style={{ fontSize: 12 }}>If yes, {label} will be saved</label>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <RepnotesDefaultButton onClick={_onHandleClose}>
                                    Cancel
                                </RepnotesDefaultButton>
                                <RepnotesPrimaryButton onClick={onClick}>
                                    Save
                                </RepnotesPrimaryButton>
                            </DialogActions>
                        </DialogContent>
                    }
                </Dialog>
            </ThemeProvider>
        </React.StrictMode>
    )
}

export const LoadingDialog = () => ( 
    <Box width="100%">
        <Grid container alignItems="center" justify="center" style={{ height: 400 }}>
            <Grid item xs={12}>
                <CircularProgress color="inherit" />
            </Grid>
        </Grid>
    </Box> 
);

export const CenteredLoadingDialog = () => ( 
    <Box width="100%" height="calc(100% - 144px)"display="flex" justifyContent="center" alignItems="center">
        <CircularProgress color="inherit" />
    </Box> 
);

export const CenteredNoData = () => ( 
    <Box width="100%" height="calc(100% - 144px)" display="flex" justifyContent="center" alignItems="center">
        <Box fontSize="32px" fontWeight="bold" color="#969696">No Data</Box>
    </Box> 
);