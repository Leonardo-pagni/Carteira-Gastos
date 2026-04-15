import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { Transacao, Pessoa, Categoria } from '../types';
import { getTransacoes, createTransacao } from '../services/transacaoService';
import { getPessoas } from '../services/pessoaService';
import { getCategorias } from '../services/categoriaService';

interface TransacoesViewProps {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const TransacoesView: React.FC<TransacoesViewProps> = ({ showToast }) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [tipo, setTipo] = useState('Despesa');
  const [pessoaId, setPessoaId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [jsonTrans, jsonPessoas, jsonCat] = await Promise.all([
          getTransacoes().catch(() => ({ data: { items: [] }, message: '' })),
          getPessoas().catch(() => ({ data: { items: [] }, message: '' })),
          getCategorias().catch(() => ({ data: { items: [] }, message: '' }))
        ]);

        setTransacoes(jsonTrans.data?.items || []);
        setPessoas(jsonPessoas.data?.items || []);
        setCategorias(jsonCat.data?.items || []);
      } catch (err) {
        showToast('Erro ao carregar dados.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [showToast]);

  const selectedPessoa = pessoas.find(p => p.id === pessoaId);
  const isMinor = selectedPessoa ? selectedPessoa.idade < 18 : false;

  useEffect(() => {
    if (isMinor && tipo !== 'Despesa') {
      setTipo('Despesa');
      showToast('Menores de idade só podem registrar despesas.', 'error');
    }
  }, [isMinor, tipo, showToast]);

  const categoriasFiltradas = categorias.filter(c => {
    const fin = c.finalidade.toLowerCase();
    const t = tipo.toLowerCase();
    return fin.includes('ambas') || fin.includes(t) || t.includes(fin);
  });

  useEffect(() => {
    if (categoriaId) {
      const isValid = categoriasFiltradas.some(c => c.id === categoriaId);
      if (!isValid) setCategoriaId(''); 
    }
  }, [tipo, categoriasFiltradas, categoriaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransacao({ descricao, valor: Number(valor), tipo, categoriaId, pessoaId });
      showToast('Transação criada com sucesso!', 'success');
      setDescricao('');
      setValor('');
      setCategoriaId('');
      
      const jsonTrans = await getTransacoes();
      setTransacoes(jsonTrans.data?.items || []);
      setIsFormOpen(false);
    } catch (err) {
      showToast('Erro ao criar transação.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transações</h2>
          <p className="text-gray-500 text-sm">Registre receitas e despesas</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          {isFormOpen ? 'Cancelar' : <><Plus className="w-4 h-4 mr-2" /> Nova Transação</>}
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input 
              type="text" required maxLength={400}
              value={descricao} onChange={e => setDescricao(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ex: Compra no supermercado"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pessoa Responsável</label>
            <select 
              required value={pessoaId} onChange={e => setPessoaId(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="" disabled>Selecione uma pessoa</option>
              {pessoas.map(p => (
                <option key={p.id} value={p.id}>{p.nome} (Idade: {p.idade})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
            <input 
              type="number" required min="0.01" step="0.01"
              value={valor} onChange={e => setValor(e.target.value ? Number(e.target.value) : '')}
              className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Transação</label>
            <select 
              required value={tipo} onChange={e => setTipo(e.target.value)} disabled={isMinor}
              className={`w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${isMinor ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
            >
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
            </select>
            {isMinor && <p className="text-xs text-red-500 mt-1">Menores só podem registrar despesas.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              required value={categoriaId} onChange={e => setCategoriaId(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="" disabled>Selecione uma categoria ({categoriasFiltradas.length} disponíveis)</option>
              {categoriasFiltradas.map(c => (
                <option key={c.id} value={c.id}>{c.descricao}</option>
              ))}
            </select>
          </div>

          <div className="col-span-full flex justify-end mt-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Registrar Transação
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-semibold">Descrição</th>
              <th className="p-4 font-semibold">Pessoa</th>
              <th className="p-4 font-semibold">Categoria</th>
              <th className="p-4 font-semibold w-32">Tipo</th>
              <th className="p-4 font-semibold text-right">Valor (R$)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Carregando dados...</td></tr>
            ) : transacoes.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">Nenhuma transação encontrada.</td></tr>
            ) : (
              transacoes.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{t.descricao}</td>
                  <td className="p-4 text-gray-600">{t.pessoa || '-'}</td>
                  <td className="p-4 text-gray-600">{t.categoria || '-'}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      t.tipo.toLowerCase().includes('receita') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-medium ${t.tipo.toLowerCase().includes('receita') ? 'text-green-600' : 'text-red-600'}`}>
                    {t.valor.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};