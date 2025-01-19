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
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { assetService } from '../../services/assetService';
import { locationService } from '../../services/locationService';
import { Asset, Location } from '../../types/common';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './Assets.css';

interface Column {
  id: keyof Asset | 'actions';
  label: string;
  width: number;
  sortable: boolean;
}

interface ResizableTableCellProps extends Omit<React.ComponentProps<typeof TableCell>, 'onResize'> {
  onResize: (e: React.SyntheticEvent, { size }: { size: { width: number } }) => void;
  width: number;
}

const ResizableTableCell: React.FC<ResizableTableCellProps> = ({ onResize, width, ...props }) => {
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={e => e.stopPropagation()}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <TableCell {...props} style={{ width, position: 'relative' }} />
    </Resizable>
  );
};

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<Partial<Asset>>({
    id: undefined,
    asset_number: '',
    name: '',
    description: undefined,
    category: undefined,
    model: undefined,
    manufacturer: undefined,
    serial_number: undefined,
    where_used: undefined,
    status: undefined,
    location_id: undefined,
    manufacture_date: undefined,
    purchase_date: undefined,
    purchase_price: undefined,
    in_service_date: undefined,
    warranty_expiry: undefined,
    notes: undefined,
    purchased_from: undefined
  });
  type Order = 'asc' | 'desc';
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Asset>('asset_number');
  const [columns, setColumns] = useState<Column[]>([
    { id: 'asset_number', label: 'Asset Number', width: 150, sortable: true },
    { id: 'name', label: 'Name', width: 200, sortable: true },
    { id: 'description', label: 'Description', width: 200, sortable: true },
    { id: 'category', label: 'Category', width: 150, sortable: true },
    { id: 'manufacturer', label: 'Manufacturer', width: 150, sortable: true },
    { id: 'model', label: 'Model', width: 150, sortable: true },
    { id: 'status', label: 'Status', width: 150, sortable: true },
    { id: 'actions', label: 'Actions', width: 150, sortable: false }
  ]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
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
    
    // Load locations when component mounts
    const loadData = async () => {
      try {
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

  const handleSort = (property: keyof Asset) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleResize = (index: number) => (_: React.SyntheticEvent, { size }: { size: { width: number } }) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      width: size.width,
    };
    setColumns(newColumns);
  };

  const handleOpenDialog = (asset?: Asset) => {
    if (asset) {
      setFormData({
        id: asset.id,
        asset_number: asset.asset_number,
        name: asset.name,
        description: asset.description ?? undefined,
        category: asset.category ?? undefined,
        model: asset.model ?? undefined,
        manufacturer: asset.manufacturer ?? undefined,
        serial_number: asset.serial_number ?? undefined,
        where_used: asset.where_used ?? undefined,
        status: asset.status ?? undefined,
        location_id: asset.location?.id ?? undefined,
        manufacture_date: asset.manufacture_date ?? undefined,
        purchase_date: asset.purchase_date ?? undefined,
        purchase_price: asset.purchase_price ?? undefined,
        in_service_date: asset.in_service_date ?? undefined,
        warranty_expiry: asset.warranty_expiry ?? undefined,
        notes: asset.notes ?? undefined,
        purchased_from: asset.purchased_from ?? undefined
      });
    } else {
      setFormData({
        id: undefined,
        asset_number: '',
        name: '',
        description: undefined,
        category: undefined,
        model: undefined,
        manufacturer: undefined,
        serial_number: undefined,
        where_used: undefined,
        status: undefined,
        location_id: undefined,
        manufacture_date: undefined,
        purchase_date: undefined,
        purchase_price: undefined,
        in_service_date: undefined,
        warranty_expiry: undefined,
        notes: undefined,
        purchased_from: undefined
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAsset(null);
  };

  const handleSave = async () => {
    try {
      // Ensure required fields are provided
      if (!formData.asset_number || !formData.name) {
        setSnackbar({
          open: true,
          message: 'Asset number and name are required',
          severity: 'error'
        });
        return;
      }

      // At this point TypeScript knows asset_number and name are defined
      const assetData = {
        ...formData,
        asset_number: formData.asset_number,
        name: formData.name
      };

      if (formData.id) {
        await assetService.update(formData.id, assetData);
      } else {
        await assetService.create(assetData);
      }
      setOpenDialog(false);
      loadAssets();
      setSnackbar({ 
        open: true, 
        message: `Asset ${formData.id ? 'updated' : 'created'} successfully`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error saving asset:', error);
      setSnackbar({ 
        open: true, 
        message: `Error ${formData.id ? 'updating' : 'creating'} asset`, 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetService.delete(id);
        loadAssets();
        setSnackbar({ open: true, message: 'Asset deleted successfully', severity: 'success' });
      } catch (error) {
        console.error('Error deleting asset:', error);
        setSnackbar({ open: true, message: 'Error deleting asset', severity: 'error' });
      }
    }
  };

  const handleOpenDetailsDialog = (asset: Asset) => {
    setSelectedAsset(asset);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedAsset(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as keyof Asset;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value
    }));
  };

  const handleDateChange = (name: keyof Asset) => (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: date ? date.toISOString() : undefined
    }));
  };

  const sortedAssets = [...assets].sort((a, b) => {
    if (orderBy === 'location') {
      const aValue = a.location?.name?.toString().toLowerCase() || '';
      const bValue = b.location?.name?.toString().toLowerCase() || '';
      return (order === 'asc' ? 1 : -1) * (aValue < bValue ? -1 : aValue > bValue ? 1 : 0);
    }
    
    const aValue = a[orderBy]?.toString().toLowerCase() || '';
    const bValue = b[orderBy]?.toString().toLowerCase() || '';
    return (order === 'asc' ? 1 : -1) * (aValue < bValue ? -1 : aValue > bValue ? 1 : 0);
  });

  return (
    <Box sx={{ p: 1 }}>
      <Paper sx={{ p: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontSize: '1.5rem',
              fontWeight: 600 
            }}
          >
            Assets
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Asset
          </Button>
        </Box>

        <TableContainer sx={{ width: '100%' }}>
          <Table sx={{ 
            width: '100%',
            tableLayout: 'fixed',
            '& .MuiTableRow-root': { height: '14px' },
            '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(odd)': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            },
            '& .MuiTableCell-root': { 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              padding: '2px 8px',
              position: 'relative'
            },
            '& .react-resizable-handle': {
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: '10px',
              cursor: 'col-resize',
              zIndex: 1000,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }}>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <ResizableTableCell
                    key={column.id}
                    width={column.width}
                    onResize={handleResize(index)}
                    onClick={() => column.sortable && handleSort(column.id as keyof Asset)}
                    sx={{ 
                      fontWeight: 550,
                      verticalAlign: 'top',
                      cursor: column.sortable ? 'pointer' : 'default',
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width
                    }}
                    title={column.label}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {column.label}
                      {column.sortable && orderBy === column.id && (
                        <Box component="span" sx={{ ml: 1 }}>
                          {order === 'desc' ? '↓' : '↑'}
                        </Box>
                      )}
                    </Box>
                  </ResizableTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAssets.map((asset) => (
                <TableRow key={asset.id}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{ 
                        verticalAlign: 'top',
                        width: column.width,
                        maxWidth: column.width
                      }}
                      title={column.id === 'actions' ? undefined : String(asset[column.id as keyof Asset])}
                    >
                      {column.id === 'actions' ? (
                        <>
                          <IconButton onClick={() => handleOpenDetailsDialog(asset)} size="small" title="Details">
                            <InfoIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                          <IconButton onClick={() => handleOpenDialog(asset)} size="small" title="Edit">
                            <EditIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(asset.id)} size="small" title="Delete">
                            <DeleteIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </>
                      ) : column.id === 'location' ? (
                        asset.location?.name || ''
                      ) : (
                        String(asset[column.id as keyof Asset] ?? '')
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Details Dialog */}
        <Dialog
          open={openDetailsDialog}
          onClose={handleCloseDetailsDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#f5f5f5'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Asset Details</DialogTitle>
          <DialogContent>
            {selectedAsset && (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 2, 
                pt: 2,
                '& .MuiInputLabel-root': {
                  fontWeight: 550
                }
              }}>
                <TextField
                  label="Manufacture Date"
                  value={selectedAsset.manufacture_date ? new Date(selectedAsset.manufacture_date).toLocaleDateString() : ''}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Purchase Date"
                  value={selectedAsset.purchase_date ? new Date(selectedAsset.purchase_date).toLocaleDateString() : ''}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Purchase Price"
                  value={selectedAsset.purchase_price ? `$${selectedAsset.purchase_price.toFixed(2)}` : ''}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Purchased From"
                  value={selectedAsset.purchased_from || ''}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="In Service Date"
                  value={selectedAsset.in_service_date ? new Date(selectedAsset.in_service_date).toLocaleDateString() : ''}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Warranty Expiry"
                  value={selectedAsset.warranty_expiry ? new Date(selectedAsset.warranty_expiry).toLocaleDateString() : ''}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
                <TextField
                  label="Notes"
                  value={selectedAsset.notes || ''}
                  InputProps={{ readOnly: true }}
                  multiline
                  rows={4}
                  fullWidth
                  sx={{ gridColumn: 'span 2' }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailsDialog} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>{formData.id ? 'Edit Asset' : 'Add Asset'}</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: 'repeat(2, 1fr)',
                pt: 2,
                '& .MuiTextField-root': { width: '100%' },
                bgcolor: '#f5f5f5'
              }}
            >
              <TextField
                label="Asset Number"
                value={formData.asset_number}
                onChange={handleInputChange}
                name="asset_number"
                required
              />
              <TextField
                label="Name"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                required
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                name="description"
                multiline
                rows={2}
              />
              <TextField
                label="Category"
                value={formData.category}
                onChange={handleInputChange}
                name="category"
              />
              <TextField
                label="Model"
                value={formData.model}
                onChange={handleInputChange}
                name="model"
              />
              <TextField
                label="Manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                name="manufacturer"
              />
              <TextField
                label="Serial Number"
                value={formData.serial_number}
                onChange={handleInputChange}
                name="serial_number"
              />
              <TextField
                label="Where Used"
                value={formData.where_used}
                onChange={handleInputChange}
                name="where_used"
              />
              <TextField
                label="Status"
                value={formData.status}
                onChange={handleSelectChange}
                name="status"
                select
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="retired">Retired</MenuItem>
              </TextField>
              <TextField
                label="Location"
                value={formData.location_id || ''}
                onChange={handleSelectChange}
                name="location_id"
                select
              >
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </TextField>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Manufacture Date"
                  value={formData.manufacture_date ? new Date(formData.manufacture_date) : null}
                  onChange={handleDateChange('manufacture_date')}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Purchase Date"
                  value={formData.purchase_date ? new Date(formData.purchase_date) : null}
                  onChange={handleDateChange('purchase_date')}
                />
              </LocalizationProvider>
              <TextField
                label="Purchase Price"
                value={formData.purchase_price || ''}
                onChange={handleInputChange}
                name="purchase_price"
                type="number"
              />
              <TextField
                label="Purchased From"
                value={formData.purchased_from || ''}
                onChange={handleInputChange}
                name="purchased_from"
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="In Service Date"
                  value={formData.in_service_date ? new Date(formData.in_service_date) : null}
                  onChange={handleDateChange('in_service_date')}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Warranty Expiry"
                  value={formData.warranty_expiry ? new Date(formData.warranty_expiry) : null}
                  onChange={handleDateChange('warranty_expiry')}
                />
              </LocalizationProvider>
              <TextField
                label="Notes"
                value={formData.notes}
                onChange={handleInputChange}
                name="notes"
                multiline
                rows={4}
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: 2, bgcolor: '#f5f5f5' }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              {formData.id ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Assets;
