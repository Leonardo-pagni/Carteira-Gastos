using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;

namespace Gastos.Application.Services.Pessoa
{
    public interface IPessoaService
    {
        Task <ICommandResult<PagedResult<PessoaResponseDTO>>> Get(int Page,int PageSize, CancellationToken ct);
        Task<ICommandResult<Guid?>> Create(PessoaRequestDTO dto, CancellationToken ct);
        Task<ICommandResult> Update(Guid id, PessoaRequestDTO dto, CancellationToken ct);
        Task<ICommandResult> Delete(Guid id, CancellationToken ct);
    }
}
