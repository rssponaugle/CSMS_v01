import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Location } from '../../types/common';
import { useForm, Controller } from 'react-hook-form';

interface LocationDialogProps {
  open: boolean;
  location: Location | null;
  onClose: () => void;
  onSubmit: (data: Partial<Location>) => void;
}

export const LocationDialog: React.FC<LocationDialogProps> = ({
  open,
  location,
  onClose,
  onSubmit,
}) => {
  const { control, handleSubmit, reset } = useForm<Partial<Location>>();

  useEffect(() => {
    if (location) {
      reset(location);
    } else {
      reset({
        name: '',
        description: '',
        parent_location_id: null,
      });
    }
  }, [location, reset]);

  const onSubmitForm = (data: Partial<Location>) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {location ? 'Edit Location' : 'Create Location'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            )}
          />

          <Controller
            name="parent_location_id"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel>Parent Location</InputLabel>
                <Select {...field} label="Parent Location">
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {/* Parent location options will be populated here */}
                </Select>
              </FormControl>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {location ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
