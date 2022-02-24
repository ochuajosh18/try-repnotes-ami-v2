import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import withStyles from '@material-ui/styles/withStyles';

export const ProfileContainer = withStyles(
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

export const ProfileTabs = withStyles(
    () => ({
        root: {
            marginTop: 14,
            zIndex: 2,
            position: 'relative',
            '& .MuiButtonBase-root': {
                textTransform: 'none',
            },
            '& .MuiTabs-indicator': {
                top: 0
            }
        }
    })
)(Tabs);

export const ProfileTab = withStyles(
    () => ({
        root: {
            width: 60,
            padding: 0,
            minWidth: 60,
            '& .MuiTab-wrapper': {
                fontSize: '13px!important'
            },
            '&.Mui-selected': {
                borderLeft: '1px solid #E7E7E7',
                borderRight: '1px solid #E7E7E7',
                borderBottom: '1px solid #FFF'
            }
        }
    })
)(Tab);

export const ProfileInputsContainer = withStyles(
    () => ({
        root: {
            position: 'relative',
            zIndex: 0,
            backgroundColor: '#FFF',
            top: -1,
            border: '1px solid #E7E7E7',
            width: '100%',
            padding: 20,
            boxSizing: 'border-box',
            '& .MuiGrid-root.MuiGrid-container': {
                alignItems: 'center'
            },
            '& .repnotes-input-label-container': {
                paddingTop: 'unset!important'
            },
            '& .MuiInputBase-root.Mui-disabled': {
                backgroundColor: '#EEEEEE'
            }
        }
    })
)(Box);

export const ProfileSettingsContainer = withStyles(
    () => ({
        root: {
            display: 'flex',
            position: 'relative',
            zIndex: 0,
            backgroundColor: '#FFF',
            top: -1,
            border: '1px solid #E7E7E7',
            width: '100%',
            padding: 20,
            boxSizing: 'border-box',
            '& .MuiGrid-root.MuiGrid-container': {
                alignItems: 'center'
            },
            '& .repnotes-input-label-container': {
                paddingTop: 'unset!important'
            },
            '& .MuiInputBase-root.Mui-disabled': {
                backgroundColor: '#EEEEEE'
            }
        }
    })
)(Box);

export const ProfileSettingsStrengthContainer = withStyles(
    () => ({
        root: {
            backgroundColor: '#CCCCCC',
            position: 'relative',
            top: -8,
            zIndex: 2,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8
        }
    })
)(Box);

export const ProfileSettingsStrengthBox = withStyles(
    () => ({
        root: {
            height: 4,
            transition: 'all 200ms',
        }
    })
)(Box);

