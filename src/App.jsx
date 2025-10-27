import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import ContactsGrid from './components/ContactsGrid.jsx';
import ContactForm from './components/ContactForm.jsx';
import HealthCheck from './components/HealthCheck.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UserProfile from './components/UserProfile.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { contactsApi } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function CrmInterface() {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, contactId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchContacts();
  }, [currentPage, pageSize, sortField, sortOrder]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        sort: sortField,
        order: sortOrder
      };

      const response = await contactsApi.getAll(params);
      if (response.data.success) {
        setContacts(response.data.data);

        // Handle both paginated and non-paginated responses
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          // Non-paginated response - create basic pagination info
          setPagination({
            current_page: 1,
            per_page: response.data.data.length,
            total: response.data.data.length,
            total_pages: 1,
            has_next: false,
            has_previous: false
          });
        }
      } else {
        showSnackbar('Failed to fetch contacts', 'error');
      }
    } catch (error) {
      showSnackbar('Error fetching contacts: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setFormOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setFormOpen(true);
  };

  const handleSaveContact = async (contactData) => {
    try {
      let response;
      if (editingContact) {
        response = await contactsApi.update(editingContact.id, contactData);
      } else {
        response = await contactsApi.create(contactData);
      }

      if (response.data.success) {
        showSnackbar(response.data.message);
        setFormOpen(false);
        fetchContacts();
      } else {
        showSnackbar(response.data.message, 'error');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        showSnackbar(error.response.data.message, 'error');
      } else {
        showSnackbar('Error saving contact: ' + error.message, 'error');
      }
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSortChange = (field, order) => {
    if (field && order) {
      setSortField(field);
      setSortOrder(order);
      setCurrentPage(1); // Reset to first page when changing sort
    } else {
      // Reset to default sort
      setSortField('created_at');
      setSortOrder('desc');
      setCurrentPage(1);
    }
  };

  const handleDeleteContact = (contactId) => {
    setDeleteDialog({ open: true, contactId });
  };

  const confirmDelete = async () => {
    try {
      const response = await contactsApi.delete(deleteDialog.contactId);
      if (response.data.success) {
        showSnackbar(response.data.message);
        fetchContacts();
      } else {
        showSnackbar(response.data.message, 'error');
      }
    } catch (error) {
      showSnackbar('Error deleting contact: ' + error.message, 'error');
    } finally {
      setDeleteDialog({ open: false, contactId: null });
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            tenant1 CRM
          </Typography>
          <UserProfile />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <HealthCheck />
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Contact Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Simple contact management system
            {pagination && (
              <> • {pagination.total} total contacts</>
            )}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddContact}
            sx={{ mt: 2 }}
          >
            Add Contact
          </Button>
        </Box>

        <ContactsGrid
          contacts={contacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSortChange={handleSortChange}
        />

        <ContactForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSaveContact}
          contact={editingContact}
        />

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, contactId: null })}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this contact? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, contactId: null })}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProtectedRoute>
          <CrmInterface />
        </ProtectedRoute>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;