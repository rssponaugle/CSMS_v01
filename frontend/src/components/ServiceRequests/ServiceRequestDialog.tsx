import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';
import { ServiceRequest } from '../../types/common';
import { AssetSelector } from '../Common/AssetSelector';
import { serviceProviderService } from '../../services/serviceProviderService';

interface ServiceRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ServiceRequest>) => Promise<void>;
  initialData?: ServiceRequest;
}

const serviceStatuses = [
  'Open',
  'In Progress',
  'On Hold',
  'Closed-Completed',
  'Closed-Incomplete',
] as const;

const servicePriorities = [
  'Highest',
  'High',
  'Medium',
  'Low',
  'Lowest',
] as const;

const serviceTypes = [
  'Corrective',
  'Preventive',
  'Project',
  'Upgrade',
  'Inspection',
  'Meter Reading',
  'Safety',
  'Other',
] as const;

export const ServiceRequestDialog: React.FC<ServiceRequestDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<ServiceRequest>>({
    defaultValues: initialData || {
      status: 'Open',
      priority: 'Medium',
      service_type: 'Corrective',
    },
  });

  const { data: serviceProviders = [] } = useQuery(
    'serviceProviders',
    () => serviceProviderService.getAll()
  );

  React.useEffect(() => {
    if (open) {
      reset(initialData || {
        status: 'Open',
        priority: 'Medium',
        service_type: 'Corrective',
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (data: Partial<ServiceRequest>) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting service request:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { bgcolor: '#d3d3d3' }
      }}
    >
      <DialogTitle sx={{ color: '#0066cc', fontWeight: 600 }}>
        {initialData ? 'Edit Service Request' : 'Create Service Request'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="asset"
                control={control}
                rules={{ required: 'Asset is required' }}
                render={({ field }) => (
                  <AssetSelector
                    value={field.value || null}
                    onChange={field.onChange}
                    error={!!errors.asset}
                    helperText={errors.asset?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="service_requested"
                control={control}
                rules={{ required: 'Service description is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Service Requested"
                    multiline
                    rows={4}
                    fullWidth
                    error={!!errors.service_requested}
                    helperText={errors.service_requested?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Status"
                    fullWidth
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    {serviceStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="priority"
                control={control}
                rules={{ required: 'Priority is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Priority"
                    fullWidth
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                  >
                    {servicePriorities.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="service_type"
                control={control}
                rules={{ required: 'Service type is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Service Type"
                    fullWidth
                    error={!!errors.service_type}
                    helperText={errors.service_type?.message}
                  >
                    {serviceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Start Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.start_date,
                        helperText: errors.start_date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Due Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.due_date,
                        helperText: errors.due_date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="assigned_to"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Assigned To"
                    fullWidth
                    error={!!errors.assigned_to}
                    helperText={errors.assigned_to?.message}
                  >
                    {serviceProviders.map((provider) => (
                      <MenuItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="service_performed"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Service Performed"
                    multiline
                    rows={3}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="estimated_hours"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estimated Hours"
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="estimated_minutes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Estimated Minutes"
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { min: 0, max: 59 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="actual_hours"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Actual Hours"
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="actual_minutes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Actual Minutes"
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { min: 0, max: 59 } }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="completed_by"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Completed By"
                    fullWidth
                    error={!!errors.completed_by}
                    helperText={errors.completed_by?.message}
                  >
                    {serviceProviders.map((provider) => (
                      <MenuItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
