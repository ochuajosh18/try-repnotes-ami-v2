import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/styles/withStyles";

interface DashboardCardProps {
  title: string;
  counter: string;
  loading?: boolean;
}

export const DashboardCard = ({
  title,
  counter,
  loading,
}: DashboardCardProps) => {
  return (
    <Card style={{ height: "160px", backgroundColor: "#49BCF8" }}>
      <CardContent>
        <Typography
          color='textSecondary'
          style={{ color: "#fff", textAlign: "left" }}
          gutterBottom
        >
          {title}
        </Typography>
      </CardContent>
      <CardContent style={{ padding: 0 }}>
        {loading ? (
          <Box
            display='flex'
            width='100%'
            height='100%'
            justifyContent='center'
            alignItems='cebter'
          >
            <CircularProgress style={{ color: "#FFF" }} />
          </Box>
        ) : (
          <Typography
            variant='h4'
            style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
            gutterBottom
          >
            {counter}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export const ActivityPostContainer = withStyles(() => ({
  root: {
    margin: "20px 0",
    padding: "30px",
    boxSizing: "border-box",
    border: "1px solid #d3d3d3",
    borderRadius: "5px",
  },
}))(Grid);

export const DashboardFiltersContainer = withStyles(() => ({
  root: {
    padding: "20px 5px",
    boxSizing: "border-box",
  },
}))(Grid);

export const DashboardFilterGridContainer = withStyles(() => ({
  root: {
    padding: "0 5px",
    boxSizing: "border-box",
  },
}))(Grid);

export const DashboardContentContainer = withStyles(() => ({
  root: {
    padding: "10px 10px",
    boxSizing: "border-box",
    "& .MuiAccordion-root": {
      width: "100%",
    },
    "& .MuiAccordionSummary-root": {
      backgroundColor: "#9195B5",
    },
    "& .MuiAccordionSummary-root p": {
      fontSize: "12px",
      color: "#fff",
    },
    "& .MuiAccordionDetails-root": {
      padding: 0,
    },
  },
}))(Grid);
