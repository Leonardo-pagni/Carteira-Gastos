import { API_BASE_URL } from '../constants/api';
import type { Transacao, PaginatedResponse } from '../types';

export const getTransacoes = async (): Promise<PaginatedResponse<Transacao>> => {
  const res = await fetch(`${API_BASE_URL}/Transacoes`, {
    headers: { 'Page': '1', 'PageSize': '100' }
  });
  if (!res.ok) throw new Error('Erro ao buscar transações');
  return res.json();
};

export const createTransacao = async (payload: any) => {
  const res = await fetch(`${API_BASE_URL}/Transacoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao criar transação');
  return res.json();
};