using Gastos.Domain.Enums;

namespace Gastos.Domain.Entitys
{
    public class PessoaEntity
    {
        public PessoaEntity(string nome, int idade)
        {
            ValidarNome(nome);

            Id = Guid.NewGuid();
            Nome = nome;
            Idade = idade;
        }

        protected PessoaEntity() { }

        public Guid Id { get; private set; }
        public string Nome { get; private set; }
        public int Idade { get; private set; }
        public ICollection<TransacoesEntity> Transacoes { get; private set; } = new List<TransacoesEntity>();
        public decimal TotalReceita => Transacoes.Where(x => x.Tipo == (int)ETipo.Receita).Sum(x => x.Valor);
        public decimal TotalDespesa => Transacoes.Where(x => x.Tipo == (int)ETipo.Despesa).Sum(x => x.Valor);
        public decimal Saldo => TotalReceita - TotalDespesa;


        private void ValidarNome(string nome)
        {
            if (string.IsNullOrEmpty(nome))
                throw new ArgumentException("O nome não pode ser vazio");
            if (nome.Length > 200)
                throw new ArgumentException("O nome não pode ter mais de 200 caracteres.");
        }
        public void AtualizarNome(string nome)
        {
            ValidarNome(nome);
            Nome = nome;
        }

         public void AtualizarIdade(int idade)
        {
            Idade = idade;
        }
    }
}
