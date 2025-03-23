var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.Aspire_Hosting_AppHost_ApiService>("apiservice");

builder.AddNpmApp("angular", "../Aspire.Angular")
    .WithReference(apiService)
    .WaitFor(apiService)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
