using Gastos.Application.Services.Categoria;
using Gastos.Shared.Result;
using Microsoft.AspNetCore.Mvc;

namespace Gastos.API.Controllers
{
    [ApiController]
    [Route("Categoria")]
    public class CategoriaController(ICategoriaService categoriaService) : Controller
    {
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int Page = 1, [FromQuery] int PageSize = 10, CancellationToken ct = default)
        {
            var result = await categoriaService.Get(Page, PageSize, ct);

            return result.ToResult();
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoriaRequestDTO request, CancellationToken ct)
        {
            var result = await categoriaService.Create(request,ct);

            return result.ToResult();

        }

    }
}
