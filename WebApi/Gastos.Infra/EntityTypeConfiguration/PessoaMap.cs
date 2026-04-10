using Gastos.Domain.Entitys;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Gastos.Infra.EntityTypeConfiguration
{
    public class PessoaMap : IEntityTypeConfiguration<PessoaEntity>
    {
        public void Configure(EntityTypeBuilder<PessoaEntity> builder)
        {
            builder.ToTable("Pessoa");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Nome)
                   .HasMaxLength(200)
                   .IsRequired();

            builder.Property(x => x.Idade)
                   .IsRequired();

            builder.HasMany(x => x.Transacoes)
                   .WithOne(t => t.Pessoa)
                   .HasForeignKey(t => t.PessoaId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
