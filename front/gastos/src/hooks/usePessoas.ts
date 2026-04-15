import { useEffect, useState } from 'react';
import type { Pessoa } from '../types';
import * as service from '../services/pessoaService';

export const usePessoas = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await service.getPessoas();
    setPessoas(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { pessoas, loading, fetch };
};