/**
 * Popover for handling excess filters 
 * excess filters - filters that cannot fit the screen
 */
import { ReactNode, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { RepnotesPrimaryButton } from '../../../common/RepnotesButton';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TuneIcon from '@material-ui/icons/Tune';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { RepnotesInput } from '../../../common/RepnotesInput';
import Export from '../../../../assets/images/export.png'
import Import from '../../../../assets/images/import.png';
import GetTemplate from '../../../../assets/images/get_template.png';
 
 const MarginReportFilterPopover = ({ 
     children, 
     onExportClick,
     importMarginReportData,
     role
}: { 
    children: ReactNode | Array<ReactNode>; 
    onExportClick: () => void;
    importMarginReportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
    role: boolean;
}) => {
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
            {
                role &&
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
            }
            <Link 
                to="/templates/margin-report.xlsx" 
                target="_blank" 
                style={{ 
                    height: 36,
                    color: '#272B75',
                    backgroundColor: '#f4f4f4',
                    borderRadius: 3,
                    padding: '7px 16px',
                    minWidth: 100,
                    textTransform: 'none', 
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    marginLeft: 8
                }} 
                download
            >
                <img src={GetTemplate} alt="" style={{ width: 18, height: 18, objectFit: 'cover', marginRight: 4 }} />
                Get Template
            </Link>
            <Box style={{ height: 46, display: 'flex', alignItems: 'flex-end', boxSizing: 'border-box', marginLeft: 10 }}>
                <RepnotesInput
                    fileStartIcon={<img src={Import} alt="" style={{ width: 18, height: 18, objectFit: 'cover' }} />}
                    id="repnotes-margin-import"
                    type="file"
                    uploadLabel="Import"
                    multiUpload={false}
                    uploadIcon={false}
                    value=""
                    onChange={importMarginReportData}
                />
            </Box>
            <RepnotesPrimaryButton 
                startIcon={<img src={Export} alt="" style={{ width: 18, height: 18, objectFit: 'cover' }} />}
                style={{ height: 36, alignSelf: 'unset', width: 120, boxSizing: 'border-box', marginRight: 0}}
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
 
 export default MarginReportFilterPopover;