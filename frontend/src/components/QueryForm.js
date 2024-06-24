// src/components/QueryForm.js
import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

function QueryForm({ onQueryResponse }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('Submitting query...');

    try {
      const response = await axios.post('http://localhost:5000/query', { query });
      if (response.data.status === 'success') {
        onQueryResponse(response.data.response);
        setStatus('Query submitted successfully!');
      } else {
        setStatus(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error submitting query', error);
      setStatus('Error submitting query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleQuery} sx={{ textAlign: 'center', marginTop: 4 }}>
      <TextField
        label="Enter your query"
        variant="outlined"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Submit Query'}
      </Button>
      {status && (
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
          {status}
        </Typography>
      )}
    </Box>
  );
}

export default QueryForm;
