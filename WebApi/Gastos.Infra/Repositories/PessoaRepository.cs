using Gastos.Domain.Entities;
using Gastos.Domain.Entities.Repositories;
using Gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace Gastos.Infra.Repositories
{
    public class PessoaRepository(AppDbContext _context) : IPessoaRepository
    {
        public async Task Create(Pessoa pessoa, CancellationToken ct)
        {
            await _context.Pessoa.AddAsync(pessoa, ct);

            await _context.SaveChangesAsync(ct);
        }

        public async Task DeleteById(Pessoa pessoa, CancellationToken ct)
        {
            _context.Pessoa.Remove(pessoa);

            await _context.SaveChangesAsync(ct);
        }

        public async Task<(ICollection<Pessoa> pessoas, int total)> Get(int page, int pageSize, CancellationToken ct)
        {
            var pessoas = await _context.Pessoa
                                 .Include(x => x.Transacoes)
                                 .AsNoTracking()
                                 .Skip((page - 1) * pageSize)
                                 .Take(pageSize)
                                 .ToListAsync(ct);

            var total = await _context.Pessoa.CountAsync(ct);

            return (pessoas, total);
        }

        public async Task<Pessoa> GetById(Guid id, CancellationToken ct)
        {
            return await _context.Pessoa
                                 .Include(x => x.Transacoes)
                                 .FirstOrDefaultAsync(x => x.Id == id, ct);
        }

        public async Task Updated(CancellationToken ct)
        {
            await _context.SaveChangesAsync(ct);
        }
    }
}
