import React, { useState } from 'react';
import { Box, Button, Link as MuiLink, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { TLink, TLinkGroup } from '../types';
import useLinks from '@/hooks/useLinks';

interface Tab {
  url?: string;
  title?: string;
}

const Popup: React.FC = () => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<TLinkGroup>('SaaS');
  const [description, setDescription] = useState<string>('');
  const { links, saveLink } = useLinks();

  const handleSave = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const { url, title } = tab;

    if (!url || !title) {
      return;
    }

    const newLink: Partial<TLink> = {
      id: links.find(l => l.url === url)?.id ?? undefined,
      url,
      title,
      description: description.trim(),
      created_at: Date.now(),
      group: selectedGroup
    };

    const success = await saveLink(newLink);
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
        {isSaved ? 'Saved!' : 'Save Current Page'}
      </Button>
      <MuiLink
        href="/src/dashboard/index.html"
        target="_blank"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: 'primary.main',
          textDecoration: 'none'
        }}
      >
        View Saved Links
      </MuiLink>
    </Box>
  );
};

export default Popup;