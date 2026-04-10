using Scalar.AspNetCore;

namespace Gastos.API
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApiServices(this IServiceCollection services)
        {
            services.AddOpenApi();

            return services;
        }

        public static WebApplication UseScalarDocumentation(this WebApplication app)
        {
            app.MapOpenApi();

            app.MapScalarApiReference(options =>
            {
                options.Title = "Minha API";
                options.Theme = ScalarTheme.DeepSpace;
                options.DefaultHttpClient = new(ScalarTarget.CSharp, ScalarClient.HttpClient);
            });

            return app;
        }
    }
}
