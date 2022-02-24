import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { RepnotesDangerButton, RepnotesPrimaryButton } from './RepnotesButton';
import { withStyles } from '@material-ui/styles';
import Popover from '@material-ui/core/Popover';
import RepnotesAltLogo from '../../assets/images/repnotes-logo-crop.png';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
// icon
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


const AccountsPopover = withStyles(
    () => ({
        root: {
            marginTop: '44px',
            padding: '10px',
            '& .MuiPaper-root' : {
                padding: '10px',
            }
        }
    }) 
)(Popover)

interface RepnotesProfilePopoverProps {
    name: string;
    email: string;
    memberDate: string | Date;
}

export const RepnotesProfilePopover =  ({name, email, memberDate}: RepnotesProfilePopoverProps) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (e: any) => {
        setAnchorEl(e.currentTarget);
    };
    
    const open = Boolean(anchorEl);
    const id = open ? "account-popover" : undefined;

    return (
        <Box>
            <Box style= {{ color: '#121336', display: 'flex', justifyContent: 'space-between', cursor: 'pointer'}}  onClick={ handleClick } aria-describedby={id}>
                <AccountCircleIcon />
                <Typography variant= "body1" style= {{ fontWeight: 700, fontSize: '14px', paddingTop: '1%' }}>
                     {name}
                </Typography>
                {(open)? 
                        <KeyboardArrowUpIcon style= {{color: '#49BCF8'}} /> 
                    : 
                        <KeyboardArrowDownIcon style= {{color: '#49BCF8'}}/> 
                }
            </Box>

            <AccountsPopover  
                    id= {id}
                    open= {open}
                    onClose= {() => setAnchorEl(null)}
                    anchorEl= {anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                <Box style={{ textAlign:"center", justifyContent: 'center'  }}>
                    <img src= {RepnotesAltLogo} alt= "" style= {{height:'117px', width:'117px'}} />
                </Box>
                <Box style={{width: '300px', height: 'auto', display: 'block', textAlign: "center", }}>
                    <Typography 
                        variant= "body1" 
                        style= {{ fontWeight: 700, fontSize: '14px' }}
                    >
                        {name}
                    </Typography>
                    <Typography 
                        variant= "body2" 
                        style= {{ fontSize: '14px' }}
                    >
                        {email}
                    </Typography>
                    <Typography variant= "body2" style= {{ opacity: '50%' , fontSize: '14px' }}>
                        {`Member since : ${moment(memberDate).format('LL')}`}
                    </Typography>
                </Box>
                <Box style={{ width:'300px', textAlign:"center", padding:'20px 0px'}}>
                    <Link to="/profile" style={{ textTransform: 'none', textDecoration: 'none' }} onClick={() => setAnchorEl(null)}>
                        <RepnotesPrimaryButton > Profile </RepnotesPrimaryButton>
                    </Link>
                    <Link to="/logout" style={{ textTransform: 'none', textDecoration: 'none' }}>
                        <RepnotesDangerButton >
                            Sign Out
                        </RepnotesDangerButton>
                    </Link>
                </Box>
            </AccountsPopover>
        </Box>
    )
}