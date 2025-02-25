import React, { useState } from 'react';
import { Box, Button, Link as MuiLink, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TLink, TLinkGroup } from '../types';
import useLinks from '@/hooks/useLinks';

interface Tab {
  url?: string;
  title?: string;
}

const Popup: React.FC = () => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<TLinkGroup>('SaaS');
  const { links, saveLink } = useLinks();

  const handleSave = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const { url, title } = tab;

    if (!url || !title) {
      return;
    }

    if (links.find(l => l.url === url)) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      return;
    }

    const newLink: Omit<TLink, "id"> = {
      url,
      title,
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