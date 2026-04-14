using Gastos.Application.Services.Transacoes.DTOs;
using Gastos.Domain.Entities.Repositories;
using Gastos.Domain.Enums;
using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;
using System.Net;

namespace Gastos.Application.Services.Transacoes
{
    public class TransacoesService(ITransacoesRepository _transacoesRepository, 
                                   ICategoriaRepository _categoriaRepository, 
                                   IPessoaRepository _pessoaRepository) : ITransacoesService
    {
        public async Task<CommandResult<Guid?>> Create(TransacoesRequestDTO request, CancellationToken ct)
        {
            try
            {
                var categoria = await _categoriaRepository.GetById(request.categoriaId, ct);
                var pessoa = await _pessoaRepository.GetById(request.pessoaId, ct);

                if (categoria is null)
                    return new CommandResult<Guid?> { StatusCode = HttpStatusCode.NotFound, Message = "Categoria não encontrada" };

                if (pessoa is null)
                    return new CommandResult<Guid?> { StatusCode = HttpStatusCode.NotFound, Message = "Pessoa não encontrada" };

                if (!Enum.TryParse<ETipo>(request.tipo, true, out var TipoEnum))
                    return new CommandResult<Guid?> { StatusCode = HttpStatusCode.BadRequest, Message = "Tipo inválido!" };

                var transacoesEntity = new Domain.Entities.Transacoes(request.Descricao, request.valor, TipoEnum, request.categoriaId, request.pessoaId, (EFinalidade)categoria.Finalidade, pessoa.Idade);

                await _transacoesRepository.Create(transacoesEntity, ct);

                return new CommandResult<Guid?> { Data = transacoesEntity.Id, StatusCode = HttpStatusCode.Created, Message = "Transação criada com sucesso" };
            }
            catch (ArgumentException ex)
            {
                return new CommandResult<Guid?> { StatusCode = HttpStatusCode.BadRequest, Message = ex.Message };
            }
            catch (Exception ex)
            {
                return new CommandResult<Guid?> { StatusCode = HttpStatusCode.InternalServerError, Message = $"Erro interno da aplicação. Detalhes: {ex.Message}" };
            }
        }

        public async Task<CommandResult<PagedResult<TransacoesResponseDTO>>> Get(int page, int pageSize, CancellationToken ct)
        {
            try
            {
                var transacoes = await _transacoesRepository.get(page, pageSize, ct);

                var result = transacoes.transacoes.ToTransacoesResponseDTO();

                var paged = new PagedResult<TransacoesResponseDTO>
                {
                    Items = result,
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = transacoes.total,
                    TotalPages = (int)Math.Ceiling(transacoes.total / (double)pageSize)
                };

                if (transacoes.total == 0)
                    return new CommandResult<PagedResult<TransacoesResponseDTO>> { Data = paged, StatusCode = HttpStatusCode.NotFound, Message = "Transacoes não encontradas" };

                return new CommandResult<PagedResult<TransacoesResponseDTO>> { Data = paged, StatusCode = HttpStatusCode.OK, Message = "Clientes retornados com sucesso" };

            }
            catch(ArgumentException ex)
            {
                return new CommandResult<PagedResult<TransacoesResponseDTO>> { StatusCode = HttpStatusCode.BadRequest, Message = ex.Message };
            }
            catch (Exception ex)
            {
                return new CommandResult<PagedResult<TransacoesResponseDTO>> { StatusCode = HttpStatusCode.InternalServerError, Message = $"Erro interno da aplicação. Detalhes: {ex.Message}" };
            }
        }
    }
}
