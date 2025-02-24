import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    chrome.storage.local.get({ links: [] }, (result) => {
      setLinks(result.links);
    });
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Saved Links</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>Title</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>URL</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>Date Saved</th>
          </tr>
        </thead>
        <tbody>
          {links.length > 0 ? (
            links.map((link, index) => (
              <tr key={index}>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{link.title}</td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2196F3', textDecoration: 'none' }}
                  >
                    {link.url}
                  </a>
                </td>
                <td style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  {new Date(link.timestamp).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No links saved yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;