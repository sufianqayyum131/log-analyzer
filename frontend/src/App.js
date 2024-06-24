// src/App.js
import React, { useState } from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme, Box, Typography, TextField, Button, Paper } from '@mui/material';
import UploadForm from './components/UploadForm';
import LogTable from './components/LogTable';
import axios from 'axios';

const customTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#2e3440',
      paper: '#3b4252',
    },
    text: {
      primary: '#d8dee9',
      secondary: '#e5e9f0',
    },
    primary: {
      main: '#88c0d0',
    },
    secondary: {
      main: '#81a1c1',
    },
    error: {
      main: '#bf616a',
    },
    warning: {
      main: '#ebcb8b',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  const [logs, setLogs] = useState([]);
  const [frequentErrors, setFrequentErrors] = useState({});
  const [gptResponse, setGptResponse] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogsReceived = (logData) => {
    setLogs(logData);
    calculateFrequentErrors(logData);
  };

  const calculateFrequentErrors = (logData) => {
    const errorCount = {};
    logData.forEach(log => {
      const key = `${log.file}::${log.message}`;
      if (errorCount[key]) {
        errorCount[key]++;
      } else {
        errorCount[key] = 1;
      }
    });
    setFrequentErrors(errorCount);
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleQuerySubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/query', { query });
      if (response.data.status === 'success') {
        setGptResponse(response.data.response);
      } else {
        setGptResponse(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error submitting query', error);
      setGptResponse('Error submitting query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ marginTop: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Log Analyzer
          </Typography>
          <Paper elevation={2} sx={{ padding: 2, backgroundColor: '#3b4252', color: '#d8dee9', marginBottom: 4 }}>
            <TextField
              label="Enter your query"
              variant="outlined"
              fullWidth
              value={query}
              onChange={handleQueryChange}
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleQuerySubmit} disabled={loading}>
              {loading ? 'Processing...' : 'Submit Query'}
            </Button>
          </Paper>
        </Box>
        <UploadForm onLogsReceived={handleLogsReceived} />
        <LogTable logs={logs} frequentErrors={frequentErrors} gptResponse={gptResponse} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
