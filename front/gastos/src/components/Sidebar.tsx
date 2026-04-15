import React from 'react';
import { Users, Tags, ArrowRightLeft, LayoutDashboard, ChevronRight } from 'lucide-react';

type TabType = 'pessoas' | 'categorias' | 'transacoes';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* Desktop Sidebar */}
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

      {/* Mobile Header */}
      <header className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center overflow-x-auto space-x-2">
        <button onClick={() => setActiveTab('pessoas')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'pessoas' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Pessoas</button>
        <button onClick={() => setActiveTab('categorias')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'categorias' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Categorias</button>
        <button onClick={() => setActiveTab('transacoes')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === 'transacoes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Transações</button>
      </header>
    </>
  );
};