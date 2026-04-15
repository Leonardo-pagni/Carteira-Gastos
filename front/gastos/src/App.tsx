import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { PessoasView } from './views/PessoasView';
import { CategoriasView } from './views/CategoriasView';
import { TransacoesView } from './views/TransacoesView';

type TabType = 'pessoas' | 'categorias' | 'transacoes';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pessoas');
  const [toastConfig, setToastConfig] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const showToast = (msg: string, type: 'success'|'error') => setToastConfig({ msg, type });

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'pessoas' && <PessoasView showToast={showToast} />}
            {activeTab === 'categorias' && <CategoriasView showToast={showToast} />}
            {activeTab === 'transacoes' && <TransacoesView showToast={showToast} />}
          </div>
        </div>
      </main>

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