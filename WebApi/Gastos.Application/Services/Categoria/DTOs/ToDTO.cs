using Gastos.Domain.Enums;

namespace Gastos.Application.Services.Categoria.DTOs
{
    public static class ToDTO
    {
        public static ICollection<CategoriaResponseDTO> ToCategoriaResponseDTO(this ICollection<Domain.Entities.Categoria> categorias)
        {
            return categorias.Select(x => new CategoriaResponseDTO(x.Id, x.Descricao, ((EFinalidade)x.Finalidade).ToString())).ToList();
        }
    }
}
