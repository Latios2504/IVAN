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
using ivan_api.Services.ModerationEventServ;
using ivan_api.Services.NotificationServ;
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
using ivan_api.Services.PasswordHashingSer;
using ivan_api.Services.JwtTokenSer;
using ivan_api.Services.EmailSer;
using ivan_api.Services.AuthenticationSer;
using ivan_api.Services.AI;
using ivan_api.Extensions;
using ivan_api.Services.VolunteerCoordinatorServ;
using ivan_api.Repository.VolunteerCoordinatorRepo;
using ivan_api.Repository.CoordinatorScheduleRepo;
using ivan_api.Services.CoordinatorScheduleServ;
using ivan_api.Repository.VolunteerScheduleRepo;
using ivan_api.Services.VolunteerScheduleServ;

using ivan_api.Services.DatabaseSchema.Interfaces;
using ivan_api.Services.DatabaseSchema.Services;
using ivan_api.Services.AI.SQLGenerator.Interfaces;
using ivan_api.Services.AI.SQLGenerator.Services;
using ivan_api.Services.Analytics;
using ivan_api.Repository.SupportRequestRepo;
using ivan_api.Services.SupportRequestServ;
using AutoMapper;
using Microsoft.OpenApi.Models;

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
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Volunteer Management API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT token with the format: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.Http, // Sử dụng Http thay vì ApiKey
        Scheme = "bearer", // Chỉ định scheme là bearer
        BearerFormat = "JWT" // Định dạng token là JWT
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// SignalR Configuration
builder.Services.AddSignalR();

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

// AutoMapper Configuration - Minimal configuration to avoid MaxFloat issue
builder.Services.AddAutoMapper(cfg =>
{
    cfg.DisableConstructorMapping();
    cfg.ShouldMapMethod = (method) => false; // Disable method mapping to avoid MaxFloat
}, typeof(Program).Assembly);

// Volunteer Profile DI
builder.Services.AddScoped<IVolunteerProfileRepository, VolunteerProfileRepository>();
builder.Services.AddScoped<IVolunteerProfileService, VolunteerProfileService>();

// Coordinator Task DI
builder.Services.AddScoped<ICoordinatorTaskRepository, CoordinatorTaskRepository>();
builder.Services.AddScoped<ICoordinatorTaskService, CoordinatorTaskService>();

// Volunteer Coordinator DI
builder.Services.AddScoped<IVolunteerCoordinatorRepository, VolunteerCoordinatorRepository>();
builder.Services.AddScoped<IVolunteerCoordinatorService, VolunteerCoordinatorService>();

// Coordinator Schedule DI
builder.Services.AddScoped<ICoordinatorScheduleRepository, CoordinatorScheduleRepository>();
builder.Services.AddScoped<ICoordinatorScheduleService, CoordinatorScheduleService>();

// Volunteer Schedule DI
builder.Services.AddScoped<IVolunteerScheduleRepository, VolunteerScheduleRepository>();
builder.Services.AddScoped<IVolunteerScheduleService, VolunteerScheduleService>();

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

GlobalFontSettings.UseWindowsFontsUnderWindows = true;
// Partner Collaboration DI
builder.Services.AddScoped<IPartnerCollaborationService, PartnerCollaborationService>();
builder.Services.AddScoped<IPartnerCollaborationRepository, PartnerCollaborationRepository>();

builder.Services.AddScoped<IUserAccountService, UserAccountService>();
builder.Services.AddScoped<IUserAccountRepository, UserAccountRepository>();

// Support Request DI
builder.Services.AddScoped<ISupportRequestRepository, SupportRequestRepository>();
builder.Services.AddScoped<ISupportRequestService, SupportRequestService>();

// Schema Services DI
builder.Services.AddScoped<ISchemaService, SchemaService>();

// SQL Generator Services DI
builder.Services.AddScoped<ISqlExecutionService, SqlExecutionService>();

// Analytics Services DI
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// Export Services DI
builder.Services.AddScoped<ivan_api.Services.ExportService.IExportService, ivan_api.Services.ExportService.ExportService>();

// TODO: Phase 2 - Add simplified services registration

// Đăng ký Repository & Service
builder.Services.AddScoped<IEventRepository, EventRepository>();
//builder.Services.AddScoped<IEventService, EventService>();

//Moderation Event Service
builder.Services.AddScoped<IModerationEventService, ModerationEventService>();
//Notification Service
builder.Services.AddScoped<INotificationService, NotificationService>();

builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
}); ;
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
