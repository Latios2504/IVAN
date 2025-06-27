using Microsoft.EntityFrameworkCore;
using PdfSharp.Fonts;
using WebAPI.Data.Entities;
using WebAPI.Helpers.AutoMapper;
using WebAPI.Repository.Certificates;
using WebAPI.Repository.CertificateTemplates;
using WebAPI.Repository.OnSiteTasks;
using WebAPI.Repository.OrganizationProfiles;
using WebAPI.Repository.PartnerProfiles;
using WebAPI.Repository.VolunteerProfileRepo;
using WebAPI.Service.Certificates;
using WebAPI.Service.CertificateTemplates;
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

GlobalFontSettings.UseWindowsFontsUnderWindows = true;

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(VolunteerProfileMapping));
builder.Services.AddAutoMapper(typeof(OrganizationProfileMapping));
builder.Services.AddAutoMapper(typeof(PartnerProfileMapping));
builder.Services.AddAutoMapper(typeof(OnSiteTaskMapping));
builder.Services.AddAutoMapper(typeof(CertificateMapping));
builder.Services.AddAutoMapper(typeof(CertificateTemplateMapping));

// Configure Dependency Injection
builder.Services.AddScoped<IVolunteerProfileRepository, VolunteerProfileRepository>();
builder.Services.AddScoped<IVolunteerProfileService, VolunteerProfileService>();

builder.Services.AddScoped<IOrganizationProfileRepository, OrganizationProfileRepository>();
builder.Services.AddScoped<IOrganizationProfileService, OrganizationProfileService>();

builder.Services.AddScoped<IPartnerProfileRepository, PartnerProfileRepository>();
builder.Services.AddScoped<IPartnerProfileService, PartnerProfileService>();

builder.Services.AddScoped<IOnSiteTaskRepository, OnSiteTaskRepository>();
builder.Services.AddScoped<IOnSiteTaskService, OnSiteTaskService>();

builder.Services.AddScoped<ICertificateRepository, CertificateRepository>();
builder.Services.AddScoped<ICertificateService, CertificateService>();

builder.Services.AddScoped<ICertificateTemplateRepository, CertificateTemplateRepository>();
builder.Services.AddScoped<ICertificateTemplateService, CertificateTemplateService>();

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
