# Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copia projetos
COPY Gastos.API/Gastos.API.csproj Gastos.API/
COPY Gastos.Infra/Gastos.Infra.csproj Gastos.Infra/
COPY Gastos.Domain/Gastos.Domain.csproj Gastos.Domain/

# Restore direto no projeto
RUN dotnet restore Gastos.API/Gastos.API.csproj

# Copia tudo
COPY . .

# Build
WORKDIR /src/Gastos.API
RUN dotnet publish -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Gastos.API.dll"]