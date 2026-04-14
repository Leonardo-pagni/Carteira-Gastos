namespace Gastos.Domain.Entities.Repositories
{
    public interface IPessoaRepository
    {
        Task<(ICollection<Pessoa> pessoas, int total)> Get(int page, int pageSize, CancellationToken ct);
        Task Create(Pessoa pessoa, CancellationToken ct);
        Task<Pessoa> GetById(Guid id, CancellationToken ct);
        Task DeleteById(Pessoa pessoa, CancellationToken ct);
        Task Updated(CancellationToken ct);
    }
}
