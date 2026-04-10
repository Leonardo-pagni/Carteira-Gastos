namespace Gastos.Domain.Entitys.Repositories
{
    public interface ICategoriaRepository
    {
        Task<ICollection<CategoriaEntity>> Get(CancellationToken ct);
        Task<CategoriaEntity> GetById(Guid Id,CancellationToken ct);
        Task<Guid> Create(CategoriaEntity categoria, CancellationToken ct);
    }
}
