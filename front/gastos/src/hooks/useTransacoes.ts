import { useEffect, useState } from 'react';
import type { Transacao } from '../types';
import * as service from '../services/transacaoService';

export const useTransacoes = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await service.getTransacoes();
    setTransacoes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { transacoes, loading, fetch };
};