import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Listar produtos
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT id, nome, sku, valor, COALESCE(custo, 0) AS custo, quantidade_total, estoque_minimo
             FROM produtos
             ORDER BY nome`
        );
    res.json(result.rows);
    } catch (error) {
        console.error('[produtos] Erro ao listar:', error);
        next(error);
    }
});

// Buscar produto por id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT id, nome, sku, valor, COALESCE(custo, 0) AS custo, quantidade_total, estoque_minimo
             FROM produtos WHERE id = $1`,
            [id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Adicionar produto
router.post('/', async (req, res, next) => {
    try {
        const { nome, sku, valor, custo } = req.body;

        if (!nome) {
            return res.status(400).json({ message: 'O campo nome é obrigatório' });
        }

        const result = await pool.query(
            `INSERT INTO produtos (nome, sku, valor, custo)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                nome.trim(),
                sku?.trim() || null,
                Number(valor) || 0,
                custo !== undefined ? Number(custo) : 0,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Atualizar produto
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nome, sku, valor, custo, estoque_minimo } = req.body;

    const result = await pool.query(
            `UPDATE produtos
             SET nome = COALESCE($1, nome),
                 sku = COALESCE($2, sku),
                 valor = COALESCE($3, valor),
                 custo = COALESCE($4, custo),
                 estoque_minimo = COALESCE($5, estoque_minimo),
                 updated_at = NOW()
             WHERE id = $6
             RETURNING *`,
            [
                nome, 
                sku, 
                valor, 
                custo !== undefined ? Number(custo) : null, 
                estoque_minimo !== undefined ? Number(estoque_minimo) : null, 
                id
            ]
    );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

    res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Remover produto
router.delete('/:id', async (req, res, next) => {
    try {
    const { id } = req.params;
        const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING id', [id]);

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

    res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

export default router;
