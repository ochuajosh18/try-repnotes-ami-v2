import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/styles';

export const ApprovalDialog = withStyles(
    () => ({
        root: {
            '& .MuiDialog-paper': {
                padding: 8,
                boxSizing: 'border-box',
                borderRadius: 0,
                width: '900px'
            }
        }
    })
)(Dialog); 

export const ApprovalDialogTitle = withStyles(
    () => ({
        root: {
            padding: '10px 10px 3px 10px',
        }
    })
)(DialogTitle); 

export const ApprovalDialogContent = withStyles(
    () => ({
        root: {
            '& .MuiInputBase-root': {
                width: '100%',
                '&:before': {
                    borderBottom: 'none'
                },
                '&:after': {
                    borderBottom: 'none'
                },
                '&:hover:before': {
                    borderBottom: 'none'
                }
            },
            '& .MuiSelect-icon': {
                right: 12
            },
            '& .MuiSelect-root' : {
                width: '100%',
                fontSize: 12
            },
            '& .selected-disabled': {
                color: '#969696'
            },
            '& .MuiFormHelperText-root.Mui-error': {
                display: 'none'
            },
            '& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': {
                marginRight: 8
            },
            '& .MuiAutocomplete-popupIndicator': {
                marginRight: 4
            }
        }
    })
)(DialogContent); 

export const ApprovalDialogActions = withStyles(
    () => ({
        root: {
            display: 'flex',
            justifyContent: 'flex-end',
            boxSizing: 'border-box',
            padding: '10px 10px 3px 10px',
        }
    })
)(DialogActions); 
