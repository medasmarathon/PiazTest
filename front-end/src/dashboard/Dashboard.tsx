import React, { useEffect, useState } from "react";
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import useLinks from "../hooks/useLinks";
import { TLinkGroup, TLinkRequest } from "../types";
import useAuth from "@/hooks/useAuth";

const Dashboard: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<TLinkGroup | "All">("All");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<
    (Partial<TLinkRequest> & { created_at: number }) | null
  >(null);
  const { isLogin, inProgress, userEmail, googleSignIn } = useAuth();
  const { linksQuery, deleteLink, saveLink } = useLinks(userEmail);
  const { data: links, isLoading: loading, error } = linksQuery;

  console.log("dashboard render", isLogin);
  if (!isLogin) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, height: "80vh" }}>
        <Button variant="contained" onClick={() => googleSignIn()}>
          {inProgress && <CircularProgress />}
          Sign in with Google
        </Button>
      </Container>
    );
  }

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
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6">Loading links...</Typography>
      </Container>
    );
  }

  if (error || !links) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
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
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          {editRow?.id === params.row.id ? (
            <>
              <Tooltip title="Save">
                <IconButton
                  onClick={async () => {
                    if (editRow) {
                      await saveLink.mutateAsync({
                        ...editRow,
                        created_at: new Date(editRow.created_at).getTime(),
                      });
                      setEditRow(null);
                    }
                  }}
                  color="success"
                  size="small"
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton
                  onClick={() => setEditRow(null)}
                  color="warning"
                  size="small"
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Edit">
              <IconButton
                onClick={() => setEditRow(params.row)}
                color="primary"
                size="small"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteClick(params.row.url)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      width: 200,
      renderCell: (params) => {
        if (editRow?.id === params.row.id) {
          return (
            <TextField
              value={editRow?.title}
              onChange={(e) =>
                setEditRow({
                  ...editRow,
                  title: e.target.value,
                  created_at: params.row.created_at,
                })
              }
              fullWidth
              size="small"
            />
          );
        }
        return params.value;
      },
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
      renderCell: (params) => {
        if (editRow?.id === params.row.id) {
          return (
            <Select
              value={editRow?.group}
              onChange={(e) =>
                setEditRow({
                  ...editRow,
                  group: e.target.value as TLinkGroup,
                  created_at: params.row.created_at,
                })
              }
              size="small"
              fullWidth
            >
              <MenuItem value="SaaS">SaaS</MenuItem>
              <MenuItem value="AI">AI</MenuItem>
              <MenuItem value="Crypto">Crypto</MenuItem>
              <MenuItem value="E-commerce">E-commerce</MenuItem>
            </Select>
          );
        }
        return params.value;
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      renderCell: (params) => {
        if (editRow?.id === params.row.id) {
          return (
            <TextField
              value={editRow?.description}
              onChange={(e) => {
                setEditRow({
                  ...editRow,
                  description: String(e.target.value),
                  created_at: params.row.created_at,
                })
              }}
              fullWidth
              size="small"
            />
          );
        }
        return params.value;
      },
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 100,
      renderCell: (params) => {
        if (editRow?.id === params.row.id) {
          return (
            <Select
              value={editRow?.rating || 0}
              onChange={(e) =>
                setEditRow({
                  ...editRow,
                  rating: Number(e.target.value),
                  created_at: params.row.created_at,
                })
              }
              size="small"
              fullWidth
            >
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <MenuItem key={value} value={value}>
                  {value ? "★".repeat(value) : "No rating"}
                </MenuItem>
              ))}
            </Select>
          );
        }
        return params.value ? "★".repeat(params.value) : "No rating";
      },
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

  const filteredLinks =
    selectedGroup === "All"
      ? links
      : links.filter((link) => link.group === selectedGroup);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4, height: "80vh" }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Saved Links
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Filter by Group</InputLabel>
          <Select
            value={selectedGroup}
            label="Filter by Group"
            onChange={(e) =>
              setSelectedGroup(e.target.value as TLinkGroup | "All")
            }
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="SaaS">SaaS</MenuItem>
            <MenuItem value="AI">AI</MenuItem>
            <MenuItem value="Crypto">Crypto</MenuItem>
            <MenuItem value="E-commerce">E-commerce</MenuItem>
          </Select>
        </FormControl>
        <Paper sx={{ height: "100%" }}>
          <DataGrid
            rows={filteredLinks}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            getRowId={(row) => row.id}
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
