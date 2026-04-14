using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;

namespace Gastos.Application.Services.Categoria
{
    public interface ICategoriaService
    {
        Task<ICommandResult<PagedResult<CategoriaResponseDTO>>> Get(int page, int pageSize, CancellationToken ct);
        Task<ICommandResult<Guid?>> Create(CategoriaRequestDTO request, CancellationToken ct);
    }
}
