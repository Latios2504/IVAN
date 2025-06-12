using Microsoft.EntityFrameworkCore;
using WebAPI.Helpers.AutoMapper;
using WebAPI.Helpers.Core;
using WebAPI.Repository.OrganizationProfiles;
using WebAPI.Service.OrganizationProfiles;
using WebAPI.Repository.PartnerProfiles;
using WebAPI.Service.PartnerProfiles;
using WebAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<IVANContext>(options => {
    options.UseSqlServer(builder.Configuration["ConnectionStrings:SystemDB"]);
});

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(OrganizationProfileMapping));
builder.Services.AddAutoMapper(typeof(PartnerProfileMapping));

// Configure Dependency Injection
builder.Services.AddScoped<IOrganizationProfileRepository, OrganizationProfileRepository>();
builder.Services.AddScoped<IOrganizationProfileService, OrganizationProfileService>();

builder.Services.AddScoped<IPartnerProfileRepository, PartnerProfileRepository>();
builder.Services.AddScoped<IPartnerProfileService, PartnerProfileService>();


//builder.Services.AddDbContext<IVANContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("SystemDB")), ServiceLifetime.Transient);
//builder.Services.AddScoped<DbContext, IVANContext>();

//builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
//builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();

//builder.Services.AddTransient<IOrganizationProfileRepository, OrganizationProfileRepository>();//
//builder.Services.AddTransient<OrganizationProfileDAO>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Run();
