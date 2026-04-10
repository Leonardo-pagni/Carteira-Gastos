namespace Gastos.Domain.Entitys.Repositories
{
    public interface IPessoaRepository
    {
        Task<ICollection<PessoaEntity>> Get(CancellationToken ct);
        Task<Guid> Create(PessoaEntity pessoa, CancellationToken ct);
        Task<PessoaEntity> GetById(Guid id, CancellationToken ct);
        Task DeleteById(Guid id, CancellationToken ct);
        Task SaveChangesAsync(CancellationToken ct);
    }
}
