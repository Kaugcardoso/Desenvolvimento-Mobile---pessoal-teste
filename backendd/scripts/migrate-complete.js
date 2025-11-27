import dotenv from 'dotenv';
dotenv.config();

import { pool } from '../db.js';

async function migrate() {
    const client = await pool.connect();
    
    try {
        console.log('🔄 Executando migrações completas...\n');
        
        // 1. Adicionar coluna valor se não existir
        console.log('1️⃣ Verificando coluna "valor" em produtos...');
        const valorCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'produtos' AND column_name = 'valor'
        `);
        
        if (valorCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE produtos 
                ADD COLUMN valor DECIMAL(10, 2) DEFAULT 0 CHECK (valor >= 0)
            `);
            console.log('   ✅ Coluna "valor" adicionada');
        } else {
            console.log('   ✅ Coluna "valor" já existe');
        }
        
        // 2. Adicionar coluna sku se não existir
        console.log('\n2️⃣ Verificando coluna "sku" em produtos...');
        const skuCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'produtos' AND column_name = 'sku'
        `);
        
        if (skuCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE produtos 
                ADD COLUMN sku TEXT UNIQUE
            `);
            console.log('   ✅ Coluna "sku" adicionada');
        } else {
            console.log('   ✅ Coluna "sku" já existe');
        }
        
        // 3. Adicionar coluna observacao em movimentacoes se não existir
        console.log('\n3️⃣ Verificando coluna "observacao" em movimentacoes...');
        const obsCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'movimentacoes' AND column_name = 'observacao'
        `);
        
        if (obsCheck.rows.length === 0) {
            await client.query(`
                ALTER TABLE movimentacoes 
                ADD COLUMN observacao TEXT
            `);
            console.log('   ✅ Coluna "observacao" adicionada');
        } else {
            console.log('   ✅ Coluna "observacao" já existe');
        }
        
        console.log('\n✅ Todas as migrações concluídas com sucesso!');
        
    } catch (error) {
        console.error('\n❌ Erro ao executar migração:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
        console.log('\nConexão fechada.');
    }
}

migrate()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error('Falha na migração:', error);
        process.exit(1);
    });
