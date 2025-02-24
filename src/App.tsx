import { Box, Typography } from '@mui/material';
import './App.css';
import { useEffect } from 'react';

const App: React.FC = () => {
  useEffect(() => {
    location.assign("/src/popup/index.html")
  }, [])

  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        App
      </Typography>
    </Box>
  );
};

export default App;
