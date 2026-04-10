using System;
using Xunit;
using Gastos.Domain.Entitys;
using Gastos.Domain.Enums;

namespace DomainTest
{
    public class TransacoesTest
    {
        [Fact]
        public void Deve_Criar_Transacao_Valida_Para_Maior_De_Idade()
        {
            var transacao = new TransacoesEntity(
            "Salário",
            1000,
            ETipo.Receita,
            Guid.NewGuid(),
            Guid.NewGuid(),
            EFinalidade.Receita,
            25
            );

        Assert.NotEqual(Guid.Empty, transacao.Id);
            Assert.Equal("Salário", transacao.Descricao);
            Assert.Equal(1000, transacao.Valor);
            Assert.Equal((int)ETipo.Receita, transacao.Tipo);
        }

        [Fact]
        public void Deve_Criar_Transacao_Despesa_Para_Menor_De_Idade()
        {
            var transacao = new TransacoesEntity(
                "Lanche",
                50,
                ETipo.Despesa,
                Guid.NewGuid(),
                Guid.NewGuid(),
                EFinalidade.Despesas,
                16
            );

            Assert.NotNull(transacao);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Menor_Tentar_Criar_Receita()
        {
            var exception = Assert.Throws<ArgumentException>(() =>
                new TransacoesEntity(
                    "Salário",
                    100,
                    ETipo.Receita,
                    Guid.NewGuid(),
                    Guid.NewGuid(),
                    EFinalidade.Receita,
                    16
                ));

            Assert.Equal("Apenas Transação do tipo despesa podem ser realizada por menores de 18 anos.", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Descricao_For_Vazia()
        {
            var exception = Assert.Throws<ArgumentException>(() =>
                new TransacoesEntity(
                    "",
                    100,
                    ETipo.Receita,
                    Guid.NewGuid(),
                    Guid.NewGuid(),
                    EFinalidade.Receita,
                    20
                ));

            Assert.Equal("A descrição não pode ser vazia.", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Descricao_For_Maior_Que_400()
        {
            var descricao = new string('a', 401);

            var exception = Assert.Throws<ArgumentException>(() =>
                new TransacoesEntity(
                    descricao,
                    100,
                    ETipo.Receita,
                    Guid.NewGuid(),
                    Guid.NewGuid(),
                    EFinalidade.Receita,
                    20
                ));

            Assert.Equal("A descrição não pode ter mais de 400 caracteres.", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Valor_For_Zero()
        {
            var exception = Assert.Throws<ArgumentException>(() =>
                new TransacoesEntity(
                    "Teste",
                    0,
                    ETipo.Despesa,
                    Guid.NewGuid(),
                    Guid.NewGuid(),
                    EFinalidade.Despesas,
                    20
                ));

            Assert.Equal("O valor deve ser maior que zero.", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Valor_For_Negativo()
        {
            var exception = Assert.Throws<ArgumentException>(() =>
                new TransacoesEntity(
                    "Teste",
                    -10,
                    ETipo.Despesa,
                    Guid.NewGuid(),
                    Guid.NewGuid(),
                    EFinalidade.Despesas,
                    20
                ));

            Assert.Equal("O valor deve ser maior que zero.", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Tipo_For_Despesa_E_Categoria_For_Receita()
        {
            var exception = Assert.Throws<ArgumentException>(() =>
                new TransacoesEntity(
                    "Conta",
                    100,
                    ETipo.Despesa,
                    Guid.NewGuid(),
                    Guid.NewGuid(),
                    EFinalidade.Receita,
                    25
                ));

            Assert.Equal("Transação do tipo despesa, não pode ter uma categoria da finalidade receita.", exception.Message);
        }

        [Fact]
        public void Deve_Lancar_Excecao_Quando_Tipo_For_Receita_E_Categoria_For_Despesa()
        {
            var exception = Assert.Throws<ArgumentException>(() =>
                new TransacoesEntity(
                    "Salário",
                    100,
                    ETipo.Receita,
                    Guid.NewGuid(),
                    Guid.NewGuid(),
                    EFinalidade.Despesas,
                    25
                ));

            Assert.Equal("Transação do tipo Receita, não pode ter uma categoria da finalidade Despesa.", exception.Message);
        }

        [Fact]
        public void Deve_Permitir_Finalidade_Ambas()
        {
            var receita = new TransacoesEntity(
                "Salário",
                100,
                ETipo.Receita,
                Guid.NewGuid(),
                Guid.NewGuid(),
                EFinalidade.Ambas,
                25
            );

            var despesa = new TransacoesEntity(
                "Conta",
                100,
                ETipo.Despesa,
                Guid.NewGuid(),
                Guid.NewGuid(),
                EFinalidade.Ambas,
                16
            );

            Assert.NotNull(receita);
            Assert.NotNull(despesa);
        }
    }

}
