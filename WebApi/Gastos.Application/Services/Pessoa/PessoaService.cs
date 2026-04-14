using Gastos.Application.Services.Pessoa.DTOs;
using Gastos.Domain.Entities.Repositories;
using Gastos.Shared.Result;
using Gastos.Shared.Result.DTO;
using System.Net;

namespace Gastos.Application.Services.Pessoa
{
    public class PessoaService(IPessoaRepository _pessoaRepository) : IPessoaService
    {
        public async Task<ICommandResult<Guid?>> Create(PessoaRequestDTO dto, CancellationToken ct)
        {
            try
            {
                var pessoaEntity = new Domain.Entities.Pessoa(dto.Nome, dto.Idade);

                await _pessoaRepository.Create(pessoaEntity, ct);

                return new CommandResult<Guid?> { Data = pessoaEntity.Id, StatusCode = HttpStatusCode.Created, Message = "Pessoa criada com sucesso" };
            }
            catch (ArgumentException ex)
            {
                return new CommandResult<Guid?> { StatusCode = HttpStatusCode.BadRequest, Message = ex.Message };
            }
            catch (Exception ex)
            {
                return new CommandResult<Guid?> { Message = $"Erro interno do servidor. Detalhes: {ex.Message}", StatusCode = HttpStatusCode.InternalServerError};
            }
        }

        public async Task<ICommandResult> Delete(Guid id, CancellationToken ct)
        {
            try
            {
                var pessoa = await _pessoaRepository.GetById(id, ct);

                if (pessoa is null)
                    return new CommandResult { StatusCode = HttpStatusCode.NotFound, Message = "Pessoa não encontrada" };

                await _pessoaRepository.DeleteById(pessoa, ct);

                return new CommandResult { StatusCode = HttpStatusCode.NoContent, Message = "Pessoa deletada com sucesso" };
            }
            catch (ArgumentException ex)
            {
                return new CommandResult { StatusCode = HttpStatusCode.BadRequest, Message = ex.Message };
            }
            catch (Exception ex)
            {
                return new CommandResult { Message = $"Erro interno do servidor. Detalhes: {ex.Message}", StatusCode = HttpStatusCode.InternalServerError };
            }
        }

        public async Task<ICommandResult<PagedResult<PessoaResponseDTO>>> Get(int page, int pageSize, CancellationToken ct)
        {
            try
            {
                var pessoas = await _pessoaRepository.Get(page, pageSize,ct);

                var result = pessoas.pessoas.ToPessoaResponseDTO();

                var paged = new PagedResult<PessoaResponseDTO>
                {
                    Items = result,
                    Page = page,
                    PageSize = pageSize,
                    TotalItems = pessoas.total,
                    TotalPages = (int)Math.Ceiling(pessoas.total / (double)pageSize)
                };

                if (pessoas.total == 0)
                {
                    return new CommandResult<PagedResult<PessoaResponseDTO>> { Data = paged, StatusCode = HttpStatusCode.NotFound, Message = "Clientes não encontrados" };
                }

                return new CommandResult<PagedResult<PessoaResponseDTO>> { Data = paged, StatusCode = HttpStatusCode.OK, Message = "Clientes retornados com sucesso" };
            }
            catch(ArgumentException ex)
            {
                return new CommandResult<PagedResult<PessoaResponseDTO>> { StatusCode = HttpStatusCode.BadRequest, Message = ex.Message };
            }
            catch (Exception ex)
            {
                return new CommandResult<PagedResult<PessoaResponseDTO>> { Message = $"Erro interno do servidor. Detalhes: {ex.Message}", StatusCode = HttpStatusCode.InternalServerError };
            }
        }

        public async Task<ICommandResult> Update(Guid id, PessoaRequestDTO dto, CancellationToken ct)
        {
            try
            {
                var pessoa = await _pessoaRepository.GetById(id, ct);
                
                if (pessoa == null)
                    return new CommandResult { StatusCode = HttpStatusCode.NotFound, Message = "Pessoa não encontrada" };

                pessoa.AtualizarNome(dto.Nome);
                pessoa.AtualizarIdade(dto.Idade);

                await _pessoaRepository.Updated(ct);

                return new CommandResult { StatusCode = HttpStatusCode.NoContent, Message = "Pessoa atualizada com sucesso" };
            }
            catch(ArgumentException ex)
            {
                return new CommandResult { StatusCode = HttpStatusCode.BadRequest, Message = ex.Message };
            }
            catch (Exception ex)
            {
                return new CommandResult { Message = $"Erro interno do servidor. Detalhes: {ex.Message}", StatusCode = HttpStatusCode.InternalServerError };
            }
        }
    }
}
