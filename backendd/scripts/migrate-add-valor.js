import dotenv from 'dotenv';
dotenv.config();

import { pool } from '../db.js';

async function migrate() {
    const client = await pool.connect();
    
    try {
        console.log('Verificando se a coluna valor existe...');
        
        // Verificar se a coluna já existe
        const checkResult = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'produtos' AND column_name = 'valor'
        `);

        if (checkResult.rows.length > 0) {
            console.log('✅ Coluna "valor" já existe na tabela produtos.');
            return;
        }

        console.log('Adicionando coluna "valor" na tabela produtos...');
        
        // Adicionar a coluna
        await client.query(`
            ALTER TABLE produtos 
            ADD COLUMN valor DECIMAL(10, 2) DEFAULT 0 CHECK (valor >= 0)
        `);

        console.log('✅ Coluna "valor" adicionada com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao executar migração:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
        console.log('Conexão fechada.');
    }
}

migrate()
    .then(() => {
        console.log('Migração concluída!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Falha na migração:', error);
        process.exit(1);
    });
