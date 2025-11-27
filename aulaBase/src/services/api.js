import axios from 'axios';
import { mockStore } from './mockData';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:3000';
const useMocksFromEnv = process.env.EXPO_PUBLIC_USE_MOCKS === 'true';

const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

const listeners = new Set();
let offlineMode = useMocksFromEnv;

const notifyListeners = () => {
  listeners.forEach((listener) => listener(offlineMode));
};

const unwrap = (promise) => promise.then((response) => response.data);

const execute = async (requestFn, fallbackFn) => {
  if (offlineMode || useMocksFromEnv) {
    if (fallbackFn) return fallbackFn();
    return requestFn();
  }

  try {
    return await requestFn();
  } catch (error) {
    if (fallbackFn) {
      console.warn('[api] backend indisponível, usando dados locais.');
      offlineMode = true;
      notifyListeners();
      return fallbackFn();
    }
    throw error;
  }
};

export const produtosApi = {
  list: () => execute(() => unwrap(api.get('/produtos')), () => mockStore.listProdutos()),
  get: (id) => execute(() => unwrap(api.get(`/produtos/${id}`)), () => mockStore.getProduto(id)),
  create: (payload) => execute(() => unwrap(api.post('/produtos', payload)), () => mockStore.addProduto(payload)),
  update: (id, payload) => execute(() => unwrap(api.put(`/produtos/${id}`, payload)), () => mockStore.updateProduto(id, payload)),
  remove: (id) => execute(() => api.delete(`/produtos/${id}`), () => mockStore.removeProduto(id)),
};

export const fornecedoresApi = {
  list: () => execute(() => unwrap(api.get('/fornecedores')), () => mockStore.listFornecedores()),
  create: (payload) => execute(() => unwrap(api.post('/fornecedores', payload)), () => mockStore.addFornecedor(payload)),
  update: (id, payload) => execute(() => unwrap(api.put(`/fornecedores/${id}`, payload)), () => mockStore.updateFornecedor(id, payload)),
  remove: (id) => execute(() => api.delete(`/fornecedores/${id}`), () => mockStore.removeFornecedor(id)),
};

export const movimentacoesApi = {
  list: () => execute(() => unwrap(api.get('/movimentacoes')), () => mockStore.listMovimentacoes()),
  create: (payload) => execute(() => unwrap(api.post('/movimentacoes', payload)), () => mockStore.addMovimentacao(payload)),
  remove: (id) => execute(() => api.delete(`/movimentacoes/${id}`), () => mockStore.removeMovimentacao(id)),
};

export const estoqueApi = {
  list: () => execute(() => unwrap(api.get('/estoque')), () => mockStore.listEstoque()),
};

export const subscribeOfflineMode = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const isOfflineMode = () => offlineMode;
export const getApiBaseUrl = () => baseURL;

export default api;

