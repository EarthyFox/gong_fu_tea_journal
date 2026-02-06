import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_change_me';

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Postgres uses $1, $2 placeholders and RETURNING * to get inserted row
        const result = await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });

        res.status(201).json({ token, user });

    } catch (error) {
        if (error.code === '23505') { // Postgres generic duplicate key error code
            return res.status(409).json({ error: 'Username already exists' });
        }
        console.error("Register Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
