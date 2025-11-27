-- Criação do banco (execute apenas uma vez)
-- CREATE DATABASE jjk_control;

CREATE TABLE IF NOT EXISTS fornecedores (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    sku TEXT UNIQUE,
    valor DECIMAL(10, 2) DEFAULT 0 CHECK (valor >= 0),
    quantidade_total INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_total >= 0),
    estoque_minimo INTEGER NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0),
    fornecedor_id INTEGER REFERENCES fornecedores(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Adicionar coluna valor caso a tabela já exista
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='produtos' AND column_name='valor') THEN
        ALTER TABLE produtos ADD COLUMN valor DECIMAL(10, 2) DEFAULT 0 CHECK (valor >= 0);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS movimentacoes (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    observacao TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'produtos_updated_at'
    ) THEN
        CREATE TRIGGER produtos_updated_at
        BEFORE UPDATE ON produtos
        FOR EACH ROW
        EXECUTE PROCEDURE atualizar_updated_at();
    END IF;
END;
$$;

