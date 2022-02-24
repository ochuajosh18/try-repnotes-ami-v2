import React, { Component, ErrorInfo, ReactNode } from "react";
import Box from "@material-ui/core/Box";
import { Alert, AlertTitle } from "@material-ui/lab";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(e: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: e.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box padding='20px' display='flex' width='100%'>
          <Alert severity='error'>
            <AlertTitle>An Error has occurred:</AlertTitle>
            {this.state.error}
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
