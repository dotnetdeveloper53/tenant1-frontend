import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle } from '@mui/material';
import axios from 'axios';

const HealthCheck = () => {
  const [status, setStatus] = useState({ healthy: null, message: '' });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get('https://tenant1-dev.example.com/api/health');
        if (response.data.success) {
          setStatus({ healthy: true, message: response.data.message });
        }
      } catch (error) {
        setStatus({
          healthy: false,
          message: 'Backend API is not accessible. Make sure the PHP server is running on port 9001.'
        });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (status.healthy === null) return null;

  return (
    <Alert severity={status.healthy ? 'success' : 'warning'} sx={{ mb: 2 }}>
      <AlertTitle>{status.healthy ? 'API Connected' : 'API Connection Issue'}</AlertTitle>
      {status.message}
    </Alert>
  );
};

export default HealthCheck;