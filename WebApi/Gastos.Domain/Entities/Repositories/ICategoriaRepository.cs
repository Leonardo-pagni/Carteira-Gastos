namespace Gastos.Domain.Entities.Repositories
{
    public interface ICategoriaRepository
    {
        Task<(ICollection<Categoria> categorias, int total)> Get(int page, int pageSize, CancellationToken ct);
        Task<Categoria> GetById(Guid Id,CancellationToken ct);
        Task<Guid> Create(Categoria categoria, CancellationToken ct);
    }
}
