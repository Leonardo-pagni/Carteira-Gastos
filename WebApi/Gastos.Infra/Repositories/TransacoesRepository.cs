using Gastos.Domain.Entitys;
using Gastos.Domain.Entitys.Repositories;
using Gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace Gastos.Infra.Repositories
{
    internal class TransacoesRepository(AppDbContext _context) : ITransacoesRepository
    {
        public async Task<Guid> Create(TransacoesEntity transacao, CancellationToken ct)
        {
            await _context.Transacoes.AddAsync(transacao, ct);
            _context.SaveChangesAsync(ct);

            return transacao.Id;
        }


        public async Task<ICollection<TransacoesEntity>> get(CancellationToken ct)
        {
            return await _context.Transacoes
                                 .Include(x => x.Pessoa)
                                 .Include(x => x.Categoria)
                                 .AsNoTracking()
                                 .ToListAsync(ct);
        }
    }
}
