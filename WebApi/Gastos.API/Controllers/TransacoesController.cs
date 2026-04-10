using Gastos.Application.Services.Transacoes;
using Gastos.Shared.Result;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Gastos.API.Controllers
{
    [ApiController]
    [Route("/Transacoes")]
    public class TransacoesController(ITransacoesService transacoesService) : Controller
    {
        [HttpGet("Get")]
        public async Task<IActionResult> Get([FromHeader] int Page = 1, [FromHeader] int PageSize = 10, CancellationToken ct = default)
        {
            try
            {
                var result = await transacoesService.Get(Page, PageSize, ct);

                return result.ToResult();
            }
            catch(Exception ex) 
            {
                var result = new CommandResult<ProblemDetails>(new ProblemDetails { Title = "Erro ao fazer busca paginada de transacoes", Detail = ex.Message, Status = 500 }, HttpStatusCode.InternalServerError, "Erro ao fazer busca paginada de transacoes");
                return result.ToResult();
            }
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] TransacoesRequestDTO request, CancellationToken ct)
        {
            try
            {
                var result = await transacoesService.Create(request, ct);

                return result.ToResult();
            }
            catch(Exception ex) 
            {
                var result = new CommandResult<ProblemDetails>(new ProblemDetails { Title = "Erro ao fazer busca paginada de transacoes", Detail = ex.Message, Status = 500 }, HttpStatusCode.InternalServerError, "Erro ao fazer busca paginada de transacoes");
                return result.ToResult();
            }
        }
    }
}
