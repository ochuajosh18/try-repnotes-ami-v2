import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/styles/withStyles';

export const VisitsCompletedContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            backgroundColor: '#FFF',
            marginTop: 60,
            padding: '10px 30px',
            minHeight: 'calc(100vh - 80px)',
            boxSizing: 'border-box',
            textAlign: 'left',
            '& *': {
                textAlign: 'left'
            },
            '& .picker-container': {
                '& .MuiInput-underline:before': {
                    borderBottom: 0
                },
                '& .MuiInput-underline:after': {
                    borderBottom: 0
                },
                '& .MuiInput-underline:hover': {
                    borderBottom: 0
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottom: 0
                },
                '& .MuiInputBase-input.Mui-disabled': {
                    color: '#000'
                },
                '& .MuiFormControl-root': {
                    border: '1px solid rgba(0,0,0,0.23)',
                    borderRadius: 4,
                    padding: '4px 16px',
                    height: 36.25,
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    width: '100%'
                }
            }
        }
    })
)(Box);

export const VisitsCompletedReportFiltersContainer = withStyles(
    () => ({
        root: {
            padding: '20px 5px',
            boxSizing: 'border-box'
        }
    })
)(Grid);

export const VisitsCompletedReportFilterGridContainer = withStyles(
    () => ({
        root: {
            padding: '0 5px',
            boxSizing: 'border-box'
        }
    })
)(Grid);

export const VisitsCompletedReportViewButton = withStyles(
    () => ({
        root: {
            padding: '0 5px',
            boxSizing: 'border-box'
        }
    })
)(Button);

export const SeparetePickerContainer = withStyles(
    () => ({
        root: {
            position: 'relative',
            '& .MuiInput-underline:before': {
                borderBottom: 0
            },
            '& .MuiInput-underline:after': {
                borderBottom: 0
            },
            '& .MuiInput-underline:hover': {
                borderBottom: 0
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                borderBottom: 0
            },
            '& .MuiInputBase-input.Mui-disabled': {
                color: '#000'
            },
            '& .MuiFormControl-root': {
                border: '1px solid rgba(0,0,0,0.23)',
                borderRadius: 4,
                padding: '4px 16px',
                height: 36.25,
                boxSizing: 'border-box',
                cursor: 'pointer',
                width: '100%'
            }
        }
    })
)(Box);


export const SeparetePickerAuxContainer = withStyles(
    () => ({
        root: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 4,
            width: 32,
            height: 32,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            '& svg': {
                color: '#757575'
            }
        }
    })
)(Box);
