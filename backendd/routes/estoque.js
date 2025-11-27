import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Resumo de estoque por produto
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT
                p.id,
                p.nome,
                p.sku,
                p.valor,
                COALESCE(p.custo, 0) AS custo,
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
             ORDER BY status, p.nome`
        );

        console.log(`[estoque] Retornando ${result.rows.length} itens de estoque`);
        res.json(result.rows);
    } catch (error) {
        console.error('[estoque] Erro ao buscar estoque:', error);
        next(error);
    }
});

export default router;
