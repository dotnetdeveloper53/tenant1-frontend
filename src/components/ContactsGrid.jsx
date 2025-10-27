import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import PaginationControls from './PaginationControls.jsx';

const ContactsGrid = ({
  contacts,
  onEdit,
  onDelete,
  loading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSortChange
}) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'first_name', headerName: 'First Name', width: 120 },
    { field: 'last_name', headerName: 'Last Name', width: 120 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'company', headerName: 'Company', width: 150 },
    { field: 'job_title', headerName: 'Job Title', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => onEdit(params.row)}
            size="small"
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            onClick={() => onDelete(params.row.id)}
            size="small"
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleSortModelChange = (sortModel) => {
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      onSortChange?.(field, sort);
    } else {
      onSortChange?.(null, null);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={contacts}
          columns={columns}
          loading={loading}
          disableSelectionOnClick
          hideFooter
          sortingMode="server"
          onSortModelChange={handleSortModelChange}
          sx={{
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
        />
      </Box>

      {/* Custom Pagination Controls */}
      {pagination && (
        <PaginationControls
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          pageSize={pagination.per_page}
          totalItems={pagination.total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          loading={loading}
        />
      )}
    </Box>
  );
};

export default ContactsGrid;