using Microsoft.EntityFrameworkCore;
using WebAPI.Data.Entities;
using WebAPI.Helpers.AutoMapper;
using WebAPI.Repository.VolunteerProfileRepo;
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

// Configure Dependency Injection
builder.Services.AddScoped<IVolunteerProfileRepository, VolunteerProfileRepository>();
builder.Services.AddScoped<IVolunteerProfileService, VolunteerProfileService>();

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
