import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Layout from './styles/Layout.jsx';
import { CustomCard } from './components/custom/Card.jsx';
import Headings from './router/Headings.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <Headings title="Error Occurred" />
          <CustomCard>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                minHeight: '400px',
                textAlign: 'center',
              }}
            >
              <ErrorOutlineIcon
                sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
              />
              <Typography variant="h4" sx={{ mb: 2 }}>
                An error occurred
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 600 }}
              >
                Oops! Something went wrong. Try refreshing the page or come back later.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
            </Box>
          </CustomCard>
        </Layout>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
