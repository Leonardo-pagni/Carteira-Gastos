using Gastos.Domain.Entitys;
using Gastos.Domain.Enums;

namespace DomainTest
{
    public class PessoaTest
    {
        [Fact]
        public void Deve_Criar_Pessoa_Com_Dados_Validos()
        {
            // Arrange
            var nome = "João";
            var idade = 30;

            // Act
            var pessoa = new PessoaEntity(nome, idade);

            // Assert
            Assert.NotEqual(Guid.Empty, pessoa.Id);
            Assert.Equal(nome, pessoa.Nome);
            Assert.Equal(idade, pessoa.Idade);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Nome_For_Nulo()
        {
            // Arrange
            string nome = null;
            var idade = 25;

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() =>
                new PessoaEntity(nome, idade));

            Assert.Equal("O nome não pode ser vazio", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Nome_For_Vazio()
        {
            // Arrange
            var nome = "";
            var idade = 25;

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() =>
                new PessoaEntity(nome, idade));

            Assert.Equal("O nome não pode ser vazio", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Nome_For_Maior_Que_200()
        {
            // Arrange
            var nome = new string('a', 201);
            var idade = 25;

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() =>
                new PessoaEntity(nome, idade));

            Assert.Equal("O nome não pode ter mais de 200 caracteres.", exception.Message);
        }

        [Fact]
        public void Deve_Atualizar_Nome_Valido()
        {
            // Arrange
            var pessoa = new PessoaEntity("João", 30);
            var novoNome = "Maria";

            // Act
            pessoa.AtualizarNome(novoNome);

            // Assert
            Assert.Equal(novoNome, pessoa.Nome);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Ao_Atualizar_Nome_Nullo()
        {
            // Arrange
            var pessoa = new PessoaEntity("João", 30);

            // Act & Assert
            Assert.Throws<ArgumentException>(() =>
                pessoa.AtualizarNome(string.Empty));
        }

        [Fact]
        public void Deve_Atualizar_Idade()
        {
            // Arrange
            var pessoa = new PessoaEntity("João", 30);
            var novaIdade = 40;

            // Act
            pessoa.AtualizarIdade(novaIdade);

            // Assert
            Assert.Equal(novaIdade, pessoa.Idade);
        }

        [Fact]
        public void Deve_Calcular_Total_Receita_Corretamente()
        {
            var pessoa = new PessoaEntity("João", 30);


            pessoa.Transacoes.Add(new TransacoesEntity("Salário", 1000, ETipo.Receita, Guid.NewGuid(), pessoa.Id, EFinalidade.Receita, 30));
            pessoa.Transacoes.Add(new TransacoesEntity("Freela", 500, ETipo.Receita, Guid.NewGuid(), pessoa.Id, EFinalidade.Ambas, 30));

            var total = pessoa.TotalReceita;

            Assert.Equal(1500, total);

        }

        [Fact]
        public void Deve_Calcular_Total_Despesa_Corretamente()
        {
            var pessoa = new PessoaEntity("João", 30);

            pessoa.Transacoes.Add(new TransacoesEntity("Aluguel", 800, ETipo.Despesa, Guid.NewGuid(), pessoa.Id, EFinalidade.Despesas, 30));
            pessoa.Transacoes.Add(new TransacoesEntity("Mercado", 200, ETipo.Despesa, Guid.NewGuid(), pessoa.Id, EFinalidade.Ambas, 30));

            var total = pessoa.TotalDespesa;

            Assert.Equal(1000, total);

        }

        [Fact]
        public void Deve_Calcular_Saldo_Corretamente()
        {
            var pessoa = new PessoaEntity("João", 30);

            pessoa.Transacoes.Add(new TransacoesEntity("Salário", 2000, ETipo.Receita, Guid.NewGuid(), pessoa.Id, EFinalidade.Receita, 30));
            pessoa.Transacoes.Add(new TransacoesEntity("Aluguel", 1000, ETipo.Despesa, Guid.NewGuid(), pessoa.Id, EFinalidade.Despesas, 30));

            var saldo = pessoa.Saldo;

            Assert.Equal(1000, saldo);


        }

    }
}