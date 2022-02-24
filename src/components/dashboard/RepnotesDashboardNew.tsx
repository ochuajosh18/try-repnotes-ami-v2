import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { DashboardCard } from "./RepnotesDashboardComponent";

import { selectSystemState } from "../../store/system/actions";
import {
  selectDashboardState,
  getDashboardCounts,
} from "../../store/dashboard/actions";
import ActivityLog from "./activityLog";

const dateToday = moment().format("LL");

const RepnotesDashboardNew = () => {
  const dispatch = useDispatch();
  const system = useSelector(selectSystemState);
  const dashboardState = useSelector(selectDashboardState);

  const { userDetails } = system.session;
  const { loading, salespersonCount, userCount, customerCount } =
    dashboardState;

  const countsLoaded = useRef<boolean>(loading);

  useEffect(() => {
    dispatch(getDashboardCounts(userDetails.companyId));
  }, [dispatch, userDetails.companyId]);

  useEffect(() => {
    const prevLoaded = countsLoaded.current;
    if (prevLoaded !== loading) {
      countsLoaded.current = true;
    }
  }, [loading]);

  const loaderShown = loading && !countsLoaded.current;

  return (
    <Box className='repnotes-content'>
      <Grid container>
        <Grid item xs={12} style={{ textAlign: "left", paddingTop: "20px" }}>
          <Typography variant='h5' style={{ fontWeight: "bold" }}>
            {`Welcome, ${userDetails.firstName} ${userDetails.lastName}`}
          </Typography>
          <Typography paragraph>{dateToday}</Typography>
        </Grid>
        <Grid item container spacing={4}>
          <Grid item xs={12} sm={4}>
            <DashboardCard
              loading={loaderShown}
              title='Salesperson'
              counter={salespersonCount.toString()}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DashboardCard
              loading={loaderShown}
              title='Customer'
              counter={customerCount.toString()}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DashboardCard
              loading={loaderShown}
              title='Admin'
              counter={userCount.toString()}
            />
          </Grid>
        </Grid>
        <ActivityLog />
      </Grid>
    </Box>
  );
};

export default RepnotesDashboardNew;
