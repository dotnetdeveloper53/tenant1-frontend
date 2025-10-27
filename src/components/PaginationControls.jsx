import React from 'react';
import {
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip
} from '@mui/material';

const PaginationControls = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  loading = false
}) => {
  const pageSizeOptions = [10, 25, 50, 100];

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mt: 2,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Results Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem} of {totalItems} contacts
        </Typography>
        <Chip
          label={`${totalItems} total`}
          size="small"
          variant="outlined"
          color="primary"
        />
      </Box>

      {/* Page Size Selector */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Per page</InputLabel>
        <Select
          value={pageSize}
          label="Per page"
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={loading}
        >
          {pageSizeOptions.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => onPageChange(page)}
        disabled={loading}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
      />
    </Box>
  );
};

export default PaginationControls;