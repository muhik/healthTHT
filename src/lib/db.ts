import { createClient } from '@libsql/client'; // Use @libsql/client for Turso/Edge compatibility

const url = process.env.TURSO_DATABASE_URL || 'file:proseal.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
    url,
    authToken,
});

// Initialize DB structure
// NOTE: For production handling, migrations are better handled outside the app runtime or via a specific migration script.
// But for simplicity in this project scope, we can check/create tables on initialization in a non-blocking way or manual trigger.
// Since @libsql/client is async, we can't do top-level await easily in CommonJS/some contexts without care, 
// but Next.js supports it. However, usually we just let the app run and ensure tables exist.

export const initDb = async () => {
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                date TEXT NOT NULL,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                location TEXT NOT NULL,
                status TEXT NOT NULL, -- 'PAID', 'LEAD', 'PROCESSED', 'SHIPPED', 'DONE'
                amount INTEGER NOT NULL,
                address TEXT,
                note TEXT,
                resi TEXT,
                courier TEXT,
                payment_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database initialized');
    } catch (e) {
        console.error('Failed to init DB:', e);
    }
};

// Auto-run init in dev/build? Better to call it explicitly or just rely on manual setup for prod.
// For now, let's export it and maybe call it in instrumentation or an API route if needed.
// Or just let the first request trigger it if we want lazy init (not recommended for prod concurrency).
// Let's self-execute for local dev convenience, but wrap in try-catch.
(async () => {
    if (process.env.NODE_ENV === 'development') {
        await initDb();
    }
})();

export default db;
