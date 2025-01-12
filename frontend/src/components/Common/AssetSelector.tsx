import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useQuery } from 'react-query';
import { Asset } from '../../types/common';
import { assetService } from '../../services/assetService';
import debounce from 'lodash/debounce';

interface AssetSelectorProps {
  value: Asset | null;
  onChange: (asset: Asset | null) => void;
  error?: boolean;
  helperText?: string;
}

export const AssetSelector: React.FC<AssetSelectorProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: assets = [], isLoading } = useQuery(
    ['assets', searchQuery],
    () => searchQuery ? assetService.search(searchQuery) : assetService.getAll(),
    {
      keepPreviousData: true,
    }
  );

  const debouncedSearch = React.useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => `${option.asset_number} - ${option.name}`}
      options={assets}
      loading={isLoading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Asset"
          error={error}
          helperText={helperText}
          onChange={(e) => debouncedSearch(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Box>
            <Typography sx={{ fontWeight: 550 }}>
              {option.asset_number} - {option.name}
            </Typography>
            {option.location && (
              <Typography variant="body2" color="text.secondary">
                Location: {option.location.name}
              </Typography>
            )}
          </Box>
        </li>
      )}
    />
  );
};
