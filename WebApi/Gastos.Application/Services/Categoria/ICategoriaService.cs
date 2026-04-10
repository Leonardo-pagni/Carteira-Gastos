using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;

namespace Gastos.Application.Services.Categoria
{
    public interface ICategoriaService
    {
        Task<CommandResult<PagedResult<CategoriaResponseDTO>>> Get(int page, int pageSize, CancellationToken ct);
        Task<CommandResult<Guid?>> Create(CategoriaRequestDTO request, CancellationToken ct);
    }
}
