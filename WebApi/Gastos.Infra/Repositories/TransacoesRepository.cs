using Gastos.Domain.Entities;
using Gastos.Domain.Entities.Repositories;
using Gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace Gastos.Infra.Repositories
{
    internal class TransacoesRepository(AppDbContext _context) : ITransacoesRepository
    {
        public async Task Create(Transacoes transacao, CancellationToken ct)
        {
            await _context.Transacoes.AddAsync(transacao, ct);

            _context.SaveChangesAsync(ct);            
        }


        public async Task<(ICollection<Transacoes> transacoes, int total)> get(int page, int pagesize, CancellationToken ct)
        {
            var transacoes = await _context.Transacoes
                                 .Include(x => x.Pessoa)
                                 .Include(x => x.Categoria)
                                 .AsNoTracking()
                                 .Skip((page - 1) * pagesize)
                                 .Take(pagesize)
                                 .ToListAsync(ct);

            var total = await _context.Transacoes.CountAsync(ct);

            return (transacoes, total);
        }
    }
}
