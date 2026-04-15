export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
  totalValorDespesa: number;
  totalValorReceita: number;
  saldo: number;
}

export interface Categoria {
  id: string;
  descricao: string;
  finalidade: string; // "Despesa", "Receita", "Ambas"
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: string;
  categoria: string;
  pessoa: string;
}

export interface PaginatedResponse<T> {
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