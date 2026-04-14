namespace Gastos.Application.Services.Pessoa.DTOs
{
    public static class ToDTO
    {
        public static ICollection<PessoaResponseDTO> ToPessoaResponseDTO(this ICollection<Domain.Entities.Pessoa> pessoaEntity)
        {
            return pessoaEntity.Select(p => new PessoaResponseDTO(p.Id, p.Nome, p.Idade, p.TotalDespesa, p.TotalReceita, p.Saldo)).ToList();
        }
    }
}
