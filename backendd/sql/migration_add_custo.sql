-- Adiciona a coluna 'custo' na tabela produtos se ela não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'produtos' 
        AND column_name = 'custo'
    ) THEN
        ALTER TABLE produtos ADD COLUMN custo DECIMAL(10, 2) DEFAULT 0;
        COMMENT ON COLUMN produtos.custo IS 'Custo unitário do produto para cálculo de margem de lucro';
    END IF;
END $$;

