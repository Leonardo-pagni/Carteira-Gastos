using Gastos.API;
using Gastos.API.Extensions;
using Gastos.Application;
using Gastos.Infra;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi()
                .AddApplication()
                .AddApiServices()
                .AddInfraServices(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("front", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});



var app = builder.Build();

app.InitializeDb();

app.UseScalarDocumentation();

app.UseCors("front");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
