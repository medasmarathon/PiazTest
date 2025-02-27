import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Link as MuiLink,
  FormControl,
  InputLabel,
  TextField,
  Rating,
  Typography,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { TLinkGroup, TLinkRequest } from "../types";
import useLinks from "@/hooks/useLinks";
import useAuth from "@/hooks/useAuth";

const Popup: React.FC = () => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<TLinkGroup>("SaaS");
  const [description, setDescription] = useState<string>("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const { linksQuery, saveLink } = useLinks();
  const { isLogin, inProgress, userEmail, googleSignIn } = useAuth();

  if (!isLogin) {
    return (
      <Box sx={{ width: 200, p: 2 }}>
        <Button variant="contained" onClick={() => googleSignIn()}>
          {inProgress && <CircularProgress />}
          Sign in with Google
        </Button>
      </Box>
    );
  }

  const handleSave = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const { url, title } = tab;

    if (!url || !title) {
      return;
    }

    const newLink: Partial<TLinkRequest> = {
      id: linksQuery.data?.find((l) => l.url === url)?.id ?? undefined,
      url,
      title,
      description: description.trim(),
      created_at: Date.now(),
      group: selectedGroup,
      rating,
      email: userEmail,
    };

    const success = await saveLink.mutateAsync(newLink);
    if (success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <Box sx={{ width: 200, p: 2 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Group</InputLabel>
        <Select
          value={selectedGroup}
          label="Group"
          onChange={(e) => setSelectedGroup(e.target.value as TLinkGroup)}
        >
          <MenuItem value="SaaS">SaaS</MenuItem>
          <MenuItem value="AI">AI</MenuItem>
          <MenuItem value="Crypto">Crypto</MenuItem>
          <MenuItem value="E-commerce">E-commerce</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mb: 2 }}>
        <Typography component="legend">Rating</Typography>
        <Rating
          name="link-rating"
          value={rating ?? 0}
          onChange={(event, newValue) => setRating(newValue ?? undefined)}
          max={5}
        />
      </Box>
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
        multiline
        rows={2}
      />
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handleSave}
        sx={{ mb: 2 }}
      >
        {isSaved ? "Saved!" : "Save Current Page"}
      </Button>
      <MuiLink
        href="/src/dashboard/index.html"
        target="_blank"
        sx={{
          display: "block",
          textAlign: "center",
          color: "primary.main",
          textDecoration: "none",
        }}
      >
        View Saved Links
      </MuiLink>
    </Box>
  );
};

export default Popup;
