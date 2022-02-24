/**
 * Popover for handling excess filters 
 * excess filters - filters that cannot fit the screen
 */
import { ReactNode, useState, MouseEvent } from 'react';
import { RepnotesPrimaryButton } from '../../../common/RepnotesButton';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TuneIcon from '@material-ui/icons/Tune';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Export from '../../../../assets/images/export.png';

const QuotesByStatusFilterPopover = ({ children, onExportClick }: { children: ReactNode | Array<ReactNode>; onExportClick: () => void; }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;

    return (
        <Box height="100%" width="100%" display="flex" alignItems="flex-end" boxSizing="border-box" padding="6px 0"> 
            <Box 
                display="flex" 
                justifyContent="space-between" 
                border="1px solid #d2d6de"
                borderRadius="5px"
                padding="5px 10px"
                width="120px"
                style={{ cursor: 'pointer' }}
                onClick={handleClick} 
                bgcolor="#49BCF8"
                boxSizing="border-box"
                aria-describedby={id}
            >
                <TuneIcon htmlColor="#FFF" />
                <Typography variant="body1" style={{ fontWeight: 550, color:'#fff', fontSize: '13px', padding: '2% 8px 0 8px' }}>
                      Filter
                </Typography>
                {(open)? 
                        <KeyboardArrowUpIcon htmlColor="#FFF" /> 
                    : 
                        <KeyboardArrowDownIcon htmlColor="#FFF" /> 
                }
                
            </Box>
            <RepnotesPrimaryButton 
                startIcon={<img src={Export} alt="" style={{ width: 18, height: 'auto' }} />}
                style={{ height: 36, alignSelf: 'unset', width: 120, boxSizing: 'border-box'}}
                onClick={onExportClick}
            >
                Export
            </RepnotesPrimaryButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box width="300px" padding="20px" boxSizing="border-box">
                    {children}
                </Box>
            </Popover>
        </Box>
    );
}

export default QuotesByStatusFilterPopover;