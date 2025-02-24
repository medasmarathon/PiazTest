import React, { useState } from 'react';

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
    <div style={{ width: '200px', padding: '10px' }}>
      <button
        onClick={handleSave}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isSaved ? 'Saved!' : 'Save Current Page'}
      </button>
      <a
        href="/src/dashboard/index.html"
        target="_blank"
        style={{
          display: 'block',
          textAlign: 'center',
          color: '#2196F3',
          textDecoration: 'none'
        }}
      >
        View Saved Links
      </a>
    </div>
  );
};

export default Popup;