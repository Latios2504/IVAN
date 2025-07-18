using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using ivan_api.Configuration;
using ivan_api.Models;
using ivan_api.Services;
using ivan_api.Repository.VolunteerProfileRepo;
using ivan_api.Services.VolunteerProfileServ;
using ivan_api.Repository.EventRepo;
using ivan_api.Services.EventServ;
using ivan_api.Repository.CoordinatorTaskRepo;
using ivan_api.Services.CoordinatorTaskServ;
using System.Text.Json.Serialization;
using ivan_api.Repository.Certificates;
using ivan_api.Repository.CertificateTemplates;
using ivan_api.Repository.OnSiteTasks;
using ivan_api.Repository.OrganizationProfiles;
using ivan_api.Repository.PartnerProfiles;
using ivan_api.Repository.Reports;
using ivan_api.Mapping;
using PdfSharp.Fonts;
using ivan_api.Services.CertificateTemplates;
using ivan_api.Services.PartnerProfiles;
using ivan_api.Services.Reports;
using ivan_api.Services.Certificates;
using ivan_api.Services.OnSiteTasks;
using ivan_api.Services.OrganizationProfiles;
using ivan_api.Services.PartnerCollaborationServ;
using ivan_api.Repository.PartnerCollaborationRepo;
using ivan_api.Services.PublicContentServ;
using ivan_api.Services.UserAccountServ;
using ivan_api.Repository.UserAccountRepo;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

// Database Context
builder.Services.AddDbContext<VolunteerManagementSystemContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyCnn")));

// JWT Configuration
var jwtConfig = new JwtConfiguration();
builder.Configuration.GetSection("Jwt").Bind(jwtConfig);
builder.Services.AddSingleton(jwtConfig);

// Email Configuration
builder.Services.Configure<EmailConfiguration>(builder.Configuration.GetSection("Email"));

//AI Configuration
builder.Services.AddAiServices(builder.Configuration);

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig.Issuer,
            ValidAudience = jwtConfig.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.SecretKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

//Swagger Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Volunteer Management API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Authorization
builder.Services.AddAuthorization();

// Memory Cache (required by AI services)
builder.Services.AddMemoryCache();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:5173", "http://localhost:5174") // Vite dev server ports
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

// Custom Services
builder.Services.AddScoped<IPasswordHashingService, PasswordHashingService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IEventRegistrationService, EventRegistrationService>();
builder.Services.AddScoped<IScheduleService, ScheduleService>();
builder.Services.AddScoped<IPublicContentService, PublicContentService>();

// Volunteer Profile DI
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IVolunteerProfileRepository, VolunteerProfileRepository>();
builder.Services.AddScoped<IVolunteerProfileService, VolunteerProfileService>();

// Coordinator Task DI
builder.Services.AddScoped<ICoordinatorTaskRepository, CoordinatorTaskRepository>();
builder.Services.AddScoped<ICoordinatorTaskService, CoordinatorTaskService>();

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

builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IReportService, ReportService>();

builder.Services.AddAutoMapper(typeof(OrganizationProfileMapping));
builder.Services.AddAutoMapper(typeof(PartnerProfileMapping));
builder.Services.AddAutoMapper(typeof(OnSiteTaskMapping));
builder.Services.AddAutoMapper(typeof(CertificateMapping));
builder.Services.AddAutoMapper(typeof(CertificateTemplateMapping));
builder.Services.AddAutoMapper(typeof(ReportMapping));

GlobalFontSettings.UseWindowsFontsUnderWindows = true;
// Partner Collaboration DI
builder.Services.AddScoped<IPartnerCollaborationService, PartnerCollaborationService>();
builder.Services.AddScoped<IPartnerCollaborationRepository, PartnerCollaborationRepository>();

builder.Services.AddScoped<IUserAccountService, UserAccountService>();
builder.Services.AddScoped<IUserAccountRepository, UserAccountRepository>();

// Đăng ký Repository & Service
builder.Services.AddScoped<IEventRepository, EventRepository>();
//builder.Services.AddScoped<IEventService, EventService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS middleware (must be before Authentication)
app.UseCors();

// Authentication & Authorization middleware (order matters!)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
