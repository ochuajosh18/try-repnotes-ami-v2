import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/styles/withStyles';

export const ProductPerformanceContainer = withStyles(
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
            }
        }
    })
)(Box);

export const ProductPerformanceReportFiltersContainer = withStyles(
    () => ({
        root: {
            padding: '20px 5px',
            boxSizing: 'border-box'
        }
    })
)(Grid);

export const ProductPerformanceReportFilterGridContainer = withStyles(
    () => ({
        root: {
            padding: '0 5px',
            boxSizing: 'border-box'
        }
    })
)(Grid);

export const ProductPerformanceReportViewButton = withStyles(
    () => ({
        root: {
            padding: '0 5px',
            boxSizing: 'border-box'
        }
    })
)(Button);