using Gastos.Application.Services.Pessoa.DTOs;
using Gastos.Domain.Entitys;
using Gastos.Domain.Entitys.Repositories;
using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;
using System.Net;

namespace Gastos.Application.Services.Pessoa
{
    public class PessoaService(IPessoaRepository _pessoaRepository) : IPessoaService
    {
        public async Task<CommandResult<Guid?>> Create(PessoaRequestDTO dto, CancellationToken ct)
        {
            try
            {
                var pessoaEntity = new PessoaEntity(dto.Nome, dto.Idade);

                var id = await _pessoaRepository.Create(pessoaEntity, ct);

                return new CommandResult<Guid?>(id, HttpStatusCode.Created, "Pessoa criada com sucesso");
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

        public async Task<CommandResult> Delete(Guid id, CancellationToken ct)
        {
            try
            {
                await _pessoaRepository.DeleteById(id, ct);
                return new CommandResult(HttpStatusCode.NoContent, "Pessoa deletada com sucesso");
            }
            catch (ArgumentException ex)
            {
                return new CommandResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CommandResult<PagedResult<PessoaResponseDTO>>> Get(int Page, int PageSize, CancellationToken ct)
        {
            try
            {
                var pessoa = await _pessoaRepository.Get(ct);

                var totalItems = pessoa.Count();

                var items = pessoa
                    .Skip((Page - 1) * PageSize)
                    .Take(PageSize)
                    .ToList();

                var result = items.ToPessoaResponseDTO();

                var paged = new PagedResult<PessoaResponseDTO>
                {
                    Items = result,
                    Page = Page,
                    PageSize = PageSize,
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling(totalItems / (double)PageSize)
                };

                if(totalItems == 0)
                    return new CommandResult<PagedResult<PessoaResponseDTO>>(paged, HttpStatusCode.NotFound, "Clientes não encontrados");

                return new CommandResult<PagedResult<PessoaResponseDTO>>(paged, HttpStatusCode.OK, "Clientes retornados com sucesso");
            }
            catch(ArgumentException ex)
            {
                return new CommandResult<PagedResult<PessoaResponseDTO>>(null, HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<CommandResult> Update(Guid id, PessoaRequestDTO dto, CancellationToken ct)
        {
            try
            {
                var pessoa = await _pessoaRepository.GetById(id, ct);
                
                if (pessoa == null)
                {
                    return new CommandResult(HttpStatusCode.NotFound, "Pessoa não encontrada");
                }

                pessoa.AtualizarNome(dto.Nome);
                pessoa.AtualizarIdade(dto.Idade);

                return new CommandResult(HttpStatusCode.NoContent, "Pessoa atualizada com sucesso");
            }
            catch(ArgumentException ex)
            {
                return new CommandResult(HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
