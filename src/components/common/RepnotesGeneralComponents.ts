import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import withStyles from '@material-ui/styles/withStyles';

export const RepnotesSummaryCardsContainer = withStyles(
    () => ({
        root: {
            boxSizing: 'border-box',
            display: 'flex'
        }
    })
)(Box);

export const RepnotesSummaryCard = withStyles(
    () => ({
        root: {
            height: 80,
            width: 166,
            boxSizing: 'border-box',
            display: 'flex',
            borderRadius: 4,
            backgroundColor: '#F0F0F6',
            marginRight: 24,
            boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)' // shadow hack for card-like boxes
        }
    })
)(Box);

export const RepnotesSummaryCardIconContainer = withStyles(
    () => ({
        root: {
            height: 80,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            padding: '0 10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    })
)(Box);

export const RepnotesSummaryCardDataContainer = withStyles(
    () => ({
        root: {
            padding: '20px 5px 10px 10px',
            height: 80,
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap'
        }
    })
)(Box);

export const RepnotesInputChip = withStyles(
    () => ({
        root: {
            margin: '0 2px', 
            height: 25, 
            backgroundColor: '#121336', 
            color: '#fff',
            '& svg': {
                height: 18,
                color: '#FFF'
            },
            '& svg:hover': {
                color: '#DDD'
            }
        }
    })
)(Chip);