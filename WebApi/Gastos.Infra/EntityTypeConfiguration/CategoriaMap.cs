using Gastos.Domain.Entitys;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gastos.Infra.EntityTypeConfiguration
{
    public class CategoriaMap : IEntityTypeConfiguration<CategoriaEntity>
    {
        public void Configure(EntityTypeBuilder<CategoriaEntity> builder)
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
