import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuery, useQueryClient } from 'react-query';
import { ServiceRequestTable } from '../../components/ServiceRequests/ServiceRequestTable';
import { ServiceRequestDialog } from '../../components/ServiceRequests/ServiceRequestDialog';
import { serviceRequestService } from '../../services/serviceRequestService';
import { ServiceRequest } from '../../types/common';

export const ServiceRequests: React.FC = () => {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const { data: serviceRequests = [], isLoading, error } = useQuery(
    'serviceRequests',
    () => serviceRequestService.getAll()
  );

  const handleCreate = () => {
    setSelectedRequest(null);
    setDialogOpen(true);
  };

  const handleEdit = (serviceRequest: ServiceRequest) => {
    setSelectedRequest(serviceRequest);
    setDialogOpen(true);
  };

  const handleDelete = (serviceRequest: ServiceRequest) => {
    setSelectedRequest(serviceRequest);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleDialogSubmit = async (data: Partial<ServiceRequest>) => {
    try {
      if (selectedRequest) {
        await serviceRequestService.update(selectedRequest.id, data);
      } else {
        await serviceRequestService.create(data);
      }
      queryClient.invalidateQueries('serviceRequests');
      handleDialogClose();
      setNotification({
        open: true,
        message: 'Service request saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving service request:', error);
      setNotification({
        open: true,
        message: 'Error saving service request',
        severity: 'error'
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedRequest) {
      try {
        await serviceRequestService.delete(selectedRequest.id);
        queryClient.invalidateQueries('serviceRequests');
        setDeleteDialogOpen(false);
        setSelectedRequest(null);
        setNotification({
          open: true,
          message: 'Service request deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting service request:', error);
        setNotification({
          open: true,
          message: 'Error deleting service request',
          severity: 'error'
        });
      }
    }
  };

  const handleNotificationClose = () => {
    setNotification({
      open: false,
      message: '',
      severity: 'info'
    });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries('serviceRequests');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading service requests. Please try refreshing the page.
        </Alert>
        <Button variant="contained" onClick={() => queryClient.invalidateQueries('serviceRequests')}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Service Requests</Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Create Request
            </Button>
          </Box>
        </Box>
        <ServiceRequestTable
          serviceRequests={serviceRequests}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Paper>

      <ServiceRequestDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        initialData={selectedRequest || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this service request?
            {selectedRequest && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="primary">Request Details:</Typography>
                <Typography variant="body2">ID: {selectedRequest.id}</Typography>
                <Typography variant="body2">Status: {selectedRequest.status}</Typography>
                <Typography variant="body2">Service Requested: {selectedRequest.service_requested}</Typography>
              </Box>
            )}
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert severity={notification.severity}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
};
