import { Box, Typography } from '@mui/material';
import './App.css';

const App: React.FC = () => {

  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Vite + React
      </Typography>
    </Box>
  );
};

export default App;
