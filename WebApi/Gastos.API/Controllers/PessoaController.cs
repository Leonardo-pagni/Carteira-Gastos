using Gastos.Application.Services.Pessoa;
using Gastos.Shared.Result;
using Microsoft.AspNetCore.Mvc;

namespace Gastoc.API.Controllers
{
    [ApiController]
    [Route("Pessoa")]
    public class PessoaController(IPessoaService _pessoaService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] int Page = 1, [FromQuery] int PageSize = 10, CancellationToken ct = default)
        {
            var result = await _pessoaService.Get(Page, PageSize, ct);

            return result.ToResult();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PessoaRequestDTO pessoaRequest, CancellationToken ct)
        {
            var result = await _pessoaService.Create(pessoaRequest, ct);

            return result.ToResult();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Updated(Guid id,[FromBody] PessoaRequestDTO pessoaRequest, CancellationToken ct)
        {
            var result = await _pessoaService.Update(id, pessoaRequest, ct);

            return result.ToResult();         
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Updated(Guid id, CancellationToken ct)
        {
            var result = await _pessoaService.Delete(id, ct);

            return result.ToResult();
        }
    }
}
