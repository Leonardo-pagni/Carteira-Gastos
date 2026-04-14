import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Tags, ArrowRightLeft, LayoutDashboard, 
  Plus, Trash2, Edit2, AlertCircle, CheckCircle2, ChevronRight 
} from 'lucide-react';

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================
const API_BASE_URL = 'http://localhost:5000';

// ==========================================
// TIPAGENS (DTOs)
// ==========================================
interface Pessoa {
  id: string;
  nome: string;
  idade: number;
  totalValorDespesa: number;
  totalValorReceita: number;
  saldo: number;
}

interface Categoria {
  id: string;
  descricao: string;
  finalidade: string; // "Despesa", "Receita", "Ambas"
}

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: string;
  categoria: string;
  pessoa: string;
}

interface PaginatedResponse<T> {
  data: {
    items: T[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  message: string;
}

// ==========================================
// COMPONENTES DE UI
// ==========================================
const Toast = ({ message, type, onClose }: { message: string, type: 'success'|'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg text-white transition-all ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
      <span className="font-medium">{message}</span>
    </div>
  );
};

// ==========================================
// ABAS DA APLICAÇÃO
// ==========================================

// 1. ABA DE PESSOAS (Inclui o Dashboard de Totais)
const PessoasView = ({ showToast }: { showToast: (msg: string, type: 'success'|'error') => void }) => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number | ''>('');

  const fetchPessoas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/Pessoa?Page=1&PageSize=100`);
      if (!res.ok) throw new Error('Erro ao buscar pessoas');
      const json: PaginatedResponse<Pessoa> = await res.json();
      setPessoas(json.data?.items || []);
    } catch (err) {
      showToast('Falha ao comunicar com a API.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { nome, idade: Number(idade) };
      const url = editingId ? `${API_BASE_URL}/Pessoa/${editingId}` : `${API_BASE_URL}/Pessoa`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erro ao salvar');
      
      showToast(editingId ? 'Pessoa atualizada!' : 'Pessoa criada com sucesso!', 'success');
      resetForm();
      fetchPessoas();
    } catch (err) {
      showToast('Erro ao salvar pessoa.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar? Todas as transações desta pessoa também serão apagadas.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/Pessoa/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar');
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

  // Calculando os totais gerais (Dashboard)
  const totaisGerais = useMemo(() => {
    return pessoas.reduce((acc, curr) => ({
      receitas: acc.receitas + (curr.totalValorReceita || 0),
      despesas: acc.despesas + (curr.totalValorDespesa || 0),
      saldo: acc.saldo + (curr.saldo || 0)
    }), { receitas: 0, despesas: 0, saldo: 0 });
  }, [pessoas]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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
                  <td colSpan={2} className="p-4 font-bold text-gray-800 text-right uppercase text-sm tracking-wider">
                    Totais Gerais:
                  </td>
                  <td className="p-4 text-right font-bold text-green-700 text-lg">
                    R$ {totaisGerais.receitas.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-bold text-red-700 text-lg">
                    R$ {totaisGerais.despesas.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-black text-blue-700 text-lg">
                    R$ {totaisGerais.saldo.toFixed(2)}
                  </td>
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


// 2. ABA DE CATEGORIAS
const CategoriasView = ({ showToast }: { showToast: (msg: string, type: 'success'|'error') => void }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState('Despesa'); // Despesa, Receita, Ambas

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/Categoria?Page=1&PageSize=100`);
      if (!res.ok) throw new Error('Erro');
      const json: PaginatedResponse<Categoria> = await res.json();
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
      const payload = { descricao, finalidade };
      const res = await fetch(`${API_BASE_URL}/Categoria`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Erro ao salvar');
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


// 3. ABA DE TRANSAÇÕES
const TransacoesView = ({ showToast }: { showToast: (msg: string, type: 'success'|'error') => void }) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState<number | ''>('');
  const [tipo, setTipo] = useState('Despesa'); // Despesa, Receita
  const [pessoaId, setPessoaId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  // Fetch init data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Transacoes expects Headers for pagination as per the prompt
        const resTrans = await fetch(`${API_BASE_URL}/Transacoes`, {
          headers: { 'Page': '1', 'PageSize': '100' }
        });
        const jsonTrans: PaginatedResponse<Transacao> = resTrans.ok ? await resTrans.json() : { data: { items: [] }, message: '' };
        
        const resPessoas = await fetch(`${API_BASE_URL}/Pessoa?Page=1&PageSize=100`);
        const jsonPessoas: PaginatedResponse<Pessoa> = resPessoas.ok ? await resPessoas.json() : { data: { items: [] }, message: '' };

        const resCat = await fetch(`${API_BASE_URL}/Categoria?Page=1&PageSize=100`);
        const jsonCat: PaginatedResponse<Categoria> = resCat.ok ? await resCat.json() : { data: { items: [] }, message: '' };

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

  // Business Rules Logic
  const selectedPessoa = pessoas.find(p => p.id === pessoaId);
  const isMinor = selectedPessoa ? selectedPessoa.idade < 18 : false;

  // Force 'Despesa' if minor
  useEffect(() => {
    if (isMinor && tipo !== 'Despesa') {
      setTipo('Despesa');
      showToast('Menores de idade só podem registrar despesas.', 'error');
    }
  }, [isMinor, tipo, showToast]);

  // Filter categories based on transaction type
  const categoriasFiltradas = categorias.filter(c => {
    const fin = c.finalidade.toLowerCase();
    const t = tipo.toLowerCase();
    // Se a categoria for "Ambas", serve pra tudo. 
    // Se não for, precisa conter a palavra do tipo (ex: "despesa" dentro de "despesas")
    return fin.includes('ambas') || fin.includes(t) || t.includes(fin);
  });

  // Verify if selected category is still valid after type change
  useEffect(() => {
    if (categoriaId) {
      const isValid = categoriasFiltradas.some(c => c.id === categoriaId);
      if (!isValid) setCategoriaId(''); // reset se ficou invalido
    }
  }, [tipo, categoriasFiltradas, categoriaId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { descricao, valor: Number(valor), tipo, categoriaId, pessoaId };
      const res = await fetch(`${API_BASE_URL}/Transacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Erro');
      
      showToast('Transação criada com sucesso!', 'success');
      setDescricao('');
      setValor('');
      setCategoriaId('');
      // Refetch
      const resTrans = await fetch(`${API_BASE_URL}/Transacoes`, { headers: { 'Page': '1', 'PageSize': '100' } });
      const jsonTrans = await resTrans.json();
      setTransacoes(jsonTrans.data?.items || []);
      setIsFormOpen(false);
    } catch (err) {
      showToast('Erro ao criar transação.', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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

// ==========================================
// MAIN APP & LAYOUT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState<'pessoas' | 'categorias' | 'transacoes'>('pessoas');
  const [toastConfig, setToastConfig] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const showToast = (msg: string, type: 'success'|'error') => setToastConfig({ msg, type });

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Sidebar de Navegação */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex md:flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-blue-600">
            <LayoutDashboard className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-gray-900">FinanceApp</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('pessoas')}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'pessoas' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <div className="flex items-center space-x-3"><Users className="w-5 h-5" /><span>Pessoas & Dashboard</span></div>
            {activeTab === 'pessoas' && <ChevronRight className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('categorias')}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'categorias' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <div className="flex items-center space-x-3"><Tags className="w-5 h-5" /><span>Categorias</span></div>
            {activeTab === 'categorias' && <ChevronRight className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setActiveTab('transacoes')}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'transacoes' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <div className="flex items-center space-x-3"><ArrowRightLeft className="w-5 h-5" /><span>Transações</span></div>
            {activeTab === 'transacoes' && <ChevronRight className="w-4 h-4" />}
          </button>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center overflow-x-auto space-x-2">
           <button onClick={() => setActiveTab('pessoas')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'pessoas' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Pessoas</button>
           <button onClick={() => setActiveTab('categorias')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'categorias' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Categorias</button>
           <button onClick={() => setActiveTab('transacoes')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'transacoes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Transações</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'pessoas' && <PessoasView showToast={showToast} />}
            {activeTab === 'categorias' && <CategoriasView showToast={showToast} />}
            {activeTab === 'transacoes' && <TransacoesView showToast={showToast} />}
          </div>
        </div>
      </main>

      {/* Toasts de feedback de sucesso/erro */}
      {toastConfig && (
        <Toast 
          message={toastConfig.msg} 
          type={toastConfig.type} 
          onClose={() => setToastConfig(null)} 
        />
      )}
    </div>
  );
}