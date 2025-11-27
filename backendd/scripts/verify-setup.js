import dotenv from 'dotenv';
dotenv.config();

import { pool } from '../db.js';

async function verify() {
    const client = await pool.connect();
    
    try {
        console.log('🔍 Verificando configuração do banco de dados...\n');
        
        // 1. Verificar conexão
        console.log('1️⃣ Testando conexão com o banco...');
        await client.query('SELECT NOW()');
        console.log('   ✅ Conexão estabelecida com sucesso!\n');
        
        // 2. Verificar se as tabelas existem
        console.log('2️⃣ Verificando tabelas...');
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN ('produtos', 'fornecedores', 'movimentacoes')
            ORDER BY table_name
        `);
        
        const existingTables = tablesResult.rows.map(r => r.table_name);
        const requiredTables = ['produtos', 'fornecedores', 'movimentacoes'];
        
        requiredTables.forEach(table => {
            if (existingTables.includes(table)) {
                console.log(`   ✅ Tabela "${table}" existe`);
            } else {
                console.log(`   ❌ Tabela "${table}" NÃO encontrada`);
            }
        });
        
        // 3. Verificar colunas da tabela produtos
        console.log('\n3️⃣ Verificando estrutura da tabela produtos...');
        const columnsResult = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'produtos'
            ORDER BY ordinal_position
        `);
        
        const requiredColumns = ['id', 'nome', 'sku', 'valor', 'quantidade_total', 'estoque_minimo'];
        const existingColumns = columnsResult.rows.map(r => r.column_name);
        
        requiredColumns.forEach(col => {
            if (existingColumns.includes(col)) {
                const colInfo = columnsResult.rows.find(r => r.column_name === col);
                console.log(`   ✅ Coluna "${col}" (${colInfo.data_type})`);
            } else {
                console.log(`   ❌ Coluna "${col}" NÃO encontrada`);
            }
        });
        
        // 4. Verificar colunas da tabela movimentacoes (observacao)
        console.log('\n4️⃣ Verificando estrutura da tabela movimentacoes...');
        const movColumnsResult = await client.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'movimentacoes'
            AND column_name = 'observacao'
        `);
        
        if (movColumnsResult.rows.length > 0) {
            console.log('   ✅ Coluna "observacao" existe');
        } else {
            console.log('   ❌ Coluna "observacao" NÃO encontrada');
        }
        
        // 5. Contar registros
        console.log('\n5️⃣ Contando registros existentes...');
        const produtosCount = await client.query('SELECT COUNT(*) FROM produtos');
        const fornecedoresCount = await client.query('SELECT COUNT(*) FROM fornecedores');
        const movCount = await client.query('SELECT COUNT(*) FROM movimentacoes');
        
        console.log(`   📦 Produtos: ${produtosCount.rows[0].count}`);
        console.log(`   🏢 Fornecedores: ${fornecedoresCount.rows[0].count}`);
        console.log(`   📋 Movimentações: ${movCount.rows[0].count}`);
        
        console.log('\n✅ Verificação concluída!');
        console.log('\n💡 Dica: Execute "npm run dev" na pasta backendd para iniciar o servidor.');
        
    } catch (error) {
        console.error('\n❌ Erro durante verificação:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

verify()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error('Falha na verificação:', error);
        process.exit(1);
    });
