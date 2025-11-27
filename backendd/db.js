import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

const hasConnectionString = Boolean(process.env.DATABASE_URL);

const baseConfig = hasConnectionString
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
    }
    : {
        user: process.env.PGUSER || 'postgres',
        host: process.env.PGHOST || 'localhost',
        database: process.env.PGDATABASE || 'jjk_control',
        password: process.env.PGPASSWORD || 'postgres',
        port: Number(process.env.PGPORT) || 5432,
    };

export const pool = new Pool({
    ...baseConfig,
    max: Number(process.env.PG_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT || 30_000),
    allowExitOnIdle: false,
});

pool.on('connect', () => {
    console.log('[db] nova conexão estabelecida');
});

pool.on('error', (err) => {
    console.error('[db] erro inesperado', err);
});
