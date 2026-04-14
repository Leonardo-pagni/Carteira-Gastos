using Gastos.Domain.Entities;
using Gastos.Domain.Entities.Repositories;
using Gastos.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace Gastos.Infra.Repositories
{
    public class CategoriaRepository(AppDbContext _context) : ICategoriaRepository
    {
        public async Task<Guid> Create(Categoria categoria, CancellationToken ct)
        {
            await _context.Categoria.AddAsync(categoria, ct);

            await _context.SaveChangesAsync(ct);

            return categoria.Id;
        }

        public async Task<(ICollection<Categoria> categorias, int total)> Get(int page, int pageSize, CancellationToken ct)
        {
            var categorias = await _context.Categoria
                                 .AsNoTracking()
                                 .Skip((page - 1) * pageSize)
                                 .Take(pageSize)
                                 .ToListAsync(ct);

            var total = await _context.Categoria.CountAsync(ct);

            return (categorias, total);
        }

        public async Task<Categoria> GetById(Guid Id, CancellationToken ct)
        {
            return await _context.Categoria
                                 .FirstOrDefaultAsync(x => x.Id == Id, ct);
        }
    }
}
