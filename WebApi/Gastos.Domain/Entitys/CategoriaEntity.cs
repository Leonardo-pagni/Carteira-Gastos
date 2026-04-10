using Gastos.Domain.Enums;

namespace Gastos.Domain.Entitys
{
    public class CategoriaEntity
    {
        public CategoriaEntity() { }

        public CategoriaEntity(string descricao, EFinalidade finalidade)
        {
            ValidarDescricao(descricao);

            Id = Guid.NewGuid();
            Descricao = descricao;
            Finalidade = (int)finalidade;
        }

        public Guid Id { get; private set; }
        public string Descricao { get; private set; }
        public int Finalidade { get; private set; }

        private void ValidarDescricao(string descricao)
        {
            if(string.IsNullOrEmpty(descricao))
                throw new ArgumentException("A descrição não pode ser vazia.");
            if (descricao.Length > 400)
                throw new ArgumentException("A descrição não pode ter mais de 400 caracteres.");
        }

    }
}
