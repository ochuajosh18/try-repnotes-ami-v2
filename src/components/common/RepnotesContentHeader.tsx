import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

interface RepnotesContentHeaderProps {
    moduleName: string;
    subModule?: string;
    secondSubModule?: string;
}

export const RepnotesContentHeader = ({moduleName, subModule, secondSubModule}: RepnotesContentHeaderProps ) => {
    return(
        <Grid item xs={12} style= {{ textAlign: 'left', paddingTop: '20px' }}>
            <Typography variant= 'h6' style= {{ fontWeight:550 }}>
                {moduleName}
                {subModule && <Typography display="inline"> <ArrowForwardIosIcon style={{ fontSize: 14 }} /> {subModule} </Typography>}
                {secondSubModule && <Typography display="inline"> <ArrowForwardIosIcon style={{ fontSize: 14 }} /> {secondSubModule} </Typography>}
            </Typography>
        </Grid>
    )
}