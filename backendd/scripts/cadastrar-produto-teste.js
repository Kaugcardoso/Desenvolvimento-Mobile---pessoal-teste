import dotenv from 'dotenv';
dotenv.config();

import { pool } from '../db.js';

async function cadastrarTeste() {
    const client = await pool.connect();
    
    try {
        console.log('🧪 Cadastrando produto de teste...\n');
        
        // Verificar se já existe
        const existe = await client.query('SELECT id FROM produtos WHERE nome = $1', ['Produto Teste']);
        if (existe.rows.length > 0) {
            console.log('⚠️  Produto de teste já existe (ID:', existe.rows[0].id, ')');
            console.log('💡 Delete-o manualmente se quiser recriar.');
            return;
        }
        
        // Cadastrar produto
        const produto = await client.query(`
            INSERT INTO produtos (nome, sku, valor, quantidade_total, estoque_minimo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, ['Produto Teste', 'TEST-001', 29.90, 10, 5]);
        
        console.log('✅ Produto cadastrado com sucesso!');
        console.log('   ID:', produto.rows[0].id);
        console.log('   Nome:', produto.rows[0].nome);
        console.log('   Quantidade:', produto.rows[0].quantidade_total);
        console.log('   Estoque Mínimo:', produto.rows[0].estoque_minimo);
        console.log('\n💡 Agora teste o estoque novamente!');
        
    } catch (error) {
        console.error('\n❌ Erro ao cadastrar:', error.message);
    } finally {
        client.release();
        await pool.end();
    }
}

cadastrarTeste();
