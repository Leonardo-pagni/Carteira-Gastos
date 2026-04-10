using Gastos.Domain.Entitys;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gastos.Infra.EntityTypeConfiguration
{
    public class TransacoesMap : IEntityTypeConfiguration<TransacoesEntity>
    {
        public void Configure(EntityTypeBuilder<TransacoesEntity> builder)
        {
            builder.ToTable("Transacoes");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Descricao)
                .IsRequired()
                .HasMaxLength(400);

            builder.Property(x => x.Valor)
                .HasPrecision(10,2)
                .IsRequired();

            builder.Property(x => x.Tipo)
                .IsRequired();

            builder.HasOne(x => x.Categoria)
                   .WithMany()
                   .HasForeignKey(x => x.CategoriaId);

            builder.HasOne(x => x.Pessoa)
                   .WithMany(p => p.Transacoes)
                   .HasForeignKey(x => x.PessoaId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
