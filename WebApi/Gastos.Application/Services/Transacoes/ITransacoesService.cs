using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;

namespace Gastos.Application.Services.Transacoes
{
    public interface ITransacoesService
    {
        Task<CommandResult<PagedResult<TransacoesResponseDTO>>> Get(int page, int pageSize, CancellationToken ct);
        Task<CommandResult<Guid?>> Create(TransacoesRequestDTO request, CancellationToken ct);
    }
}
