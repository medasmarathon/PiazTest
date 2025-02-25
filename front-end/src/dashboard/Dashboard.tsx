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
  IconButton,
  Popover,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import useLinks from '../hooks/useLinks';
import { TLinkGroup } from '../types';

const Dashboard: React.FC = () => {
  const { linksQuery, deleteLink } = useLinks();
  const { data: links, isLoading: loading, error } = linksQuery;
  const [selectedGroup, setSelectedGroup] = useState<TLinkGroup | 'All'>('All');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);

  const handleDeleteClick = (url: string) => {
    setUrlToDelete(url);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (urlToDelete) {
      await deleteLink.mutateAsync(urlToDelete);
      setDeleteDialogOpen(false);
      setUrlToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUrlToDelete(null);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Loading links...</Typography>
      </Container>
    );
  }

  if (error || !links) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error loading links
        </Typography>
      </Container>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Tooltip title="Delete">
          <IconButton
            onClick={() => handleDeleteClick(params.row.url)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      width: 200,
    },
    {
      field: "url",
      headerName: "URL",
      width: 300,
      renderCell: (params) => (
        <MuiLink
          href={params.value as string}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.value as string}
        </MuiLink>
      ),
    },
    {
      field: "group",
      headerName: "Group",
      width: 100,
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 100,
      renderCell: (params) => (
        params.value ? '★'.repeat(params.value) : 'No rating'
      ),
    },
    {
      field: "created_at",
      headerName: "Date Saved",
      width: 150,
      valueFormatter: (value: number) => {
        return new Date(value).toLocaleString();
      },
    },
  ];

  const filteredLinks = selectedGroup === 'All'
    ? links
    : links.filter(link => link.group === selectedGroup);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4, height: '80vh' }}>
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
    <Dialog
      open={deleteDialogOpen}
      onClose={handleDeleteCancel}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this link?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel}>Cancel</Button>
        <Button onClick={handleDeleteConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default Dashboard;