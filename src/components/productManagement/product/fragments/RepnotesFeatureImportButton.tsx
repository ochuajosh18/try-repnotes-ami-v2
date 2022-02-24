import React, { ChangeEvent } from 'react';
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
import Import from '../../../../assets/images/import.png';
import { RepnotesInput } from '../../../common/RepnotesInput';


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

interface RepnotesFeatureImportButtonProps {
    onTriggerImportClick: (option: 'standard' | 'optional', e: ChangeEvent<HTMLInputElement>) => void;
}

const RepnotesFeatureImportButton = (props: RepnotesFeatureImportButtonProps) => {
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
            startIcon={<img src={Import} alt="" style={{ width: 18, height: 18, objectFit: 'cover' }} />}
            style={{ marginRight: 0, height: 34 }}
        >
            Import Machine Feature
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
            <Box width="100%" marginBottom="8px">
                <RepnotesInput
                    id="repnotes-standard-file"
                    type="file"
                    uploadLabel="Standard Machine Feature"
                    multiUpload={false}
                    uploadIcon={false}
                    fileStartIcon={<img src={Import} alt="" style={{ width: 18, height: 18, objectFit: 'cover', marginRight: 4 }} />}
                    value=""
                    onChange={(e) => {
                        handleClose();
                        props.onTriggerImportClick('standard', e)
                    }}
                    inputHeight={34}
                    inputWidth="100%"
                />
            </Box>
            <RepnotesInput
                id="repnotes-optional-file"
                type="file"
                uploadLabel="Optional Machine Feature"
                multiUpload={false}
                uploadIcon={false}
                fileStartIcon={<img src={Import} alt="" style={{ width: 18, height: 18, objectFit: 'cover', marginRight: 4 }} />}
                value=""
                onChange={(e) => {
                    handleClose();
                    props.onTriggerImportClick('optional', e)
                }}
                inputHeight={34}
                inputWidth="100%"
            />
        </Box>
      </Popover>
    </div>
  );
}

export default RepnotesFeatureImportButton;