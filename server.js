import express from 'express';
import mapRoutes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '200mb' }));

mapRoutes(app);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
