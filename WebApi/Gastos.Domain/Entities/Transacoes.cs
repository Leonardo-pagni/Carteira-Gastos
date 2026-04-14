using Gastos.Domain.Enums;

namespace Gastos.Domain.Entities
{
    public class Transacoes
    {
        public Transacoes() { }

        public Transacoes(string descricao, decimal valor, ETipo tipo, Guid categoriaID, Guid pessoaId, EFinalidade finalidadeCategoria, int idadePessoa)
        {
            ValidarDescricao(descricao);
            ValidarValor(valor);
            ValidarFinalidadeTipoCategoria(tipo, finalidadeCategoria);
            ValidarIdade(idadePessoa, tipo);

            Id = Guid.NewGuid();
            Descricao = descricao;
            Valor = valor;
            Tipo = (int)tipo;
            CategoriaId = categoriaID;
            PessoaId = pessoaId;
        }

        public Guid Id { get; private set; }
        public string Descricao { get; private set; }
        public decimal Valor { get; private set; }
        public int Tipo { get; private set; }
        public Guid CategoriaId { get; private set; }
        public Guid PessoaId { get; private set; }
        public virtual Categoria Categoria { get; private set; }
        public virtual Pessoa Pessoa { get; private set; }

        private void ValidarDescricao(string descricao)
        {
            if (string.IsNullOrEmpty(descricao))
                throw new ArgumentException("A descrição não pode ser vazia.");
            if (descricao.Length > 400)
                throw new ArgumentException("A descrição não pode ter mais de 400 caracteres.");
        }

        public void ValidarValor(decimal valor)
        {
            if (valor <= 0)
                throw new ArgumentException("O valor deve ser maior que zero.");
        }
        private void ValidarFinalidadeTipoCategoria(ETipo tipo, EFinalidade finalidade)
        {
            if(tipo == ETipo.Despesa && finalidade == EFinalidade.Receita)
                throw new ArgumentException("Transação do tipo despesa, não pode ter uma categoria da finalidade receita.");

            if(tipo == ETipo.Receita && finalidade == EFinalidade.Despesas)
                throw new ArgumentException("Transação do tipo Receita, não pode ter uma categoria da finalidade Despesa.");
        }

        private void ValidarIdade(int idade, ETipo tipo)
        {
            if (tipo != ETipo.Despesa && idade < 18)
                throw new ArgumentException("Apenas Transação do tipo despesa podem ser realizada por menores de 18 anos.");
        }
    }
}
