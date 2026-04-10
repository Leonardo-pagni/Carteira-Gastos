
using Gastos.Domain.Entitys;

namespace Gastos.Application.Services.Pessoa.DTOs
{
    public static class ToDTO
    {
        public static ICollection<PessoaResponseDTO> ToPessoaResponseDTO(this ICollection<PessoaEntity> pessoaEntity)
        {
            return pessoaEntity.Select(p => new PessoaResponseDTO(p.Id, p.Nome, p.Idade, p.TotalDespesa, p.TotalReceita, p.Saldo)).ToList();
        }
    }
}
