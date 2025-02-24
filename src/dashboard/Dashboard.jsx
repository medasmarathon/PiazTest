import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link
} from '@mui/material';

const Dashboard = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    chrome.storage.local.get({ links: [] }, (result) => {
      setLinks(result.links);
    });
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Saved Links
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Date Saved</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.length > 0 ? (
              links.map((link, index) => (
                <TableRow key={index}>
                  <TableCell>{link.title}</TableCell>
                  <TableCell>
                    <Link
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.url}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(link.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  No links saved yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Dashboard;