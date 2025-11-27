import dotenv from 'dotenv';
dotenv.config();

import { pool } from '../db.js';

async function debugEstoque() {
    const client = await pool.connect();
    
    try {
        console.log('🔍 Debug do Estoque\n');
        
        // 1. Ver todos os produtos
        console.log('1️⃣ Todos os produtos na tabela:');
        const produtos = await client.query('SELECT * FROM produtos ORDER BY id');
        console.log(`   Total: ${produtos.rows.length}`);
        
        if (produtos.rows.length > 0) {
            produtos.rows.forEach((p, i) => {
                console.log(`   ${i + 1}. ID: ${p.id} | Nome: ${p.nome || '(sem nome)'} | Qtd: ${p.quantidade_total || 0} | Mín: ${p.estoque_minimo || 0}`);
            });
        } else {
            console.log('   ⚠️  Nenhum produto cadastrado!');
        }
        
        // 2. Testar a query do estoque
        console.log('\n2️⃣ Testando query do estoque:');
        const estoqueQuery = `
            SELECT
                p.id,
                p.nome,
                p.sku,
                p.quantidade_total,
                p.estoque_minimo,
                GREATEST(p.quantidade_total - p.estoque_minimo, 0) AS saldo_sobre_minimo,
                CASE
                    WHEN p.quantidade_total <= 0 THEN 'zerado'
                    WHEN p.quantidade_total <= p.estoque_minimo THEN 'critico'
                    WHEN p.quantidade_total <= p.estoque_minimo * 1.5 THEN 'atencao'
                    ELSE 'ok'
                END AS status
             FROM produtos p
             ORDER BY status, p.nome
        `;
        
        const estoque = await client.query(estoqueQuery);
        console.log(`   Itens retornados: ${estoque.rows.length}`);
        
        if (estoque.rows.length > 0) {
            estoque.rows.forEach((item, i) => {
                console.log(`   ${i + 1}. ${item.nome} - Qtd: ${item.quantidade_total} - Status: ${item.status}`);
            });
        } else {
            console.log('   ⚠️  Query retornou vazio');
            if (produtos.rows.length > 0) {
                console.log('   ℹ️  Produtos existem, mas a query não retornou nada.');
                console.log('   💡 Isso pode acontecer se houver algum problema na query ou nos dados.');
            }
        }
        
        // 3. Verificar estrutura da tabela
        console.log('\n3️⃣ Estrutura da tabela produtos:');
        const columns = await client.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'produtos'
            ORDER BY ordinal_position
        `);
        columns.rows.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
        });
        
    } catch (error) {
        console.error('\n❌ Erro:', error.message);
        console.error(error);
    } finally {
        client.release();
        await pool.end();
    }
}

debugEstoque();
