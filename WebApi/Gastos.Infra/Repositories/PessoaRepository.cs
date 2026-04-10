using Gastos.Domain.Entitys;
using Gastos.Domain.Entitys.Repositories;
using Gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace Gastos.Infra.Repositories
{
    public class PessoaRepository(AppDbContext _context) : IPessoaRepository
    {
        public async Task<Guid> Create(PessoaEntity pessoa, CancellationToken ct)
        {
            await _context.Pessoa.AddAsync(pessoa, ct);

            await _context.SaveChangesAsync(ct);

            return pessoa.Id;
        }

        public async Task DeleteById(Guid id, CancellationToken ct)
        {
            await _context.Pessoa.Where(x => x.Id == id).ExecuteDeleteAsync(ct);
        }

        public async Task<ICollection<PessoaEntity>> Get(CancellationToken ct)
        {
            return await _context.Pessoa
                                 .Include(x => x.Transacoes)
                                 .AsNoTracking()
                                 .ToListAsync(ct);
        }

        public async Task<PessoaEntity> GetById(Guid id, CancellationToken ct)
        {
            return await _context.Pessoa
                                 .Include(x => x.Transacoes)
                                 .FirstOrDefaultAsync(x => x.Id == id, ct);
        }
    }
}
