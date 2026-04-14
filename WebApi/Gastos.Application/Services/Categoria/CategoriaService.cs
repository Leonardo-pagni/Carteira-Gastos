using Gastos.Application.Services.Categoria.DTOs;
using Gastos.Domain.Entities.Repositories;
using Gastos.Domain.Enums;
using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;
using System.Net;

namespace Gastos.Application.Services.Categoria
{
    public class CategoriaService(ICategoriaRepository _categoriaRepository) : ICategoriaService
    {
        public async Task<ICommandResult<Guid?>> Create(CategoriaRequestDTO request, CancellationToken ct)
        {
            try
            {
                if (!Enum.TryParse<EFinalidade>(request.finalidade, true, out var finalidadeEnum))
                {
                    throw new ArgumentException("Finalidade inválida");
                }

                var categoriaEntity = new Domain.Entities.Categoria(request.descricao, finalidadeEnum);

                var id = await _categoriaRepository.Create(categoriaEntity, ct);

                return new CommandResult<Guid?> { Data = id, Message = "Categoria criada com sucesso!", StatusCode = HttpStatusCode.Created};
            }
            catch (ArgumentException ex)
            {
                return new CommandResult<Guid?> {Data = null, Message = ex.Message, StatusCode = HttpStatusCode.BadRequest};
            }
            catch (Exception ex)
            {
                return new CommandResult<Guid?> { Message = $"Erro interno do servidor. Detalhes: {ex.Message}", StatusCode = HttpStatusCode.InternalServerError };
            }
        }

        public async Task<ICommandResult<PagedResult<CategoriaResponseDTO>>> Get(int page, int pageSize, CancellationToken ct)
        {
            try
            {
                var categorias = await _categoriaRepository.Get(page, pageSize, ct);

                var result = categorias.categorias.ToCategoriaResponseDTO();

                var paged = new PagedResult<CategoriaResponseDTO>
                {
                    Items = result,
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = categorias.total,
                    TotalPages = (int)Math.Ceiling(categorias.total / (double)pageSize)
                };

                if (categorias.total == 0)
                {
                    return new CommandResult<PagedResult<CategoriaResponseDTO>> { Data = paged, StatusCode = HttpStatusCode.NotFound, Message = "Categorias não encontradas" };
                }

                return new CommandResult<PagedResult<CategoriaResponseDTO>> { Data = paged, StatusCode = HttpStatusCode.OK, Message = "Categorias retornadas com sucesso" };
            }
            catch (ArgumentException ex)
            {
                return new CommandResult<PagedResult<CategoriaResponseDTO>> { Message = ex.Message, StatusCode = HttpStatusCode.BadRequest};
            }
            catch (Exception ex)
            {
                return new CommandResult<PagedResult<CategoriaResponseDTO>> { Message = $"Erro interno do servidor. Detalhes: {ex.Message}", StatusCode = HttpStatusCode.InternalServerError };
            }
        }
    }
}
