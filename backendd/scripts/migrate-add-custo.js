import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'jjkControlDB',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

async function migrate() {
    try {
        console.log('🔄 Verificando se a coluna "custo" existe...');
        
        const checkResult = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'produtos' 
            AND column_name = 'custo'
        `);

        if (checkResult.rows.length > 0) {
            console.log('✅ A coluna "custo" já existe na tabela produtos.');
            await pool.end();
            return;
        }

        console.log('➕ Adicionando coluna "custo" na tabela produtos...');
        
        await pool.query(`
            ALTER TABLE produtos 
            ADD COLUMN custo DECIMAL(10, 2) DEFAULT 0;
        `);

        await pool.query(`
            COMMENT ON COLUMN produtos.custo IS 'Custo unitário do produto para cálculo de margem de lucro';
        `);

        console.log('✅ Migração concluída! A coluna "custo" foi adicionada com sucesso.');
    } catch (error) {
        console.error('❌ Erro na migração:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();

