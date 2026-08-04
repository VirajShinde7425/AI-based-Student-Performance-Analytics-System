# ---------- Build Stage ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY . .

RUN dotnet restore StudentPerformanceAnalytics.sln

RUN dotnet publish src/Infrastructure/StudentPerformanceAnalytics.Api/StudentPerformanceAnalytics.Api.csproj \
    -c Release \
    -o /app/publish

# ---------- Runtime Stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

EXPOSE 10000

ENTRYPOINT ["dotnet", "StudentPerformanceAnalytics.Api.dll"]