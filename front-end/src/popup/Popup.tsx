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
} from "@mui/material";
import { TLinkGroup, TLinkRequest } from "../types";
import useLinks from "@/hooks/useLinks";
import useAuth from "@/hooks/useAuth";
import AuthorizedSection from "../components/PopupAuthorizedSection";

const Popup: React.FC = () => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<TLinkRequest>>({ group: "SaaS" });
  const { userEmail } = useAuth();
  const { linksQuery, saveLink } = useLinks(userEmail);

  useEffect(() => {
    if (!linksQuery.data) return;
    chrome.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([tab]) => {
        let savedData = linksQuery.data.find((l) => l.url === tab.url);
        if (!savedData) {
          setFormData({
            title: tab.title ?? "",
            url: tab.url ?? ""
          })
          return;
        }

        if (
          formData?.group === savedData.group &&
          formData?.rating === savedData.rating &&
          formData?.description === savedData.description &&
          formData?.title === savedData.title
        ) {
          setIsSaved(true);
        }

        setFormData({
          title: savedData.title ?? "",
          url: savedData.url ?? "",
          rating: savedData.rating,
          description: savedData.description ?? "",
          group: savedData.group,
          created_at: savedData.created_at ?? "",
        });
      });
  }, [linksQuery.data]);

  const handleSave = async () => {
    if (!formData || !formData.url || !formData.title) {
      return;
    }

    const newLink: Partial<TLinkRequest> = {
      ...formData,
      id: linksQuery.data?.find((l) => l.url === formData.url)?.id ?? undefined,
      description: formData?.description ? formData.description.trim() : "",
      created_at: formData?.created_at ? new Date(formData.created_at as any).getTime() : Date.now(),
    };

    const success = await saveLink.mutateAsync(newLink);
    if (success) {
      setIsSaved(true);
    }
  };

  return (
    <AuthorizedSection>
      <Box sx={{ width: 300, p: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Group</InputLabel>
          <Select
            value={formData?.group ?? "SaaS"}
            label="Group"
            onChange={(e) => {
              setFormData({
                ...formData,
                group: e.target.value as TLinkGroup
              })
              setIsSaved(false);
            }}
          >
            <MenuItem key={"SaaS"} value="SaaS">SaaS</MenuItem>
            <MenuItem key={"AI"} value="AI">AI</MenuItem>
            <MenuItem key={"Crypto"} value="Crypto">Crypto</MenuItem>
            <MenuItem key={"E-commerce"} value="E-commerce">E-commerce</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Title"
          value={formData?.title}
          onChange={(e) => {
            setFormData({
              ...formData,
              title: e.target.value ?? ""
            })
            setIsSaved(false);
          }}
          sx={{ mb: 2 }}
          rows={2}
        />
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="link-rating"
            value={formData?.rating ?? 0}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                rating: newValue ?? undefined
              })
              setIsSaved(false);
            }}
            max={5}
          />
        </Box>
        <TextField
          fullWidth
          label="Description"
          value={formData?.description ?? ""}
          onChange={(e) => {
            setFormData({
              ...formData,
              description: e.target.value ?? ""
            })
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
    </AuthorizedSection>
  );
};

export default Popup;
