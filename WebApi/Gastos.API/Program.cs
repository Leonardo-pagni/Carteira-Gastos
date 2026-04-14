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


var app = builder.Build();

app.InitializeDb();

app.UseScalarDocumentation();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
