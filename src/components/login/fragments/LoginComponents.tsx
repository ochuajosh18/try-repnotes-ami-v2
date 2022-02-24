import FormControlLabel from '@material-ui/core/FormControlLabel';
import withStyles from '@material-ui/styles/withStyles';

export const RememberMeFormControlLabel = withStyles(
    () => ({
        root: {
            width: '100%',
            flex: 1, 
            color: '#49BCF8',
            '& .MuiFormControlLabel-label': {
                marginLeft: 8
            }
        }
    })
)(FormControlLabel);
