using Gastos.Domain.Enums;

namespace Gastos.Application.Services.Transacoes.DTOs
{
    public static class ToDTO
    {
        public static ICollection<TransacoesResponseDTO> ToTransacoesResponseDTO(this ICollection<Domain.Entities.Transacoes> transacoes)
        {
            return transacoes.Select(x => new TransacoesResponseDTO(x.Id, x.Descricao, x.Valor, ((ETipo)x.Tipo).ToString(), x.Categoria.Descricao, x.Pessoa.Nome)).ToList();
        }
    }
}
