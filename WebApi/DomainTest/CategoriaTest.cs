using Gastos.Domain.Entities;
using Gastos.Domain.Enums;

namespace DomainTest
{
    public class CategoriaTest
    {
        [Fact]
        public void Deve_Criar_Categoria_Valida()
        {
            // Arrange
            var descricao = "Alimentação";
            var finalidade = EFinalidade.Despesas;

            // Act
            var categoria = new Categoria(descricao, finalidade);

            // Assert
            Assert.NotEqual(Guid.Empty, categoria.Id);
            Assert.Equal(descricao, categoria.Descricao);
            Assert.Equal((int)finalidade, categoria.Finalidade);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Descricao_For_Nula()
        {
            // Arrange
            string descricao = null;

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() =>
                new Categoria(descricao, EFinalidade.Despesas));

            Assert.Equal("A descrição não pode ser vazia.", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Descricao_For_Vazia()
        {
            // Arrange
            var descricao = "";

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() =>
                new Categoria(descricao, EFinalidade.Despesas));

            Assert.Equal("A descrição não pode ser vazia.", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Descricao_For_Maior_Que_400()
        {
            // Arrange
            var descricao = new string('a', 401);

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() =>
                new Categoria(descricao, EFinalidade.Despesas));

            Assert.Equal("A descrição não pode ter mais de 400 caracteres.", exception.Message);
        }

        [Fact]
        public void Deve_Atribuir_Corretamente_Finalidade()
        {
            // Arrange
            var finalidade = EFinalidade.Receita;

            // Act
            var categoria = new Categoria("Salário", finalidade);

            // Assert
            Assert.Equal((int)finalidade, categoria.Finalidade);
        }
    }

}
