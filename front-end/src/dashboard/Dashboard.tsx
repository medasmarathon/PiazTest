import React, { useState } from "react";
import { Container, FormControl, InputLabel, Select, MenuItem, CircularProgress, Button, Typography } from "@mui/material";
import useLinks from "../hooks/useLinks";
import { TLinkGroup, TLinkRequest } from "../types";
import useAuth from "@/hooks/useAuth";
import AppBarWithMenu from "./AppBarWithMenu";
import LinksDataGrid from "./LinksDataGrid";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const Dashboard: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<TLinkGroup | "All">("All");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<string | null>(null);

  const { isLogin, inProgress, userEmail, googleSignIn, signOut } = useAuth();
  const { linksQuery, deleteLink, saveLink } = useLinks(userEmail);
  const { data: links, isLoading: loading, error } = linksQuery;

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

  return (
    <>
      <AppBarWithMenu
        userEmail={userEmail}
        onLogout={() => {
          signOut();
          window.location.reload();
        }}
      />
      <Container maxWidth="lg" sx={{ py: 4, height: "80vh" }}>
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
        <LinksDataGrid
          links={links}
          selectedGroup={selectedGroup}
          handleDeleteClick={handleDeleteClick}
          saveLink={saveLink}
        />
      </Container>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default Dashboard;
