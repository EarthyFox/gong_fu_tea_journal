import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import entryRoutes from './routes/entries.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

app.get('/', (req, res) => {
    res.send('Gong Fu Tea Journal API');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
