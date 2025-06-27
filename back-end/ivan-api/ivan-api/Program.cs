using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ivan_api.Configuration;
using ivan_api.Models;
using ivan_api.Services;
using ivan_api.Repository.VolunteerProfileRepo;
using ivan_api.Services.VolunteerProfileServ;
using ivan_api.Repository.EventRepo;
using ivan_api.Services.EventServ;
using ivan_api.Repository.CoordinatorTaskRepo;
using ivan_api.Services.CoordinatorTaskServ;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Database Context
builder.Services.AddDbContext<VolunteerManagementSystemContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyCnn")));

// JWT Configuration
var jwtConfig = new JwtConfiguration();
builder.Configuration.GetSection("Jwt").Bind(jwtConfig);
builder.Services.AddSingleton(jwtConfig);

// Email Configuration
builder.Services.Configure<EmailConfiguration>(builder.Configuration.GetSection("Email"));

// Gemini Configuration
var geminiConfig = new GeminiConfiguration();
builder.Configuration.GetSection("Gemini").Bind(geminiConfig);
builder.Services.AddSingleton(geminiConfig);

// Google Sheets Configuration
var googleSheetsConfig = new GoogleSheetsConfiguration();
builder.Configuration.GetSection("GoogleSheets").Bind(googleSheetsConfig);
builder.Services.AddSingleton(googleSheetsConfig);

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

// N8N Webhook Service
builder.Services.AddHttpClient<IN8nWebhookService, N8nWebhookService>();
builder.Services.AddScoped<IN8nWebhookService, N8nWebhookService>();

// ChatBot Service
builder.Services.AddHttpClient<IChatBotService, ChatBotService>();
builder.Services.AddScoped<IChatBotService, ChatBotService>();

// Google Sheets Service
builder.Services.AddHttpClient<IGoogleSheetsService, GoogleSheetsService>();
builder.Services.AddScoped<IGoogleSheetsService, GoogleSheetsService>();

// Volunteer Profile DI
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IVolunteerProfileRepository, VolunteerProfileRepository>();
builder.Services.AddScoped<IVolunteerProfileService, VolunteerProfileService>();

// Coordinator Task DI
builder.Services.AddScoped<ICoordinatorTaskRepository, CoordinatorTaskRepository>();
builder.Services.AddScoped<ICoordinatorTaskService, CoordinatorTaskService>();

// Đăng ký Repository & Service
builder.Services.AddScoped<IEventRepository, EventRepository>();
//builder.Services.AddScoped<IEventService, EventService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
