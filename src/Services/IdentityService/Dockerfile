# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy shared library
COPY ["src/Shared/Shared.Library/Shared.Library.csproj", "Shared/Shared.Library/"]

# Copy Identity Service projects
COPY ["src/Services/IdentityService/IdentityService.API/IdentityService.API.csproj", "Services/IdentityService/IdentityService.API/"]
COPY ["src/Services/IdentityService/IdentityService.Application/IdentityService.Application.csproj", "Services/IdentityService/IdentityService.Application/"]
COPY ["src/Services/IdentityService/IdentityService.Domain/IdentityService.Domain.csproj", "Services/IdentityService/IdentityService.Domain/"]
COPY ["src/Services/IdentityService/IdentityService.Infrastructure/IdentityService.Infrastructure.csproj", "Services/IdentityService/IdentityService.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Services/IdentityService/IdentityService.API/IdentityService.API.csproj"

# Copy source code
COPY src/Shared/Shared.Library/ Shared/Shared.Library/
COPY src/Services/IdentityService/ Services/IdentityService/

# Build
WORKDIR "/src/Services/IdentityService/IdentityService.API"
RUN dotnet build "IdentityService.API.csproj" -c Release -o /app/build

# Publish
RUN dotnet publish "IdentityService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "IdentityService.API.dll"]
