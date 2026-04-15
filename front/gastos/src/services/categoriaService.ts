import { API_BASE_URL } from '../constants/api';
import type { Categoria, PaginatedResponse } from '../types';

export const getCategorias = async (): Promise<PaginatedResponse<Categoria>> => {
  const res = await fetch(`${API_BASE_URL}/Categoria?Page=1&PageSize=100`);
  if (!res.ok) throw new Error('Erro ao buscar categorias');
  return res.json();
};

export const createCategoria = async (payload: { descricao: string; finalidade: string }) => {
  const res = await fetch(`${API_BASE_URL}/Categoria`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao criar categoria');
  return res.json();
};