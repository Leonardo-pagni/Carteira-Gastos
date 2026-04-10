using Gastos.Application.Services.Transacoes.DTOs;
using Gastos.Domain.Entitys;
using Gastos.Domain.Entitys.Repositories;
using Gastos.Domain.Enums;
using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;
using System.Net;

namespace Gastos.Application.Services.Transacoes
{
    public class TransacoesService(ITransacoesRepository _transacoesRepository, ICategoriaRepository _categoriaRepository, IPessoaRepository _pessoaRepository) : ITransacoesService
    {
        public async Task<CommandResult<Guid?>> Create(TransacoesRequestDTO request, CancellationToken ct)
        {
            try
            {
                var categoria = await _categoriaRepository.GetById(request.categoriaId, ct);
                var pessoa = await _pessoaRepository.GetById(request.pessoaId, ct);

                if(categoria is null)
                    throw new ArgumentException("Categoria inexistente");

                if(pessoa is null)
                    throw new ArgumentException("Pessoa inexistente");

                if (!Enum.TryParse<ETipo>(request.tipo, true, out var TipoEnum))
                {
                    throw new ArgumentException("Tipo inválido");
                }

                var transacoesEntity = new TransacoesEntity(request.Descricao, request.valor, TipoEnum, request.categoriaId, request.pessoaId, (EFinalidade)categoria.Finalidade, pessoa.Idade);

                var id = await _transacoesRepository.Create(transacoesEntity, ct);

                return new CommandResult<Guid?>(id, HttpStatusCode.Created, "Transação criada com sucesso");
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

        public async Task<CommandResult<PagedResult<TransacoesResponseDTO>>> Get(int page, int pageSize, CancellationToken ct)
        {
            try
            {
                var transacoes = await _transacoesRepository.get(ct);

                var totalItems = transacoes.Count();

                var items = transacoes 
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = transacoes.ToTransacoesResponseDTO();

                var paged = new PagedResult<TransacoesResponseDTO>
                {
                    Items = result,
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize)
                };

                if (totalItems == 0)
                    return new CommandResult<PagedResult<TransacoesResponseDTO>>(paged, HttpStatusCode.NotFound, "Clientes não encontrados");

                return new CommandResult<PagedResult<TransacoesResponseDTO>>(paged, HttpStatusCode.OK, "Clientes retornados com sucesso");

            }
            catch(ArgumentException ex)
            {
                return new CommandResult<PagedResult<TransacoesResponseDTO>>(null, HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
