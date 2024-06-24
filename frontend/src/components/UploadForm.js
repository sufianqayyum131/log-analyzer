import React, { useState } from 'react';
import { Button, TextField, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

function UploadForm({ onLogsReceived, onFrequentErrorsReceived }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const file = formData.get('file');
    if (!file) return;

    setLoading(true);
    setStatus('Uploading and processing file...');

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.status === 'success') {
        setStatus('File uploaded, extracted, and analyzed successfully!');
        onLogsReceived(response.data.data);
        onFrequentErrorsReceived(response.data.frequent_errors);
      } else {
        setStatus(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error uploading file', error);
      setStatus('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleUpload} sx={{ textAlign: 'center', marginTop: 4 }}>
      <TextField
        type="file"
        name="file"
        inputProps={{ accept: '.zip' }}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Upload and Analyze'}
      </Button>
      {status && (
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
          {status}
        </Typography>
      )}
    </Box>
  );
}

export default UploadForm;
