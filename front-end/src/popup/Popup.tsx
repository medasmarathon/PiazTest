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
import GoogleIcon from "@mui/icons-material/Google";

const Popup: React.FC = () => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<TLinkGroup>("SaaS");
  const [url, setUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<number | undefined>();
  const [rating, setRating] = useState<number | undefined>(undefined);
  const { isLogin, inProgress, userEmail, googleSignIn } = useAuth();
  const { linksQuery, saveLink } = useLinks(userEmail);

  useEffect(() => {
    if (!linksQuery.data) return;
    chrome.tabs.query({
      active: true,
      currentWindow: true,
    })
      .then(([tab]) => {
        let savedData = linksQuery.data.find(l => l.url === tab.url);
        if (!savedData) {
          setTitle(tab.title ?? "");
          setUrl(tab.url ?? "");
          return;
        };

        if (selectedGroup === savedData.group && rating === savedData.rating && description === savedData.description && title === savedData.title) {
          setIsSaved(true);
        }
        setUrl(savedData.url);
        setTitle(savedData.title);
        setRating(savedData.rating);
        setDescription(savedData.description ?? "");
        setSelectedGroup(savedData.group);
        setCreatedAt(savedData.created_at);
      });

    return () => {
      setUrl("");
      setTitle("");
      setRating(undefined);
      setDescription("");
      setSelectedGroup("SaaS");
      setCreatedAt(undefined);
    }
  }, [linksQuery.data])

  if (!isLogin) {
    return (
      <Box sx={{ width: 300, p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => googleSignIn()}
          startIcon={<GoogleIcon />}
        >
          {inProgress && <CircularProgress />}
          Sign in with Google
        </Button>
      </Box>
    );
  }

  const handleSave = async () => {
    if (!url || !title) {
      return;
    }

    const newLink: Partial<TLinkRequest> = {
      id: linksQuery.data?.find((l) => l.url === url)?.id ?? undefined,
      url,
      title,
      description: description.trim(),
      created_at: new Date(createdAt as any).getTime() ?? Date.now(),
      group: selectedGroup,
      rating,
      userEmail,
    };

    const success = await saveLink.mutateAsync(newLink);
    if (success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <Box sx={{ width: 300, p: 2 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Group</InputLabel>
        <Select
          value={selectedGroup}
          label="Group"
          onChange={(e) => {
            setSelectedGroup(e.target.value as TLinkGroup);
            setIsSaved(false);
          }}
        >
          <MenuItem value="SaaS">SaaS</MenuItem>
          <MenuItem value="AI">AI</MenuItem>
          <MenuItem value="Crypto">Crypto</MenuItem>
          <MenuItem value="E-commerce">E-commerce</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setIsSaved(false);
        }}
        sx={{ mb: 2 }}
        rows={2}
      />
      <Box sx={{ mb: 2 }}>
        <Typography component="legend">Rating</Typography>
        <Rating
          name="link-rating"
          value={rating ?? 0}
          onChange={(event, newValue) => {
            setRating(newValue ?? undefined);
            setIsSaved(false);
          }}
          max={5}
        />
      </Box>
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setIsSaved(false);
        }}
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
