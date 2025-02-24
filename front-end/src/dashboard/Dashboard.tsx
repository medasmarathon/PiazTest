import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import useLinks from '../hooks/useLinks';
import { TLinkGroup } from '../types';

const Dashboard: React.FC = () => {
  const { links, loading, error, deleteLink } = useLinks();
  const [selectedGroup, setSelectedGroup] = useState<TLinkGroup | 'All'>('All');

  const handleDelete = async (url: string) => {
    await deleteLink(url);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading links...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDelete(params.row.url)}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      )
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 200
    },
    {
      field: 'url',
      headerName: 'URL',
      width: 300,
      renderCell: (params) => (
        <MuiLink
          href={params.value as string}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.value as string}
        </MuiLink>
      )
    },
    {
      field: 'group',
      headerName: 'Group',
      width: 150
    },
    {
      field: 'timestamp',
      headerName: 'Date Saved',
      width: 200,
      valueFormatter: (value: number) => {
        return new Date(value).toLocaleString()
      }
    },
  ];

  const filteredLinks = selectedGroup === 'All'
    ? links
    : links.filter(link => link.group === selectedGroup);

  return (
    <Container maxWidth="md" sx={{ py: 4, height: '80vh' }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Saved Links
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Filter by Group</InputLabel>
        <Select
          value={selectedGroup}
          label="Filter by Group"
          onChange={(e) => setSelectedGroup(e.target.value as TLinkGroup | 'All')}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="SaaS">SaaS</MenuItem>
          <MenuItem value="AI">AI</MenuItem>
          <MenuItem value="Crypto">Crypto</MenuItem>
          <MenuItem value="E-commerce">E-commerce</MenuItem>
        </Select>
      </FormControl>
      <Paper sx={{ height: '100%' }}>
        <DataGrid
          rows={filteredLinks}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          getRowId={(row) => row.url}
          disableRowSelectionOnClick
        />
      </Paper>
    </Container>
  );
};

export default Dashboard;