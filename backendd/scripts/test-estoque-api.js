import dotenv from 'dotenv';
dotenv.config();

const baseURL = `http://localhost:${process.env.PORT || 3000}`;

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

async function testEstoque() {
    try {
        console.log('🧪 Testando API de Estoque...\n');
        console.log(`URL base: ${baseURL}\n`);

        // 1. Testar health
        console.log('1️⃣ Testando /health...');
        const health = await fetchJSON(`${baseURL}/health`);
        console.log('   ✅ Health check:', health);

        // 2. Verificar produtos existentes
        console.log('\n2️⃣ Verificando produtos cadastrados...');
        let produtos = [];
        try {
            produtos = await fetchJSON(`${baseURL}/produtos`);
            console.log(`   📦 Produtos cadastrados: ${produtos.length}`);
            if (produtos.length > 0) {
                console.log('   Produtos:', produtos.map(p => ({ id: p.id, nome: p.nome, quantidade: p.quantidade_total || 0 })));
            } else {
                console.log('   ⚠️  Nenhum produto cadastrado ainda.');
            }
        } catch (err) {
            console.log('   ❌ Erro ao buscar produtos:', err.message);
            try {
                const errorDetail = await fetch(`${baseURL}/produtos`).then(r => r.text()).catch(() => '');
                console.log('   Detalhes:', errorDetail.substring(0, 200));
            } catch {}
        }

        // 3. Testar rota de estoque
        console.log('\n3️⃣ Testando rota /estoque...');
        const estoque = await fetchJSON(`${baseURL}/estoque`);
        console.log(`   📊 Itens de estoque retornados: ${estoque.length}`);
        
        if (estoque.length > 0) {
            console.log('\n   Itens no estoque:');
            estoque.forEach((item, index) => {
                console.log(`   ${index + 1}. ${item.nome} - Qtd: ${item.quantidade_total} - Status: ${item.status}`);
            });
        } else {
            console.log('   ⚠️  Nenhum item retornado.');
            if (produtos.length === 0) {
                console.log('   💡 Dica: Cadastre produtos primeiro na tela "Produtos"');
            } else {
                console.log('   💡 Dica: Adicione movimentações para aumentar a quantidade dos produtos');
            }
        }

        console.log('\n✅ Teste concluído!');

    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
            console.error('\n❌ Erro: Não foi possível conectar ao backend.');
            console.error('   💡 Certifique-se de que o servidor está rodando: npm run dev');
        } else if (error.message.includes('HTTP')) {
            console.error('\n❌ Erro na API:', error.message);
        } else {
            console.error('\n❌ Erro:', error.message);
        }
        process.exit(1);
    }
}

testEstoque();
