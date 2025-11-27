-- Migration: Adicionar coluna valor na tabela produtos
-- Execute este script caso a tabela produtos já exista

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'produtos' AND column_name = 'valor'
    ) THEN
        ALTER TABLE produtos ADD COLUMN valor DECIMAL(10, 2) DEFAULT 0 CHECK (valor >= 0);
        RAISE NOTICE 'Coluna valor adicionada com sucesso na tabela produtos';
    ELSE
        RAISE NOTICE 'Coluna valor já existe na tabela produtos';
    END IF;
END $$;
