import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { assetService } from '../../services/assetService';
import { categoryService, Category } from '../../services/categoryService';
import { locationService, Location } from '../../services/locationService';
import { Asset, AssetStatus } from '../../types/common';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    asset_number: '',
    name: '',
    description: null as string | null,
    category: null as string | null,
    manufacturer: null as string | null,
    model: null as string | null,
    serial_number: null as string | null,
    manufacture_date: null as string | null,
    purchase_date: null as string | null,
    purchase_price: null as number | null,
    warranty_expiry: null as string | null,
    in_service_date: null as string | null,
    where_used: null as string | null,
    status: null as AssetStatus | null,
    location_id: null as string | null,
    notes: null as string | null,
  });

  const loadAssets = async () => {
    try {
      console.log('Fetching assets...');
      const data = await assetService.getAll();
      console.log('Fetched assets:', data);
      setAssets(data);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  useEffect(() => {
    console.log('Component mounted');
    loadAssets();
    
    // Load categories and locations when component mounts
    const loadData = async () => {
      try {
        console.log('Fetching categories...');
        const categoryData = await categoryService.getAll();
        console.log('Fetched categories:', categoryData);
        setCategories(categoryData);

        console.log('Fetching locations...');
        const locationData = await locationService.getAll();
        console.log('Fetched locations:', locationData);
        setLocations(locationData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleOpenDialog = (asset?: Asset) => {
    if (asset) {
      setSelectedAsset(asset);
      setFormData({
        asset_number: asset.asset_number ?? null,
        name: asset.name ?? null,
        description: asset.description ?? null,
        category: asset.category ?? null,
        manufacturer: asset.manufacturer ?? null,
        model: asset.model ?? null,
        serial_number: asset.serial_number ?? null,
        manufacture_date: asset.manufacture_date ?? null,
        purchase_date: asset.purchase_date ?? null,
        purchase_price: asset.purchase_price ?? null,
        warranty_expiry: asset.warranty_expiry ?? null,
        in_service_date: asset.in_service_date ?? null,
        where_used: asset.where_used ?? null,
        status: asset.status ?? null,
        location_id: asset.location_id ?? null,
        notes: asset.notes ?? null,
      });
    } else {
      setSelectedAsset(null);
      setFormData({
        asset_number: '',
        name: '',
        description: null,
        category: null,
        manufacturer: null,
        model: null,
        serial_number: null,
        manufacture_date: null,
        purchase_date: null,
        purchase_price: null,
        warranty_expiry: null,
        in_service_date: null,
        where_used: null,
        status: null,
        location_id: null,
        notes: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAsset(null);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.asset_number.trim()) {
        alert('Asset Number is required');
        return;
      }
      if (!formData.name.trim()) {
        alert('Name is required');
        return;
      }

      // Clean up form data
      const cleanedFormData = {
        ...formData,
        // Only trim strings that are not null
        description: formData.description?.trim() || null,
        category: formData.category?.trim() || null,
        manufacturer: formData.manufacturer?.trim() || null,
        model: formData.model?.trim() || null,
        serial_number: formData.serial_number?.trim() || null,
        where_used: formData.where_used?.trim() || null,
        location_id: formData.location_id?.trim() || null,
        notes: formData.notes?.trim() || null,
      };

      if (selectedAsset) {
        await assetService.update(selectedAsset.id, cleanedFormData);
      } else {
        await assetService.create(cleanedFormData);
      }
      handleCloseDialog();
      loadAssets();
    } catch (error) {
      console.error('Error saving asset:', error);
      if (error instanceof Error) {
        alert(`Error saving asset: ${error.message}`);
      } else {
        alert('Error saving asset. Please check the console for details.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetService.delete(id);
        loadAssets();
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Assets</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Asset
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset Number</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell>Manufacture Date</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.asset_number}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.description}</TableCell>
                  <TableCell>{asset.model}</TableCell>
                  <TableCell>{asset.manufacturer}</TableCell>
                  <TableCell>{asset.manufacture_date ? new Date(asset.manufacture_date).toLocaleDateString() : ''}</TableCell>
                  <TableCell>{asset.location?.name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(asset)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(asset.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{selectedAsset ? 'Edit Asset' : 'Add Asset'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, pt: 2 }}>
              <TextField
                label="Asset Number"
                value={formData.asset_number}
                onChange={(e) => setFormData({ ...formData, asset_number: e.target.value })}
                required
              />
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <TextField
                label="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                multiline
                rows={2}
                sx={{ gridColumn: 'span 2' }}
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category || ''}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value || null })}
                >
                  <MenuItem value="">None</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Model"
                value={formData.model || ''}
                onChange={(e) => setFormData({ ...formData, model: e.target.value || null })}
              />
              <TextField
                label="Manufacturer"
                value={formData.manufacturer || ''}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value || null })}
              />
              <TextField
                label="Serial Number"
                value={formData.serial_number || ''}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value || null })}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Manufacture Date"
                  value={formData.manufacture_date ? new Date(formData.manufacture_date) : null}
                  onChange={(date) => setFormData({ ...formData, manufacture_date: date ? date.toISOString() : null })}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Purchase Date"
                  value={formData.purchase_date ? new Date(formData.purchase_date) : null}
                  onChange={(date) => setFormData({ ...formData, purchase_date: date ? date.toISOString().split('T')[0] : null })}
                />
              </LocalizationProvider>
              <TextField
                label="Purchase Price"
                type="number"
                value={formData.purchase_price || ''}
                onChange={(e) => setFormData({ ...formData, purchase_price: (e.target as HTMLInputElement).valueAsNumber })}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Warranty Expiry"
                  value={formData.warranty_expiry ? new Date(formData.warranty_expiry) : null}
                  onChange={(date) => setFormData({ ...formData, warranty_expiry: date ? date.toISOString().split('T')[0] : null })}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="In Service Date"
                  value={formData.in_service_date ? new Date(formData.in_service_date) : null}
                  onChange={(date) => setFormData({ ...formData, in_service_date: date ? date.toISOString().split('T')[0] : null })}
                />
              </LocalizationProvider>
              <TextField
                label="Where Used"
                value={formData.where_used || ''}
                onChange={(e) => setFormData({ ...formData, where_used: e.target.value || null })}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status || ''}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="In Service">In Service</MenuItem>
                  <MenuItem value="Out of Service">Out of Service</MenuItem>
                  <MenuItem value="Scrapped">Scrapped</MenuItem>
                  <MenuItem value="Sold">Sold</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={formData.location_id || ''}
                  onChange={(e) => setFormData({ ...formData, location_id: e.target.value || null })}
                  label="Location"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
                multiline
                rows={2}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {selectedAsset ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default Assets;
