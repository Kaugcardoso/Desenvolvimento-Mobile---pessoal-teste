import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import produtosRoutes from './routes/produtos.js';
import movimentacoesRoutes from './routes/movimentacoes.js';
import estoqueRoutes from './routes/estoque.js';
import fornecedoresRoutes from './routes/fornecedores.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
    origin: (process.env.CORS_ORIGIN || '*').split(','),
    credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/produtos', produtosRoutes);
app.use('/movimentacoes', movimentacoesRoutes);
app.use('/estoque', estoqueRoutes);
app.use('/fornecedores', fornecedoresRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint não encontrado' });
});

app.use((err, req, res, next) => {
    console.error('[api] erro não tratado', err);
    res.status(err.status || 500).json({
        message: err.message || 'Erro interno',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
