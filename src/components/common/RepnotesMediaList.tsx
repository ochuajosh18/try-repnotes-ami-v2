import Box from '@material-ui/core/Box';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { 
    Theme, 
    createStyles, 
    makeStyles 
} from '@material-ui/core/styles';



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            flexWrap: 'nowrap',
            transform: 'translateZ(0)',
        },
        title: {
            color: '#fff',
            fontSize: 12
        },
        redIcon: {
            color: '#dd4b39',
        },
        titleBar: {
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        }
    }),
);
 
interface RepnotesMediaListInterface {
    data: Array<{ [property: string]: string | number | File }>;
    cols: number;
    name?: string;
    onDeleteClick: (name?: string) => void;
    mediaType?: 'video' | 'image';
    disabled?: boolean;
}

export const RepnotesMediaList = (props: RepnotesMediaListInterface) => {
    const classes = useStyles();
    const { data, cols, onDeleteClick, mediaType, disabled } = props;
    return(
        <Box className={classes.root}>
            <GridList className={classes.gridList} cols={cols}>
                {data.map((tile) => (
                <GridListTile style={{ height: 120, width: 120 }} key={tile.title as string}>
                    { mediaType === 'image' && 
                        <img src={tile.img as string} alt={tile.title as string} />
                    }
                    { mediaType === 'video' &&
                        <video controls>
                            <source src={tile.img as string}></source>
                        </video>
                    }
                    <GridListTileBar
                    title={tile.title}
                    classes={{
                        root: classes.titleBar,
                        title: classes.title,
                    }}
                    actionIcon={
                        !disabled &&
                        <IconButton 
                            aria-label={`delete ${tile.title}`}
                            onClick={() => {
                                onDeleteClick(tile.title as string)
                            }}
                            >
                            <DeleteIcon className={classes.redIcon} />
                        </IconButton>
                    }
                    />
                </GridListTile>
                ))}
            </GridList>
        </Box>
    )
}