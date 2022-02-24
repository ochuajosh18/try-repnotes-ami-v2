import Box from '@material-ui/core/Box';
import withStyles from '@material-ui/styles/withStyles';

export const MarginReportContainer = withStyles(
    () => ({
        root: {
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