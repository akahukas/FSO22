import express from 'express';
import diagnoseRouter from './routes/diagnoses';
const app = express();
import cors from 'cors';

app.use(express.json());

app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('Someone pinged!');
  res.send('pong');
});

app.use('/api/diagnoses', diagnoseRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});