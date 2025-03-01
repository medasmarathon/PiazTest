import express from 'express';
import cors from 'cors';
import linksRouter from './routes/linksRouter';
import { AppDataSource } from './data-source';

const app = express();
const port = process.env.PORT || 3000;

AppDataSource.initialize().then(async (dataSource) => {
  await dataSource.runMigrations();
}).catch(error => console.log("Data Source error:", error))

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/", (req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
})

// Use links router
app.use('/api/links', linksRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});