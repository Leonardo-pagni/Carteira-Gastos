using Gastos.Application.Services.Pessoa;
using Gastos.Shared.Result;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Gastoc.API.Controllers
{
    [ApiController]
    [Route("Pessoa")]
    public class PessoaController(IPessoaService pessoaService) : ControllerBase
    {
        [HttpGet("Get")]
        public async Task<IActionResult> Get([FromHeader] int Page = 1, [FromHeader] int PageSize = 10, CancellationToken ct = default)
        {
            try
            {
                var result = await pessoaService.Get(Page, PageSize, ct);

                return result.ToResult();
            }
            catch(Exception ex)
            {
                var result = new CommandResult<ProblemDetails>(new ProblemDetails { Title = "Erro ao fazer busca paginada de pessoas", Detail = ex.Message, Status = 500 }, HttpStatusCode.InternalServerError, "Erro ao fazer busca paginada de pessoas");

                return result.ToResult();
            }
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] PessoaRequestDTO pessoaRequest, CancellationToken ct)
        {
            try
            {
                var result = await pessoaService.Create(pessoaRequest, ct);

                return result.IsSuccess ? Created($"/{result.Data}", result.Message) : result.ToResult();
            }
            catch(Exception ex)
            {
                var result = new CommandResult<ProblemDetails>(new ProblemDetails { Title = "Erro ao Criar pessoa", Detail = ex.Message, Status = 500 }, HttpStatusCode.InternalServerError, "Erro ao criar pessoa");

                return result.ToResult();
            }
        }

        [HttpPut("Upated")]
        public async Task<IActionResult> Updated([FromHeader] Guid id,[FromBody] PessoaRequestDTO pessoaRequest, CancellationToken ct)
        {
            try
            {
                var result = await pessoaService.Update(id, pessoaRequest, ct);

                return result.ToResult();
            }
            catch(Exception ex)
            {
                var result = new CommandResult<ProblemDetails>(new ProblemDetails { Title = "Erro ao atualizar pessoa", Detail = ex.Message, Status = 500 }, HttpStatusCode.InternalServerError, "Erro ao atualizar pessoa");

                return result.ToResult();
            }
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Updated([FromHeader] Guid id, CancellationToken ct)
        {
            try
            {
                var result = await pessoaService.Delete(id, ct);

                return result.ToResult();
            }
            catch(Exception ex)
            {
                var result = new CommandResult<ProblemDetails>(new ProblemDetails { Title = "Erro ao deletar pessoa", Detail = ex.Message, Status = 500 }, HttpStatusCode.InternalServerError, "Erro ao deletar pessoa");

                return result.ToResult();
            }
        }
    }
}
