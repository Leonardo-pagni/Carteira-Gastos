using Gastos.Domain.Entitys;
using Gastos.Domain.Enums;
using Gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gastos.Infra.Seeds
{
    public static class DbSeeds
    {
        public static async Task Seed(AppDbContext _context)
        {
            var categoria1 = new CategoriaEntity("Contas", EFinalidade.Despesas);
            var categoria2 = new CategoriaEntity("Salario", EFinalidade.Receita);
            var categoria3 = new CategoriaEntity("Ajuste", EFinalidade.Ambas);

            var pessoa1 = new PessoaEntity("Leonardo", 18);
            var pessoa2 = new PessoaEntity("Jose", 40);
            var pessoa3 = new PessoaEntity("Clara", 12);

            var transacao1 = new TransacoesEntity("Salario Janeiro", 1000, ETipo.Receita, categoria2.Id, pessoa1.Id, (EFinalidade)categoria2.Finalidade, pessoa1.Idade);
            var transacao2 = new TransacoesEntity("Salario fevereiro", 2000, ETipo.Receita, categoria2.Id, pessoa1.Id, (EFinalidade)categoria2.Finalidade, pessoa1.Idade);
            var transacao3 = new TransacoesEntity("Conta Luz", 300, ETipo.Despesa, categoria1.Id, pessoa1.Id, (EFinalidade)categoria1.Finalidade, pessoa1.Idade);

            var transacao4 = new TransacoesEntity("Salario Janeiro", 1500, ETipo.Receita, categoria2.Id, pessoa2.Id, (EFinalidade)categoria2.Finalidade, pessoa2.Idade);
            var transacao5 = new TransacoesEntity("Salario fevereiro", 2500, ETipo.Receita, categoria2.Id, pessoa2.Id, (EFinalidade)categoria2.Finalidade, pessoa2.Idade);
            var transacao6 = new TransacoesEntity("Conta Luz", 750, ETipo.Despesa, categoria1.Id, pessoa2.Id, (EFinalidade)categoria1.Finalidade, pessoa2.Idade);

            var transacao7 = new TransacoesEntity("Salario Janeiro", 780, ETipo.Despesa, categoria1.Id, pessoa3.Id, (EFinalidade)categoria1.Finalidade, pessoa3.Idade);
            var transacao8 = new TransacoesEntity("Salario fevereiro", 1500, ETipo.Despesa, categoria1.Id, pessoa3.Id, (EFinalidade)categoria1.Finalidade, pessoa3.Idade);


            if (!_context.Categoria.Any())
            {
                _context.Categoria.AddRange(new List<CategoriaEntity>
                {
                    categoria1,categoria2,categoria3
                });
            }

            if (!_context.Pessoa.Any())
            {
                _context.Pessoa.AddRange(new List<PessoaEntity>
                {
                    pessoa1,pessoa2,pessoa3
                });
            }

            if (!_context.Transacoes.Any())
            {
                _context.Transacoes.AddRange(new List<TransacoesEntity>
                {
                    transacao1, transacao2, transacao3, transacao4, transacao5, transacao6, transacao7, transacao8
                });
            }
            await _context.SaveChangesAsync();
        }
    }
}
