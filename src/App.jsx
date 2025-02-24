import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Vite + React
      </Typography>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
          maxWidth: 400,
          mx: 'auto',
          my: 2
        }}
      >
        <Button
          variant="contained"
          onClick={() => setCount((count) => count + 1)}
          sx={{ mb: 2 }}
        >
          count is {count}
        </Button>
        <Typography variant="body1" paragraph>
          Edit <code>src/App.jsx</code> and save to test HMR
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Click on the Vite and React logos to learn more
      </Typography>
    </Box>
  );
}

export default App;
