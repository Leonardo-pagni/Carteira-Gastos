using Gastos.Domain.Entitys;
using Gastos.Domain.Entitys.Repositories;
using Gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace Gastos.Infra.Repositories
{
    public class CategoriaRepository(AppDbContext _context) : ICategoriaRepository
    {
        public async Task<Guid> Create(CategoriaEntity categoria, CancellationToken ct)
        {
            await _context.Categoria.AddAsync(categoria, ct);

            await _context.SaveChangesAsync(ct);

            return categoria.Id;
        }

        public async Task<ICollection<CategoriaEntity>> Get(CancellationToken ct)
        {
            return await _context.Categoria
                                 .AsNoTracking()
                                 .ToListAsync(ct);
        }

        public async Task<CategoriaEntity> GetById(Guid Id, CancellationToken ct)
        {
            return await _context.Categoria
                                 .FirstOrDefaultAsync(x => x.Id == Id, ct);
        }
    }
}
