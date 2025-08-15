import express, { Application, Request, Response, NextFunction } from 'express';

import authRoutes from './routes/auth.routes';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
