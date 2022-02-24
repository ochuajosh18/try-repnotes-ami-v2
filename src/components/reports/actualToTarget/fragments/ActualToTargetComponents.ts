import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/styles/withStyles';

export const ActualToTargetContainer = withStyles(
    () => ({
        root: {
            width: '100%',
            backgroundColor: '#FFF',
            marginTop: 60,
            padding: '10px 30px',
            minHeight: 'calc(100vh - 60px)',
            boxSizing: 'border-box',
            textAlign: 'left',
            '& *': {
                textAlign: 'left'
            }
        }
    })
)(Box);

export const ActualToTargetReportFiltersContainer = withStyles(
    () => ({
        root: {
            padding: '20px 5px',
            boxSizing: 'border-box'
        }
    })
)(Grid);

export const ActualToTargetReportFilterGridContainer = withStyles(
    () => ({
        root: {
            padding: '0 5px',
            boxSizing: 'border-box'
        }
    })
)(Grid);

export const ActualToTargetReportViewButton = withStyles(
    () => ({
        root: {
            padding: '0 5px',
            boxSizing: 'border-box'
        }
    })
)(Button);

export const ActualToTargetStatusContainer = withStyles(
    () => ({
        root: {
            padding: '10px 0',
            boxSizing: 'border-box'
        }
    })
)(Box);

export const ActualToTargetStatusGraphContainer = withStyles(
    () => ({
        root: {
            paddingTop: 20,
            height: 300
        }
    })
)(Box);