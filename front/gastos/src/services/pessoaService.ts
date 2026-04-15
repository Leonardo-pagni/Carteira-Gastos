import { API_BASE_URL } from '../constants/api';
import type { Pessoa, PaginatedResponse } from '../types';

export const getPessoas = async (): Promise<PaginatedResponse<Pessoa>> => {
  const res = await fetch(`${API_BASE_URL}/Pessoa?Page=1&PageSize=100`);
  if (!res.ok) throw new Error('Erro ao buscar pessoas');
  return res.json();
};

export const createPessoa = async (payload: { nome: string; idade: number }) => {
  const res = await fetch(`${API_BASE_URL}/Pessoa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao criar');
  return res.json();
};

export const updatePessoa = async (id: string, payload: { nome: string; idade: number }) => {
  const res = await fetch(`${API_BASE_URL}/Pessoa/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao atualizar');
  return res.json();
};

export const deletePessoa = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/Pessoa/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao deletar');
  return true;
};