using Gastos.Domain.Entities;
using Gastos.Domain.Enums;
using Gastos.Infra.Context;
using Microsoft.IdentityModel.Tokens;

namespace Gastos.Infra.Seeds
{
    public static class DbSeeds
    {
        public static async Task Seed(AppDbContext _context)
        {
            bool inserted = false;       

            if (!_context.Categoria.Any())
            {
                var categorias = new List<Categoria>
                {
                    new Categoria("Contas", EFinalidade.Despesas),
                    new Categoria("Salario", EFinalidade.Receita),
                    new Categoria("Ajuste", EFinalidade.Ambas)
                };

                _context.Categoria.AddRange(categorias);

                inserted = true;
            }

            if (!_context.Pessoa.Any())
            {
                var pessoas = new List<Pessoa>
                { 
                    new Pessoa("Leonardo", 18),
                    new Pessoa("Jose", 40),
                    new Pessoa("Clara", 12)
                };
                _context.Pessoa.AddRange(pessoas);

                inserted = true;
            }

            if(inserted)
                await _context.SaveChangesAsync();
        }
    }
}
