// src/components/LogTable.js
import React, { useState, useMemo } from 'react';
import { Typography, Box, Accordion, AccordionSummary, AccordionDetails, TextField, Select, MenuItem, FormControl, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import debounce from 'lodash.debounce';

function LogTable({ logs, frequentErrors, gptResponse }) {
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // Use useMemo to optimize filtering
  const filteredLogs = useMemo(() => {
    setLoading(true);
    const filtered = logs.filter(log => 
      (!filter || log.error_type.toLowerCase() === filter.toLowerCase()) &&
      (!searchTerm || log.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!dateFilter || log.timestamp.includes(dateFilter))
    );
    setLoading(false);
    return filtered;
  }, [logs, filter, searchTerm, dateFilter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const debouncedSetSearchTerm = useMemo(() => debounce(setSearchTerm, 300), []);
  
  const handleSearchTermChange = (event) => {
    debouncedSetSearchTerm(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      {gptResponse && (
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">GPT Response</Typography>
          <Paper elevation={2} sx={{ padding: 2, backgroundColor: '#3b4252', color: '#d8dee9' }}>
            <Typography variant="body2">{gptResponse}</Typography>
          </Paper>
        </Box>
      )}

      {Object.keys(frequentErrors).length > 0 && (
        <Box sx={{ marginTop: 2, marginBottom: 4 }}>
          <Typography variant="h6">Frequent Errors</Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Frequent Errors Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ padding: 2 }}>
                {Object.entries(frequentErrors).map(([errorKey, count], index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', padding: 1, borderBottom: '1px solid #d8dee9' }}>
                    <Typography sx={{ width: '80%', color: '#d8dee9' }}>{errorKey.split('::')[1]}</Typography>
                    <Typography sx={{ width: '20%', color: '#d8dee9' }}>{count}</Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Error Type</InputLabel>
          <Select value={filter} onChange={handleFilterChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="error">Error</MenuItem>
            <MenuItem value="warning">Warning</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search Message"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchTermChange}
          sx={{ minWidth: 300 }}
        />
        <TextField
          label="Filter by Date"
          type="date"
          variant="outlined"
          value={dateFilter}
          onChange={handleDateFilterChange}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#3b4252', color: '#d8dee9' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#d8dee9' }}>Line Number</TableCell>
                <TableCell sx={{ color: '#d8dee9' }}>Timestamp</TableCell>
                <TableCell sx={{ color: '#d8dee9' }}>Error Type</TableCell>
                <TableCell sx={{ color: '#d8dee9' }}>File</TableCell>
                <TableCell sx={{ color: '#d8dee9' }}>Message</TableCell>
                <TableCell sx={{ color: '#d8dee9' }}>Path</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, index) => (
                <TableRow key={index} sx={{
                  backgroundColor: log.error_type === 'error' ? 'rgba(191, 97, 106, 0.2)' :
                                    log.error_type === 'warning' ? 'rgba(235, 203, 139, 0.2)' :
                                    log.error_type === 'critical' ? 'rgba(255, 87, 87, 0.2)' : '',
                }}>
                  <TableCell>{log.line_number}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell sx={{ color: log.error_type === 'error' ? '#bf616a' :
                                           log.error_type === 'warning' ? '#ebcb8b' :
                                           log.error_type === 'critical' ? '#ff8a80' : '' }}>
                    {log.error_type}
                  </TableCell>
                  <TableCell>{log.file}</TableCell>
                  <TableCell>{log.message}</TableCell>
                  <TableCell>{log.path}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredLogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </Box>
  );
}

export default LogTable;
