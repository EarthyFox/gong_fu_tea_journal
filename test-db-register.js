import db from './db.js';
import bcrypt from 'bcrypt';

async function testRegistration() {
    const testUser = 'testuser_' + Date.now();
    const testPass = 'password123';

    console.log(`Attempting to register user: ${testUser}`);

    try {
        // Test Connection
        const timeRes = await db.query('SELECT NOW()');
        console.log('Database connected. Server time:', timeRes.rows[0].now);

        // Simulate Registration Logic
        const hashedPassword = await bcrypt.hash(testPass, 10);
        console.log('Password hashed.');

        const result = await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [testUser, hashedPassword]
        );

        console.log('User created successfully:', result.rows[0]);

        // Cleanup (optional, but good for testing)
        // await db.query('DELETE FROM users WHERE id = $1', [result.rows[0].id]);
        // console.log('Test user deleted.');

    } catch (err) {
        console.error('Registration Test Failed:', err);
    } finally {
        process.exit();
    }
}

testRegistration();
