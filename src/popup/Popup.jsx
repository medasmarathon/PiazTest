import React, { useState } from 'react';
import { Box, Button, Link } from '@mui/material';

const Popup = () => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const { url, title } = tab;

    chrome.storage.local.get({ links: [] }, (result) => {
      const links = result.links;
      links.push({ url, title, timestamp: new Date().toISOString() });
      chrome.storage.local.set({ links }, () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      });
    });
  };

  return (
    <Box sx={{ width: 200, p: 2 }}>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handleSave}
        sx={{ mb: 2 }}
      >
        {isSaved ? 'Saved!' : 'Save Current Page'}
      </Button>
      <Link
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
      </Link>
    </Box>
  );
};

export default Popup;