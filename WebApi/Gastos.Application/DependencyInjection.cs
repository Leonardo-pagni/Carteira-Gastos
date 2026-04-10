using Gastos.Application.Services.Categoria;
using Gastos.Application.Services.Pessoa;
using Gastos.Application.Services.Transacoes;
using Microsoft.Extensions.DependencyInjection;

namespace Gastos.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IPessoaService, PessoaService>();
            services.AddScoped<ICategoriaService, CategoriaService>();
            services.AddScoped<ITransacoesService, TransacoesService>();

            return services;
        }
    }
}
