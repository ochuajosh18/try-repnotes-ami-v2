import React from 'react';
import { 
  RepnotesAddButton, 
  RepnotesPrimaryButton, 
  RepnotesSuccessButton 
} from '../../common/RepnotesButton';
import { 
  makeStyles, 
  createStyles, 
  Theme 
} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

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

interface RepnotesFeaturePopoverButtonProps {
    onDialogOpen: (option: string) => void;
}

export const RepnotesFeaturePopoverButton = (props: RepnotesFeaturePopoverButtonProps) => {
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
        <RepnotesAddButton
            aria-describedby={id}
            onClick={handleClick}
        >
            <AddRoundedIcon />
        </RepnotesAddButton>
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
            <RepnotesSuccessButton 
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
            </RepnotesPrimaryButton>
        </Box>
      </Popover>
    </div>
  );
}
