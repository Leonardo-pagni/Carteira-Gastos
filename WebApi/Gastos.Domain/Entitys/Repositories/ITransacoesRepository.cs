namespace Gastos.Domain.Entitys.Repositories
{
    public interface ITransacoesRepository 
    {
        Task<ICollection<TransacoesEntity>> get(CancellationToken ct);

        Task<Guid> Create(TransacoesEntity transacao, CancellationToken ct);
    }
}
