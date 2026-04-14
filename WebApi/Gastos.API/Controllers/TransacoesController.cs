using Gastos.Application.Services.Transacoes;
using Gastos.Shared.Result;
using Microsoft.AspNetCore.Mvc;

namespace Gastos.API.Controllers
{
    [ApiController]
    [Route("/Transacoes")]
    public class TransacoesController(ITransacoesService transacoesService) : Controller
    {
        [HttpGet]
        public async Task<IActionResult> Get([FromHeader] int Page = 1, [FromHeader] int PageSize = 10, CancellationToken ct = default)
        {
         
            var result = await transacoesService.Get(Page, PageSize, ct);

            return result.ToResult();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TransacoesRequestDTO request, CancellationToken ct)
        {
            var result = await transacoesService.Create(request, ct);

            return result.ToResult();
        }
    }
}
