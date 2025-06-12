using Microsoft.EntityFrameworkCore;
using WebAPI.Data.Entities;
using WebAPI.Helpers.AutoMapper;
using WebAPI.Repository.OnSiteTasks;
using WebAPI.Repository.OrganizationProfiles;
using WebAPI.Repository.PartnerProfiles;
using WebAPI.Repository.VolunteerProfileRepo;
using WebAPI.Service.OnSiteTasks;
using WebAPI.Service.OrganizationProfiles;
using WebAPI.Service.PartnerProfiles;
using WebAPI.Service.VolunteerProfileService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// 1. Thêm Swagger vào DI container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();
builder.Services.AddDbContext<IVANSystemContext>(options => {
    options.UseSqlServer(builder.Configuration["ConnectionStrings:SystemDB"]);
});

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(VolunteerProfileMapping));
builder.Services.AddAutoMapper(typeof(OrganizationProfileMapping));
builder.Services.AddAutoMapper(typeof(PartnerProfileMapping));
builder.Services.AddAutoMapper(typeof(OnSiteTaskMapping));

// Configure Dependency Injection
builder.Services.AddScoped<IVolunteerProfileRepository, VolunteerProfileRepository>();
builder.Services.AddScoped<IVolunteerProfileService, VolunteerProfileService>();

builder.Services.AddScoped<IOrganizationProfileRepository, OrganizationProfileRepository>();
builder.Services.AddScoped<IOrganizationProfileService, OrganizationProfileService>();

builder.Services.AddScoped<IPartnerProfileRepository, PartnerProfileRepository>();
builder.Services.AddScoped<IPartnerProfileService, PartnerProfileService>();

builder.Services.AddScoped<IOnSiteTaskRepository, OnSiteTaskRepository>();
builder.Services.AddScoped<IOnSiteTaskService, OnSiteTaskService>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // Mặc định hiển thị ở /swagger
}

app.Run();
