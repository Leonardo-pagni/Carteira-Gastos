import { useEffect, useState } from 'react';
import type { Categoria } from '../types';
import * as service from '../services/categoriaService';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await service.getCategorias();
    setCategorias(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { categorias, loading, fetch };
};