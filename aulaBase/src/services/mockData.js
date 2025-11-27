const now = () => new Date().toISOString();

let produtoSeq = 4;
let fornecedorSeq = 3;
let movimentacaoSeq = 4;

const fornecedores = [
  { id: 1, nome: 'Fornecedor Alpha', email: 'alpha@forn.com', telefone: '11 1111-1111', observacoes: 'Entrega rápida', ativo: true, created_at: now() },
  { id: 2, nome: 'Fornecedor Beta', email: 'beta@forn.com', telefone: '22 2222-2222', observacoes: '', ativo: true, created_at: now() },
];

const produtos = [
  { id: 1, nome: 'Camiseta Preta', sku: 'CAM-001', valor: 49.90, custo: 25.00, quantidade_total: 25, estoque_minimo: 5, fornecedor_id: 1, created_at: now(), updated_at: now() },
  { id: 2, nome: 'Calça Jeans', sku: 'CAL-204', valor: 129.90, custo: 65.00, quantidade_total: 12, estoque_minimo: 4, fornecedor_id: 2, created_at: now(), updated_at: now() },
  { id: 3, nome: 'Tênis Running', sku: 'TEN-889', valor: 299.90, custo: 150.00, quantidade_total: 7, estoque_minimo: 3, fornecedor_id: 2, created_at: now(), updated_at: now() },
];

const movimentacoes = [
  { id: 1, produto_id: 1, produto_nome: 'Camiseta Preta', tipo: 'entrada', quantidade: 10, observacao: 'Reposição semanal', created_at: now() },
  { id: 2, produto_id: 2, produto_nome: 'Calça Jeans', tipo: 'saida', quantidade: 3, observacao: 'Venda PDV', created_at: now() },
  { id: 3, produto_id: 3, produto_nome: 'Tênis Running', tipo: 'entrada', quantidade: 5, observacao: '', created_at: now() },
];

const clone = (data) => JSON.parse(JSON.stringify(data));

const listEstoque = () =>
  produtos.map((produto) => {
    const saldo = Math.max(produto.quantidade_total - produto.estoque_minimo, 0);
    let status = 'ok';
    if (produto.quantidade_total <= 0) status = 'zerado';
    else if (produto.quantidade_total <= produto.estoque_minimo) status = 'critico';
    else if (produto.quantidade_total <= produto.estoque_minimo * 1.5) status = 'atencao';

    return {
      id: produto.id,
      nome: produto.nome,
      sku: produto.sku,
      valor: produto.valor,
      custo: produto.custo || 0,
      quantidade_total: produto.quantidade_total,
      estoque_minimo: produto.estoque_minimo,
      saldo_sobre_minimo: saldo,
      status,
    };
  });

const findProduto = (id) => produtos.find((p) => p.id === Number(id));

export const mockStore = {
  listProdutos: () => Promise.resolve(clone(produtos)),
  getProduto: (id) => {
    const produto = findProduto(id);
    return Promise.resolve(produto ? clone(produto) : null);
  },
  addProduto: ({ nome, sku, valor = 0 }) => {
    const novo = {
      id: produtoSeq++,
      nome: nome?.trim() || 'Novo Produto',
      sku: sku?.trim() || null,
      valor: Number(valor) || 0,
      quantidade_total: 0,
      estoque_minimo: 0,
      created_at: now(),
      updated_at: now(),
    };
    produtos.push(novo);
    return Promise.resolve(clone(novo));
  },
  updateProduto: (id, payload) => {
    const produto = findProduto(id);
    if (!produto) return Promise.reject(new Error('Produto não encontrado'));
    Object.assign(produto, payload, { updated_at: now() });
    return Promise.resolve(clone(produto));
  },
  removeProduto: (id) => {
    const index = produtos.findIndex((p) => p.id === Number(id));
    if (index >= 0) produtos.splice(index, 1);
    return Promise.resolve();
  },
  listFornecedores: () => Promise.resolve(clone(fornecedores)),
  addFornecedor: ({ nome, email, telefone, observacoes, ativo = true }) => {
    const novo = {
      id: fornecedorSeq++,
      nome: nome?.trim() || 'Novo Fornecedor',
      email: email?.trim() || null,
      telefone: telefone?.trim() || null,
      observacoes: observacoes?.trim() || null,
      ativo: Boolean(ativo),
      created_at: now(),
    };
    fornecedores.push(novo);
    return Promise.resolve(clone(novo));
  },
  updateFornecedor: (id, payload) => {
    const fornecedor = fornecedores.find((f) => f.id === Number(id));
    if (!fornecedor) return Promise.reject(new Error('Fornecedor não encontrado'));
    Object.assign(fornecedor, payload);
    return Promise.resolve(clone(fornecedor));
  },
  removeFornecedor: (id) => {
    const index = fornecedores.findIndex((f) => f.id === Number(id));
    if (index >= 0) fornecedores.splice(index, 1);
    return Promise.resolve();
  },
  listMovimentacoes: () => Promise.resolve(clone(movimentacoes)),
  addMovimentacao: ({ produto_id, tipo, quantidade, observacao }) => {
    const produto = findProduto(produto_id);
    if (!produto) return Promise.reject(new Error('Produto não encontrado'));
    const delta = tipo === 'entrada' ? Number(quantidade) : -Number(quantidade);
    produto.quantidade_total = Math.max(produto.quantidade_total + delta, 0);
    produto.updated_at = now();

    const novo = {
      id: movimentacaoSeq++,
      produto_id: produto.id,
      produto_nome: produto.nome,
      tipo,
      quantidade: Number(quantidade),
      observacao: observacao || null,
      created_at: now(),
    };
    movimentacoes.unshift(novo);
    return Promise.resolve(clone(novo));
  },
  removeMovimentacao: (id) => {
    const index = movimentacoes.findIndex((m) => m.id === Number(id));
    if (index >= 0) {
      const [mov] = movimentacoes.splice(index, 1);
      const produto = findProduto(mov.produto_id);
      if (produto) {
        const delta = mov.tipo === 'entrada' ? -mov.quantidade : mov.quantidade;
        produto.quantidade_total = Math.max(produto.quantidade_total + delta, 0);
        produto.updated_at = now();
      }
    }
    return Promise.resolve();
  },
  listEstoque: () => Promise.resolve(clone(listEstoque())),
};

