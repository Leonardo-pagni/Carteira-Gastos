import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import type { Pessoa } from '../types';
import { getPessoas, createPessoa, updatePessoa, deletePessoa } from '../services/pessoaService';

interface PessoasViewProps {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const PessoasView: React.FC<PessoasViewProps> = ({ showToast }) => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');

  const fetchPessoas = async () => {
    try {
      setLoading(true);
      const json = await getPessoas();
      setPessoas(json.data?.items || []);
    } catch (err) {
      showToast('Falha ao comunicar com a API.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPessoas(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { nome, idade: Number(idade) };
      if (editingId) {
        await updatePessoa(editingId, payload);
        showToast('Pessoa atualizada!', 'success');
      } else {
        await createPessoa(payload);
        showToast('Pessoa criada com sucesso!', 'success');
      }
      resetForm();
      fetchPessoas();
    } catch (err) {
      showToast('Erro ao salvar pessoa.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar? Todas as transações desta pessoa também serão apagadas.')) return;
    try {
      await deletePessoa(id);
      showToast('Pessoa deletada com sucesso!', 'success');
      fetchPessoas();
    } catch (err) {
      showToast('Erro ao deletar pessoa.', 'error');
    }
  };

  const openEdit = (pessoa: Pessoa) => {
    setEditingId(pessoa.id);
    setNome(pessoa.nome);
    setIdade(pessoa.idade);
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setNome('');
    setIdade('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const totaisGerais = useMemo(() => {
    return pessoas.reduce((acc, curr) => ({
      receitas: acc.receitas + (curr.totalValorReceita || 0),
      despesas: acc.despesas + (curr.totalValorDespesa || 0),
      saldo: acc.saldo + (curr.saldo || 0)
    }), { receitas: 0, despesas: 0, saldo: 0 });
  }, [pessoas]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* View Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pessoas & Totais</h2>
          <p className="text-gray-500 text-sm">Gerencie o cadastro e visualize os saldos</p>
        </div>
        <button 
          onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          {isFormOpen ? 'Cancelar' : <><Plus className="w-4 h-4 mr-2" /> Nova Pessoa</>}
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input 
              type="text" required maxLength={200}
              value={nome} onChange={e => setNome(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ex: João da Silva"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
            <input 
              type="number" required min="0" max="150"
              value={idade} onChange={e => setIdade(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ex: 30"
            />
          </div>
          <div className="col-span-full flex justify-end">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              {editingId ? 'Salvar Alterações' : 'Cadastrar Pessoa'}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Nome</th>
                <th className="p-4 font-semibold w-24 text-center">Idade</th>
                <th className="p-4 font-semibold text-right text-green-600">Receitas (R$)</th>
                <th className="p-4 font-semibold text-right text-red-600">Despesas (R$)</th>
                <th className="p-4 font-semibold text-right text-blue-600">Saldo Líquido (R$)</th>
                <th className="p-4 font-semibold text-center w-28">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Carregando dados...</td></tr>
              ) : pessoas.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-400">Nenhuma pessoa cadastrada.</td></tr>
              ) : (
                pessoas.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-800 font-medium">{p.nome}</td>
                    <td className="p-4 text-gray-600 text-center">{p.idade}</td>
                    <td className="p-4 text-right text-green-600 font-medium">{p.totalValorReceita.toFixed(2)}</td>
                    <td className="p-4 text-right text-red-600 font-medium">{p.totalValorDespesa.toFixed(2)}</td>
                    <td className="p-4 text-right text-blue-600 font-bold">{p.saldo.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {pessoas.length > 0 && (
              <tfoot className="bg-gray-50/80 border-t-2 border-gray-200">
                <tr>
                  <td colSpan={2} className="p-4 font-bold text-gray-800 text-right uppercase text-sm tracking-wider">Totais Gerais:</td>
                  <td className="p-4 text-right font-bold text-green-700 text-lg">R$ {totaisGerais.receitas.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-red-700 text-lg">R$ {totaisGerais.despesas.toFixed(2)}</td>
                  <td className="p-4 text-right font-black text-blue-700 text-lg">R$ {totaisGerais.saldo.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};