import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all teas for current user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM teas WHERE user_id = $1 ORDER BY name ASC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch teas' });
    }
});

// Add a new tea
router.post('/', authenticateToken, async (req, res) => {
    const { name, type, vendor, year, weight_grams } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO teas (user_id, name, type, vendor, year, weight_grams)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [req.user.id, name, type, vendor, year, weight_grams || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add tea' });
    }
});

// Update a tea
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, type, vendor, year, weight_grams, in_stock } = req.body;

    try {
        // Verify ownership
        const check = await pool.query('SELECT * FROM teas WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Tea not found' });
        }

        const result = await pool.query(
            `UPDATE teas 
             SET name = COALESCE($1, name),
                 type = COALESCE($2, type),
                 vendor = COALESCE($3, vendor),
                 year = COALESCE($4, year),
                 weight_grams = COALESCE($5, weight_grams),
                 in_stock = COALESCE($6, in_stock),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 AND user_id = $8
             RETURNING *`,
            [name, type, vendor, year, weight_grams, in_stock, id, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update tea' });
    }
});

// Delete a tea
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM teas WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tea not found' });
        }

        res.json({ message: 'Tea deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete tea' });
    }
});

export default router;
