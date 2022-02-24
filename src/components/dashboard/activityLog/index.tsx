import React from "react";
import ErrorBoundary from "../../common/ErrorBoundary";
import ActivityLogContainer from "./fragments/ActivityLogContainer";
import ActivityLogFilters from "./fragments/ActivityLogFilters";
import ActivityLogTables from "./fragments/ActivityLogTables";

const ActivityLog = () => {
  return (
    <ErrorBoundary>
      <ActivityLogContainer>
        <ActivityLogFilters />
        <ActivityLogTables />
      </ActivityLogContainer>
    </ErrorBoundary>
  );
};

export default ActivityLog;
