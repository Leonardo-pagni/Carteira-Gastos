import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Tags, 
  Receipt, 
  PieChart, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Wallet, 
  TrendingDown, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// --- Types ---
type Pessoa = {
  id: string;
  nome: string;
  idade: number;
};

type Categoria = {
  id: string;
  descricao: string;
  finalidade: 'despesa' | 'receita' | 'ambas';
};

type Transacao = {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'despesa' | 'receita';
  categoriaId: string;
  pessoaId: string;
};

// --- Mock Initial Data ---
const initialPessoas: Pessoa[] = [
  { id: 'p1', nome: 'João Silva', idade: 35 },
  { id: 'p2', nome: 'Maria Souza', idade: 28 },
  { id: 'p3', nome: 'Enzo Gabriel', idade: 16 }, // Menor de idade
];

const initialCategorias: Categoria[] = [
  { id: 'c1', descricao: 'Salário', finalidade: 'receita' },
  { id: 'c2', descricao: 'Alimentação', finalidade: 'despesa' },
  { id: 'c3', descricao: 'Freelance', finalidade: 'ambas' },
];

const initialTransacoes: Transacao[] = [
  { id: 't1', descricao: 'Salário ref. Maio', valor: 5000, tipo: 'receita', categoriaId: 'c1', pessoaId: 'p1' },
  { id: 't2', descricao: 'Supermercado', valor: 850, tipo: 'despesa', categoriaId: 'c2', pessoaId: 'p1' },
  { id: 't3', descricao: 'Lanche escola', valor: 50, tipo: 'despesa', categoriaId: 'c2', pessoaId: 'p3' },
];

const generateId = () => crypto.randomUUID().slice(0, 8);

