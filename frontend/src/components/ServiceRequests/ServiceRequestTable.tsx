import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TableSortLabel,
  Box,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { ServiceRequest } from '../../types/common';

interface Column {
  id: keyof ServiceRequest | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: ServiceRequest) => string;
}

const columns: Column[] = [
  { 
    id: 'request_number', 
    label: 'Request #', 
    minWidth: 100,
    align: 'left' 
  },
  { 
    id: 'service_requested', 
    label: 'Service Requested', 
    minWidth: 170,
    align: 'left'
  },
  { 
    id: 'status', 
    label: 'Status', 
    minWidth: 120,
    align: 'center'
  },
  { 
    id: 'priority', 
    label: 'Priority', 
    minWidth: 100,
    align: 'center'
  },
  { 
    id: 'service_type', 
    label: 'Type', 
    minWidth: 120,
    align: 'center'
  },
  { 
    id: 'due_date', 
    label: 'Due Date', 
    minWidth: 120,
    align: 'center',
    format: (value: string) => value ? format(new Date(value), 'MM/dd/yyyy') : '-'
  },
  {
    id: 'actual_hours',
    label: 'Actual Time',
    minWidth: 120,
    align: 'center',
    format: (value: number, row?: ServiceRequest) => {
      if (!row || (value === undefined && row.actual_minutes === undefined)) return '-';
      const hours = value || 0;
      const minutes = row.actual_minutes || 0;
      return `${hours}h ${minutes}m`;
    }
  },
  {
    id: 'completed_by',
    label: 'Completed By',
    minWidth: 120,
    align: 'center',
    format: (row?: ServiceRequest) => row?.completedByProvider?.name || '-'
  },
  { 
    id: 'actions', 
    label: 'Actions', 
    minWidth: 100,
    align: 'center'
  },
];

interface ServiceRequestTableProps {
  serviceRequests: ServiceRequest[];
  onEdit: (serviceRequest: ServiceRequest) => void;
  onDelete: (serviceRequest: ServiceRequest) => void;
}

export const ServiceRequestTable: React.FC<ServiceRequestTableProps> = ({
  serviceRequests,
  onEdit,
  onDelete,
}) => {
  const [orderBy, setOrderBy] = useState<keyof ServiceRequest>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const handleRequestSort = (property: keyof ServiceRequest) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return '#ff9800';
      case 'In Progress':
        return '#2196f3';
      case 'Closed':
        return '#4caf50';
      case 'On Hold':
        return '#f44336';
      case 'Closed-Completed':
        return '#4caf50';
      case 'Closed-Incomplete':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Highest':
        return '#d32f2f';
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      case 'Lowest':
        return '#2196f3';
      default:
        return '#757575';
    }
  };

  const sortedRequests = React.useMemo(() => {
    const comparator = (a: ServiceRequest, b: ServiceRequest) => {
      if (orderBy === 'due_date') {
        const dateA = a[orderBy] ? new Date(a[orderBy]!).getTime() : 0;
        const dateB = b[orderBy] ? new Date(b[orderBy]!).getTime() : 0;
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      }

      const valueA = a[orderBy] || '';
      const valueB = b[orderBy] || '';
      return order === 'asc'
        ? valueA < valueB ? -1 : valueA > valueB ? 1 : 0
        : valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
    };

    return [...serviceRequests].sort(comparator);
  }, [serviceRequests, order, orderBy]);

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth, fontWeight: 550 }}
              >
                {column.id !== 'actions' ? (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id as keyof ServiceRequest)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRequests.map((row) => (
            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
              <TableCell align="left" sx={{ fontWeight: 550 }}>
                {row.request_number}
              </TableCell>
              <TableCell align="left">{row.service_requested}</TableCell>
              <TableCell align="center">
                <Chip
                  label={row.status}
                  sx={{
                    backgroundColor: getStatusColor(row.status),
                    color: 'white',
                    fontWeight: 550,
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={row.priority}
                  sx={{
                    backgroundColor: getPriorityColor(row.priority),
                    color: 'white',
                    fontWeight: 550,
                  }}
                />
              </TableCell>
              <TableCell align="center">{row.service_type}</TableCell>
              <TableCell align="center">
                {columns.find(col => col.id === 'due_date')?.format?.(row.due_date || '')}
              </TableCell>
              <TableCell align="center">
                {columns.find(col => col.id === 'actual_hours')?.format?.(row.actual_hours || 0, row)}
              </TableCell>
              <TableCell align="center">
                {columns.find(col => col.id === 'completed_by')?.format?.(row)}
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Tooltip title="Edit Service Request">
                    <IconButton
                      onClick={() => onEdit(row)}
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.25)',
                          transition: 'transform 0.2s',
                        },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Service Request">
                    <IconButton
                      onClick={() => onDelete(row)}
                      sx={{
                        '&:hover': {
                          transform: 'scale(1.25)',
                          transition: 'transform 0.2s',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
