import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { RepnotesPrimaryButton } from './RepnotesButton';
import { RepnotesInput } from './RepnotesInput';
import { ChangeEvent } from 'react';


interface RepnotesTableToolButtonProps {
    img: string;
    title: string;
    onClick?: () => void;
    onFileChange?: (file: ChangeEvent<HTMLInputElement>) => void;
    type: 'link' | 'file' | 'buttom';
    linkTo?: string;
    disabled?: boolean;
}

const RepnotesTableToolButton = (props: RepnotesTableToolButtonProps) => (
    <Box display="flex" marginRight="8px" height="100%" boxSizing="border-box" paddingBottom="5px" alignItems="flex-end">
        {props.type === 'link' &&
            <Link 
                to={props.linkTo || ''} 
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
                    pointerEvents: props.disabled ? 'none' : 'all',
                    opacity: props.disabled ? 0.5 : 1
                }} 
                download
                onClick={(e) => props.disabled && e.preventDefault()}
            >
                <img src={props.img} alt="" style={{ width: 18, height: 18, objectFit: 'cover', marginRight: 4 }} />
                {props.title}
            </Link>
        }
        {props.type === 'file' &&
            <RepnotesInput
                id="repnotes-toolbar-file"
                type="file"
                uploadLabel={props.title}
                multiUpload={false}
                uploadIcon={false}
                fileStartIcon={<img src={props.img} alt="" style={{ width: 18, height: 18, objectFit: 'cover', marginRight: 4 }} />}
                value=""
                onChange={props.onFileChange}
                inputHeight={34}
                disabled={props.disabled ?? undefined}
            />
        }
        {props.type === 'buttom' &&
            <RepnotesPrimaryButton
                startIcon={<img src={props.img} alt="" style={{ width: 18, height: 18, objectFit: 'cover' }} />}
                style={{ height: 34, alignSelf: 'unset', width: 120, boxSizing: 'border-box', marginLeft: 0, marginRight: 0}}
                onClick={props.onClick}
            >
                {props.title}
            </RepnotesPrimaryButton>
        }
    </Box>
)

export default RepnotesTableToolButton;