// --- Shared Components ---
const Modal = ({ isOpen, onClose, title, children }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const Input = ({ label, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      {...props}
    />
  </div>
);

const Select = ({ label, options, ...props }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white disabled:bg-gray-100"
      {...props}
    >
      <option value="">Selecione...</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('pessoas');
  
  // States
  const [pessoas, setPessoas] = useState<Pessoa[]>(initialPessoas);
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);
  const [transacoes, setTransacoes] = useState<Transacao[]>(initialTransacoes);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Pessoas CRUD
  const handleSavePessoa = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nome = formData.get('nome') as string;
    const idade = parseInt(formData.get('idade') as string);

    if (editingItem) {
      setPessoas(pessoas.map(p => p.id === editingItem.id ? { ...p, nome, idade } : p));
    } else {
      setPessoas([...pessoas, { id: generateId(), nome, idade }]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeletePessoa = (id: string) => {
    if (confirm('Tem certeza? Todas as transações desta pessoa serão apagadas.')) {
      setPessoas(pessoas.filter(p => p.id !== id));
      setTransacoes(transacoes.filter(t => t.pessoaId !== id)); // Cascata
    }
  };

  // Categorias CRUD
  const handleSaveCategoria = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const descricao = formData.get('descricao') as string;
    const finalidade = formData.get('finalidade') as any;

    setCategorias([...categorias, { id: generateId(), descricao, finalidade }]);
    setIsModalOpen(false);
  };

  // Transações CRUD
  const handleSaveTransacao = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    setTransacoes([...transacoes, {
      id: generateId(),
      descricao: formData.get('descricao') as string,
      valor: parseFloat(formData.get('valor') as string),
      tipo: formData.get('tipo') as any,
      categoriaId: formData.get('categoriaId') as string,
      pessoaId: formData.get('pessoaId') as string,
    }]);
    setIsModalOpen(false);
  };

  // Totais Cálculo
  const totaisPessoas = useMemo(() => {
    return pessoas.map(pessoa => {
      const txs = transacoes.filter(t => t.pessoaId === pessoa.id);
      const totalReceita = txs.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
      const totalDespesa = txs.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);
      return {
        ...pessoa,
        totalReceita,
        totalDespesa,
        saldo: totalReceita - totalDespesa
      };
    });
  }, [pessoas, transacoes]);

  const totaisGerais = useMemo(() => {
    return totaisPessoas.reduce((acc, curr) => ({
      receitas: acc.receitas + curr.totalReceita,
      despesas: acc.despesas + curr.totalDespesa,
      saldo: acc.saldo + curr.saldo
    }), { receitas: 0, despesas: 0, saldo: 0 });
  }, [totaisPessoas]);

  // UI Helpers
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const tabs = [
    { id: 'pessoas', label: 'Pessoas', icon: Users },
    { id: 'categorias', label: 'Categorias', icon: Tags },
    { id: 'transacoes', label: 'Transações', icon: Receipt },
    { id: 'totais', label: 'Painel de Totais', icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 shadow-sm flex-shrink-0 z-10 relative">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl">
            <Wallet size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">FinançasApp</h1>
        </div>
        <nav className="p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            {/* --- ABA: PESSOAS --- */}
            {activeTab === 'pessoas' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Cadastro de Pessoas</h2>
                    <p className="text-slate-500">Gerencie as pessoas do sistema.</p>
                  </div>
                  <button 
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus size={18} /> Nova Pessoa
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                        <th className="p-4">Nome</th>
                        <th className="p-4">Idade</th>
                        <th className="p-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pessoas.map((p) => (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-medium text-slate-800">{p.nome}</td>
                          <td className="p-4 text-slate-600">{p.idade} anos</td>
                          <td className="p-4 flex justify-end gap-2">
                            <button onClick={() => { setEditingItem(p); setIsModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => handleDeletePessoa(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {pessoas.length === 0 && (
                        <tr><td colSpan={3} className="p-8 text-center text-slate-500">Nenhuma pessoa cadastrada.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Editar Pessoa' : 'Nova Pessoa'}>
                  <form onSubmit={handleSavePessoa}>
                    <Input label="Nome Completo" name="nome" required maxLength={200} defaultValue={editingItem?.nome} placeholder="Ex: João da Silva" />
                    <Input label="Idade" name="idade" type="number" required min={0} max={150} defaultValue={editingItem?.idade} placeholder="Ex: 25" />
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">Salvar</button>
                    </div>
                  </form>
                </Modal>
              </div>
            )}

            {/* --- ABA: CATEGORIAS --- */}
            {activeTab === 'categorias' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Categorias</h2>
                    <p className="text-slate-500">Defina categorias para receitas e despesas.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus size={18} /> Nova Categoria
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                        <th className="p-4">Descrição</th>
                        <th className="p-4">Finalidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.map((c) => (
                        <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-medium text-slate-800">{c.descricao}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                              c.finalidade === 'receita' ? 'bg-emerald-100 text-emerald-700' :
                              c.finalidade === 'despesa' ? 'bg-rose-100 text-rose-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {c.finalidade}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {categorias.length === 0 && (
                        <tr><td colSpan={2} className="p-8 text-center text-slate-500">Nenhuma categoria cadastrada.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Categoria">
                  <form onSubmit={handleSaveCategoria}>
                    <Input label="Descrição" name="descricao" required maxLength={400} placeholder="Ex: Alimentação" />
                    <Select label="Finalidade" name="finalidade" required options={[
                      { value: 'despesa', label: 'Apenas Despesa' },
                      { value: 'receita', label: 'Apenas Receita' },
                      { value: 'ambas', label: 'Ambas' }
                    ]} />
                    <div className="mt-6 flex justify-end gap-3">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">Salvar</button>
                    </div>
                  </form>
                </Modal>
              </div>
            )}

            {/* --- ABA: TRANSAÇÕES --- */}
            {activeTab === 'transacoes' && (
              <TransacoesView 
                transacoes={transacoes} 
                pessoas={pessoas} 
                categorias={categorias}
                onSave={handleSaveTransacao}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                formatMoney={formatMoney}
              />
            )}

            {/* --- ABA: TOTAIS (DASHBOARD) --- */}
            {activeTab === 'totais' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Painel de Totais</h2>
                  <p className="text-slate-500">Resumo financeiro geral e por pessoa.</p>
                </div>

                {/* Cards Gerais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><TrendingUp size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Receitas</p>
                        <h3 className="text-2xl font-bold text-emerald-600">{formatMoney(totaisGerais.receitas)}</h3>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-rose-100 p-3 rounded-xl text-rose-600"><TrendingDown size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Despesas</p>
                        <h3 className="text-2xl font-bold text-rose-600">{formatMoney(totaisGerais.despesas)}</h3>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600 opacity-5"></div>
                    <div className="flex items-center gap-4 mb-4 relative">
                      <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Wallet size={24} /></div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Saldo Geral</p>
                        <h3 className={`text-2xl font-bold ${totaisGerais.saldo >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                          {formatMoney(totaisGerais.saldo)}
                        </h3>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Tabela de Pessoas */}
                <h3 className="text-lg font-bold text-slate-800 mb-4">Detalhamento por Pessoa</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                        <th className="p-4">Pessoa</th>
                        <th className="p-4 text-right">Receitas</th>
                        <th className="p-4 text-right">Despesas</th>
                        <th className="p-4 text-right">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totaisPessoas.map((p) => (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-medium text-slate-800">
                            {p.nome} <span className="text-xs text-slate-400 font-normal ml-2">({p.idade} anos)</span>
                          </td>
                          <td className="p-4 text-right text-emerald-600">{formatMoney(p.totalReceita)}</td>
                          <td className="p-4 text-right text-rose-600">{formatMoney(p.totalDespesa)}</td>
                          <td className={`p-4 text-right font-bold ${p.saldo >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                            {formatMoney(p.saldo)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold">
                        <td className="p-4 text-slate-800">TOTAL GERAL</td>
                        <td className="p-4 text-right text-emerald-600">{formatMoney(totaisGerais.receitas)}</td>
                        <td className="p-4 text-right text-rose-600">{formatMoney(totaisGerais.despesas)}</td>
                        <td className={`p-4 text-right ${totaisGerais.saldo >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                          {formatMoney(totaisGerais.saldo)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Subcomponente para organizar a lógica complexa de Transações e validações de form
function TransacoesView({ transacoes, pessoas, categorias, onSave, isModalOpen, setIsModalOpen, formatMoney }: any) {
  const [selectedPessoaId, setSelectedPessoaId] = useState('');
  const [selectedTipo, setSelectedTipo] = useState<'despesa'|'receita'|''>('');

  const selectedPessoa = pessoas.find((p: any) => p.id === selectedPessoaId);
  const isMinor = selectedPessoa ? selectedPessoa.idade < 18 : false;

  // Efeito para forçar o tipo 'despesa' se for menor de idade
  useEffect(() => {
    if (isMinor) {
      setSelectedTipo('despesa');
    }
  }, [isMinor, selectedPessoaId]);

  // Filtro de categorias baseado no tipo selecionado
  const categoriasFiltradas = categorias.filter((c: any) => {
    if (!selectedTipo) return true;
    return c.finalidade === 'ambas' || c.finalidade === selectedTipo;
  });

  const getPessoaName = (id: string) => pessoas.find((p: any) => p.id === id)?.nome || 'Desconhecido';
  const getCatName = (id: string) => categorias.find((c: any) => c.id === id)?.descricao || 'Desconhecida';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Transações</h2>
          <p className="text-slate-500">Registre entradas e saídas.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedPessoaId('');
            setSelectedTipo('');
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} /> Nova Lançamento
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
              <th className="p-4">Pessoa</th>
              <th className="p-4">Descrição</th>
              <th className="p-4">Categoria</th>
              <th className="p-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t: any) => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-600">{getPessoaName(t.pessoaId)}</td>
                <td className="p-4 font-medium text-slate-800">{t.descricao}</td>
                <td className="p-4 text-slate-500 text-sm">{getCatName(t.categoriaId)}</td>
                <td className={`p-4 text-right font-medium ${t.tipo === 'receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.tipo === 'receita' ? '+' : '-'}{formatMoney(t.valor)}
                </td>
              </tr>
            ))}
            {transacoes.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhuma transação registrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Transação">
        <form onSubmit={onSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pessoa</label>
            <select 
              name="pessoaId" required 
              value={selectedPessoaId} 
              onChange={(e) => setSelectedPessoaId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Selecione a pessoa...</option>
              {pessoas.map((p: any) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Lançamento</label>
            <select 
              name="tipo" required 
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value as any)}
              disabled={isMinor || !selectedPessoaId}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:text-gray-500 outline-none"
            >
              <option value="">Selecione o tipo...</option>
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
            {isMinor && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12}/> Menores de 18 anos só podem registrar despesas.
              </p>
            )}
          </div>

          <Input label="Descrição" name="descricao" required maxLength={400} placeholder="Ex: Conta de Luz" />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
              name="categoriaId" required 
              disabled={!selectedTipo}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 outline-none"
            >
              <option value="">Selecione a categoria...</option>
              {categoriasFiltradas.map((c: any) => <option key={c.id} value={c.id}>{c.descricao}</option>)}
            </select>
            {!selectedTipo && selectedPessoaId && <p className="text-xs text-slate-500 mt-1">Selecione o tipo primeiro.</p>}
          </div>

          <Input label="Valor (R$)" name="valor" type="number" step="0.01" min="0.01" required placeholder="0,00" />

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}