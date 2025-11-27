import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

const tipoPermitido = ['entrada', 'saida'];

// Listar movimentações
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT m.id, m.produto_id, p.nome AS produto_nome, m.tipo, m.quantidade, m.observacao, m.created_at
             FROM movimentacoes m
             JOIN produtos p ON p.id = m.produto_id
             ORDER BY m.created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Criar movimentação
router.post('/', async (req, res, next) => {
    const { produto_id, tipo, quantidade, observacao } = req.body;

    if (!produto_id || !tipo || !quantidade) {
        return res.status(400).json({ message: 'produto_id, tipo e quantidade são obrigatórios' });
    }

    if (!tipoPermitido.includes(tipo)) {
        return res.status(400).json({ message: 'tipo deve ser entrada ou saida' });
    }

    const valorQuantidade = Number(quantidade);
    if (!Number.isFinite(valorQuantidade) || valorQuantidade <= 0) {
        return res.status(400).json({ message: 'quantidade deve ser um número maior que zero' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const produto = await client.query('SELECT id FROM produtos WHERE id = $1', [produto_id]);
        if (!produto.rows.length) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        const delta = tipo === 'entrada' ? valorQuantidade : -valorQuantidade;
        if (delta < 0) {
            const estoqueAtual = await client.query('SELECT quantidade_total FROM produtos WHERE id = $1', [produto_id]);
            if (estoqueAtual.rows[0].quantidade_total + delta < 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Saldo insuficiente para saída' });
            }
        }

        const movimento = await client.query(
            `INSERT INTO movimentacoes (produto_id, tipo, quantidade, observacao)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [produto_id, tipo, valorQuantidade, observacao || null]
        );

        await client.query(
            `UPDATE produtos
             SET quantidade_total = quantidade_total + $1,
                 updated_at = NOW()
             WHERE id = $2`,
            [delta, produto_id]
        );

        await client.query('COMMIT');
        res.status(201).json(movimento.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

// Remover movimentação
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const mov = await client.query('SELECT * FROM movimentacoes WHERE id = $1', [id]);
        if (!mov.rows.length) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Movimentação não encontrada' });
        }

        const { produto_id, tipo, quantidade } = mov.rows[0];
        const delta = tipo === 'entrada' ? -quantidade : quantidade;

        await client.query(
            `UPDATE produtos
             SET quantidade_total = quantidade_total + $1,
                 updated_at = NOW()
             WHERE id = $2`,
            [delta, produto_id]
        );

        await client.query('DELETE FROM movimentacoes WHERE id = $1', [id]);
        await client.query('COMMIT');

        res.sendStatus(204);
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

export default router;
