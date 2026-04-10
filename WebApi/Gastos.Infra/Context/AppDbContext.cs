using Gastos.Domain.Entitys;
using Microsoft.EntityFrameworkCore;

namespace Gastos.Infra.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<PessoaEntity> Pessoa {  get; set; }
        public DbSet<TransacoesEntity> Transacoes { get; set; }
        public DbSet<CategoriaEntity> Categoria { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            base.OnModelCreating(modelBuilder);
        }
    }
}
