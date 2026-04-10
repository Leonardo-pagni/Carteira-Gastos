using Gastos.Application.Services.Categoria;
using Gastos.Shared.Result;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Gastos.API.Controllers
{
    [ApiController]
    [Route("Categoria")]
    public class CategoriaController(ICategoriaService categoriaService) : Controller
    {
        [HttpGet("Get")]
        public async Task<IActionResult> Get([FromHeader] int Page = 1, [FromHeader] int PageSize = 10, CancellationToken ct = default)
        {
            try
            {
                var result = await categoriaService.Get(Page, PageSize, ct);

                return result.ToResult();
            }
            catch (Exception ex)
            {
                var result = new CommandResult<ProblemDetails>(new ProblemDetails { Title = "Erro ao fazer busca paginada de categorias", Detail = ex.Message, Status = 500 }, HttpStatusCode.InternalServerError, "Erro ao fazer busca paginada de categorias");

                return result.ToResult();
            }
        }
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CategoriaRequestDTO request, CancellationToken ct)
        {
            try
            {
                var result = await categoriaService.Create(request,ct);

                return result.IsSuccess  ? Created($"/{result.Data}", result.Message) : result.ToResult();
            }
            catch (Exception ex)
            {
                var result = new CommandResult<ProblemDetails>(new ProblemDetails { Title = "Erro ao criar categoria", Detail = ex.Message, Status = 500 }, HttpStatusCode.InternalServerError, "Erro ao criar categoria");
                return result.ToResult();
            }
        }

    }
}
