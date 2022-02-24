import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RepnotesPrimaryButton, 
} from '../../../common/RepnotesButton';
import { 
  makeStyles, 
  createStyles, 
  Theme 
} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import GetTemplate from '../../../../assets/images/get_template.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
    root: {
        padding: 50
    }
  }),
);

interface RepnotesFeatureGetTemplateButtonProps {
    // onDialogOpen: (option: string) => void;
}

const RepnotesFeatureGetTemplateButton = (props: RepnotesFeatureGetTemplateButtonProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
        <RepnotesPrimaryButton
            aria-describedby={id}
            onClick={handleClick}
            style={{
                height: 34,
                color: '#272B75',
                backgroundColor: '#f4f4f4',
                borderRadius: 3,
                padding: '7px 16px',
                minWidth: 120,
                textTransform: 'none', 
                textDecoration: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
                marginRight: 0
            }}
            startIcon={<img src={GetTemplate} alt="" style={{ width: 18, height: 18, objectFit: 'cover' }} />}
        >
            Get Templates
        </RepnotesPrimaryButton>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'right',
            }}
            className={classes.root}
        >
        <Box style={{ display: 'flex', flexDirection: 'column', padding: 15 }}>
            <Link 
                to="/templates/standard-feature.xlsx" 
                target="_blank" 
                style={{ 
                    height: 34,
                    color: '#272B75',
                    backgroundColor: '#f4f4f4',
                    borderRadius: 3,
                    padding: '7px 16px',
                    minWidth: 120,
                    textTransform: 'none', 
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    marginBottom: 8,
                }} 
                download
            >
                <img src={GetTemplate} alt="" style={{ width: 18, height: 18, objectFit: 'cover', marginRight: 4 }} />
                Standard Feature Template
            </Link>
            <Link 
                to="/templates/optional-feature.xlsx" 
                target="_blank" 
                style={{ 
                    height: 34,
                    color: '#272B75',
                    backgroundColor: '#f4f4f4',
                    borderRadius: 3,
                    padding: '7px 16px',
                    minWidth: 120,
                    textTransform: 'none', 
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                }} 
                download
            >
                <img src={GetTemplate} alt="" style={{ width: 18, height: 18, objectFit: 'cover', marginRight: 4 }} />
                Optional Feature Template
            </Link>
            {/* <RepnotesSuccessButton 
            onClick={() => {
                props.onDialogOpen('standard')
                handleClose()
            }} 
            style={{ margin: 5 }}
            > 
                Standard Machine Feature
            </RepnotesSuccessButton>
            <RepnotesPrimaryButton 
            onClick={() => {
                props.onDialogOpen('optional')
                handleClose()
            }} 
            style={{ margin: 5 }}
            >
                Optional Machine Feature
            </RepnotesPrimaryButton> */}
        </Box>
      </Popover>
    </div>
  );
}

export default RepnotesFeatureGetTemplateButton