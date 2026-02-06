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

export default app;

// Check if running directly (ESM pattern)
// Wrapped in try-catch because import.meta.url can be undefined/invalid in bundled serverless environments
try {
    const { fileURLToPath } = await import('url');
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
} catch (error) {
    // Silently fail if we can't determine if this is main module 
    // (e.g. in Netlify Functions, where we don't want to listen() anyway)
}
