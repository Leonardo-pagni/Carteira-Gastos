using Azure.Core;
using Gastos.Application.Services.Categoria.DTOs;
using Gastos.Domain.Entitys;
using Gastos.Domain.Entitys.Repositories;
using Gastos.Domain.Enums;
using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;
using Microsoft.Extensions.Logging;
using System.Net;

namespace Gastos.Application.Services.Categoria
{
    public class CategoriaService(ICategoriaRepository _categoriaRepository, ILogger<CategoriaService> _logger) : ICategoriaService
    {
        public async Task<CommandResult<Guid?>> Create(CategoriaRequestDTO request, CancellationToken ct)
        {
            try
            {
                if (!Enum.TryParse<EFinalidade>(request.finalidade, true, out var finalidadeEnum))
                {
                    _logger.LogWarning("Finalidade inválida: {Finalidade}", request.finalidade);
                    throw new ArgumentException("Finalidade inválida");
                }

                var categoriaEntity = new CategoriaEntity(request.descricao, finalidadeEnum);

                var id = await _categoriaRepository.Create(categoriaEntity, ct);

                return new CommandResult<Guid?>(id, HttpStatusCode.Created, "Categoria criada com sucesso");
            }
            catch (ArgumentException ex)
            {
                return new CommandResult<Guid?>(null, HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CommandResult<PagedResult<CategoriaResponseDTO>>> Get(int page, int pageSize, CancellationToken ct)
        {
            try
            {
                var categoria = await _categoriaRepository.Get(ct);

                var totalItems = categoria.Count();

                var items = categoria
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = items.ToCategoriaResponseDTO();

                var paged = new PagedResult<CategoriaResponseDTO>
                {
                    Items = result,
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
                };

                if (totalItems == 0)
                {
                    _logger.LogInformation("Nenhuma categoria encontrada");
                    return new CommandResult<PagedResult<CategoriaResponseDTO>>(paged, HttpStatusCode.NotFound, "Categorias não encontradas");
                }

                return new CommandResult<PagedResult<CategoriaResponseDTO>>(paged, HttpStatusCode.OK, "Categorias retornadas com sucesso");
            }
            catch (ArgumentException ex)
            {
                return new CommandResult<PagedResult<CategoriaResponseDTO>>(null, HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
