using Gastos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gastos.Infra.EntityTypeConfiguration
{
    public class CategoriaMap : IEntityTypeConfiguration<Categoria>
    {
        public void Configure(EntityTypeBuilder<Categoria> builder)
        {
            builder.ToTable("Categoria");

            builder.Property(x => x.Descricao)
                   .HasMaxLength(400)
                   .IsRequired();

            builder.Property(x => x.Finalidade)
                   .IsRequired();
        }
    }
}
