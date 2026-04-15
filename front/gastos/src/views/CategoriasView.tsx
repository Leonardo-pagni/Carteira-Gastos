import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { Categoria } from '../types';
import { getCategorias, createCategoria } from '../services/categoriaService';

interface CategoriasViewProps {
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export const CategoriasView: React.FC<CategoriasViewProps> = ({ showToast }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState('Despesa');

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const json = await getCategorias();
      setCategorias(json.data?.items || []);
    } catch (err) {
      showToast('Falha ao carregar categorias.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategorias(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCategoria({ descricao, finalidade });
      showToast('Categoria criada com sucesso!', 'success');
      setDescricao('');
      setFinalidade('Despesa');
      setIsFormOpen(false);
      fetchCategorias();
    } catch (err) {
      showToast('Erro ao criar categoria.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Component Header & Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Categorias</h2>
          <p className="text-gray-500 text-sm">Classifique suas transações</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition-colors"
        >
          {isFormOpen ? 'Cancelar' : <><Plus className="w-4 h-4 mr-2" /> Nova Categoria</>}
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <input 
              type="text" required maxLength={400}
              value={descricao} onChange={e => setDescricao(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Ex: Salário Mensal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Finalidade</label>
            <select 
              value={finalidade} onChange={e => setFinalidade(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
              <option value="Ambas">Ambas</option>
            </select>
          </div>
          <div className="col-span-full flex justify-end">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Cadastrar Categoria
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
              <th className="p-4 font-semibold w-48">Finalidade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={2} className="p-8 text-center text-gray-400">Carregando dados...</td></tr>
            ) : categorias.length === 0 ? (
              <tr><td colSpan={2} className="p-8 text-center text-gray-400">Nenhuma categoria cadastrada.</td></tr>
            ) : (
              categorias.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{c.descricao}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      c.finalidade.toLowerCase().includes('receita') ? 'bg-green-50 text-green-700 border-green-200' : 
                      c.finalidade.toLowerCase().includes('despesa') ? 'bg-red-50 text-red-700 border-red-200' : 
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {c.finalidade}
                    </span>
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