import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import entryRoutes from './routes/entries.js';
import teaRoutes from './routes/teas.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/teas', teaRoutes);

app.get('/', (req, res) => {
    res.send('Gong Fu Tea Journal API');
});

export default app;

// Check if running directly (ESM pattern)
// 1. STANDALONE flag (set in package.json)
// 2. Fallback: If NOT running in AWS Lambda (Netlify), assume local/server mode
if (process.env.STANDALONE || !process.env.AWS_LAMBDA_FUNCTION_NAME) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
