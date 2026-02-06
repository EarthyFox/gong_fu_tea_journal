import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all entries for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db.query(
            'SELECT * FROM entries WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        const rows = result.rows;

        // Parse JSON fields (Note: pg might handle JSONB automatically, but let's be safe for plain JSON)
        // With pg and JSONB, it returns objects, so we might not need JSON.parse if we used JSONB.
        // In db.js I used JSONB. `pg` parses JSONB automatically.
        // So we just need to flatten.

        const entries = rows.map(row => {
            // If pg returned string (unlikely for JSONB), parse it. If object/null, use as is.
            const brewingParams = (typeof row.brewing_params === 'string') ? JSON.parse(row.brewing_params) : (row.brewing_params || {});
            const flavorProfile = (typeof row.flavor_profile === 'string') ? JSON.parse(row.flavor_profile) : (row.flavor_profile || {});

            return {
                ...row,
                teaName: row.name, // Frontend expects teaName
                teaType: row.tea_type, // Frontend expects teaType
                ...brewingParams, // Flatten temperature, waterAmount, etc.
                flavorProfile: flavorProfile, // Frontend expects flavorProfile
                flavor_profile: flavorProfile
            };
        });

        res.json(entries);
    } catch (err) {
        console.error("Get Entries Error:", err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create a new entry
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const {
        id,
        name,
        teaName,
        tea_type,
        teaType,
        year,
        sourcing,
        rating,
        notes,
        brewing_params,
        flavor_profile,
        temperature, waterAmount, teaWeight, steepTimes,
        flavorProfile
    } = req.body;

    // Normalize data
    const finalName = name || teaName;
    const finalTeaType = tea_type || teaType;
    const finalFlavorProfile = flavor_profile || flavorProfile || {};

    if (!finalName) {
        return res.status(400).json({ error: 'Tea name is required' });
    }

    let finalBrewingParams = brewing_params;
    if (!finalBrewingParams) {
        finalBrewingParams = {
            temperature,
            waterAmount,
            teaWeight,
            steepTimes
        };
    }

    const finalId = id || Date.now().toString();
    const createdAt = new Date().toISOString();

    try {
        await db.query(`
            INSERT INTO entries (id, user_id, name, tea_type, year, sourcing, rating, notes, brewing_params, flavor_profile, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
            finalId,
            userId,
            finalName,
            finalTeaType,
            year,
            sourcing,
            rating,
            notes,
            finalBrewingParams, // pg handles object -> JSONB serialization
            finalFlavorProfile, // pg handles object -> JSONB serialization
            createdAt
        ]);

        res.status(201).json({ id: finalId, message: 'Entry created' });
    } catch (err) {
        console.error("Create Entry Error:", err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete an entry
router.delete('/:id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const entryId = req.params.id;

    try {
        const result = await db.query(
            'DELETE FROM entries WHERE id = $1 AND user_id = $2',
            [entryId, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Entry not found or unauthorized' });
        }
        res.json({ message: 'Entry deleted' });
    } catch (err) {
        console.error("Delete Entry Error:", err);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
