import React, { useState } from 'react';
import './Locations.css';
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
import UploadIcon from '@mui/icons-material/Upload';
import { useQuery, useQueryClient } from 'react-query';
import { LocationTable } from './LocationTable';
import { LocationDialog } from './LocationDialog';
import { locationService } from '../../services/locationService';
import { Location } from '../../types/common';

export const Locations: React.FC = () => {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
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

  const { data: locations = [], isLoading, error } = useQuery(
    'locations',
    () => locationService.getAll()
  );

  const handleCreate = () => {
    setSelectedLocation(null);
    setDialogOpen(true);
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setDialogOpen(true);
  };

  const handleDelete = (location: Location) => {
    setSelectedLocation(location);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedLocation(null);
  };

  const handleDialogSubmit = async (data: Partial<Location>) => {
    try {
      if (selectedLocation) {
        await locationService.update(selectedLocation.id, data);
      } else {
        if (!data.name) {
          throw new Error('Name is required for creating a location');
        }
        await locationService.create(data as Pick<Location, 'name'> & Partial<Omit<Location, 'name'>>);
      }
      queryClient.invalidateQueries('locations');
      handleDialogClose();
      setNotification({
        open: true,
        message: 'Location saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving location:', error);
      setNotification({
        open: true,
        message: 'Error saving location',
        severity: 'error'
      });
    }
  };

  const confirmDelete = async () => {
    if (selectedLocation) {
      try {
        await locationService.delete(selectedLocation.id);
        queryClient.invalidateQueries('locations');
        setDeleteDialogOpen(false);
        setSelectedLocation(null);
        setNotification({
          open: true,
          message: 'Location deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error deleting location:', error);
        setNotification({
          open: true,
          message: 'Error deleting location',
          severity: 'error'
        });
      }
    }
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await locationService.importCsv(file);
        setNotification({
          open: true,
          message: `Imported ${result.success} locations successfully. ${result.errors} errors.`,
          severity: result.errors === 0 ? 'success' : 'warning'
        });
        queryClient.invalidateQueries('locations');
      } catch (error) {
        console.error('Error importing CSV:', error);
        setNotification({
          open: true,
          message: 'Error importing CSV file',
          severity: 'error'
        });
      }
    }
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
        <Alert severity="error">
          Error loading locations. Please try refreshing the page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Locations</Typography>
          <Box>
            <input
              type="file"
              accept=".csv"
              className="hidden-file-input"
              id="csv-upload"
              onChange={handleCsvUpload}
            />
            <label htmlFor="csv-upload">
              <Button
                component="span"
                variant="outlined"
                startIcon={<UploadIcon />}
                sx={{ mr: 1 }}
              >
                Import CSV
              </Button>
            </label>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Create Location
            </Button>
          </Box>
        </Box>

        <LocationTable
          locations={locations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <LocationDialog
          open={dialogOpen}
          location={selectedLocation}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
        />

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this location?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};
