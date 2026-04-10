using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;

namespace Gastos.Application.Services.Pessoa
{
    public interface IPessoaService
    {
        Task <CommandResult<PagedResult<PessoaResponseDTO>>> Get(int Page,int PageSize, CancellationToken ct);
        Task<CommandResult<Guid?>> Create(PessoaRequestDTO dto, CancellationToken ct);
        Task<CommandResult> Update(Guid id, PessoaRequestDTO dto, CancellationToken ct);
        Task<CommandResult> Delete(Guid id, CancellationToken ct);
    }
}
