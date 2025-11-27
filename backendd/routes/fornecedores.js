import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Listar fornecedores
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT id, nome, email, telefone, observacoes, ativo, created_at
             FROM fornecedores
             ORDER BY nome`
        );
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Buscar fornecedor por id
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM fornecedores WHERE id = $1', [id]);

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Adicionar fornecedor
router.post('/', async (req, res, next) => {
    try {
        const { nome, email, telefone, observacoes, ativo } = req.body;

        if (!nome) {
            return res.status(400).json({ message: 'O campo nome é obrigatório' });
        }

        const result = await pool.query(
            `INSERT INTO fornecedores (nome, email, telefone, observacoes, ativo)
             VALUES ($1, $2, $3, $4, COALESCE($5, true))
             RETURNING *`,
            [
                nome.trim(),
                email?.trim() || null,
                telefone?.trim() || null,
                observacoes?.trim() || null,
                typeof ativo === 'boolean' ? ativo : null,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Atualizar fornecedor
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nome, email, telefone, observacoes, ativo } = req.body;

        const result = await pool.query(
            `UPDATE fornecedores
             SET nome = COALESCE($1, nome),
                 email = COALESCE($2, email),
                 telefone = COALESCE($3, telefone),
                 observacoes = COALESCE($4, observacoes),
                 ativo = COALESCE($5::boolean, ativo)
             WHERE id = $6
             RETURNING *`,
            [nome, email, telefone, observacoes, ativo, id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Remover fornecedor
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM fornecedores WHERE id = $1 RETURNING id', [id]);

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

export default router;
