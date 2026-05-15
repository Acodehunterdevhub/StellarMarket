import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Basic health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes will be added here

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
