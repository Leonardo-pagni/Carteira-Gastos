namespace Gastos.Domain.Entities.Repositories
{
    public interface ITransacoesRepository 
    {
        Task<(ICollection<Transacoes> transacoes, int total)> get(int page, int pageSize, CancellationToken ct);

        Task Create(Transacoes transacao, CancellationToken ct);
    }
}
