using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using ivan_api.Configuration;
using ivan_api.Models;
using ivan_api.Services;
using ivan_api.Services.AIDatabaseServ;
using ivan_api.Services.AIInstructionServ;
using ivan_api.Services.AIQueryServ;
using ivan_api.Services.AIConversationServ;
using ivan_api.Services.AIMultiModelServ;
using ivan_api.Services.AIRecommendationServ;
using ivan_api.Services.AISecurityServ;
using ivan_api.Services.AIPerformanceServ;
using ivan_api.Repository.VolunteerProfileRepo;
using ivan_api.Services.VolunteerProfileServ;
using ivan_api.Repository.EventRepo;
using ivan_api.Services.EventServ;
using ivan_api.Repository.CoordinatorTaskRepo;
using ivan_api.Services.CoordinatorTaskServ;
using System.Text.Json.Serialization;
using ivan_api.Services.PartnerCollaborationServ;
using ivan_api.Repository.PartnerCollaborationRepo;
using ivan_api.Services.PublicContentServ;

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

// Gemini Configuration
var geminiConfig = new GeminiConfiguration();
builder.Configuration.GetSection("Gemini").Bind(geminiConfig);
builder.Services.AddSingleton(geminiConfig);

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

// ChatBot Service
builder.Services.AddHttpClient<IChatBotService, ChatBotService>();
builder.Services.AddScoped<IChatBotService, ChatBotService>();

// AI Database Services
builder.Services.AddScoped<IAIDatabaseService, AIDatabaseService>();
builder.Services.AddScoped<IAIQueryEngine, AIQueryEngine>();
builder.Services.AddHttpClient<IntelligentSQLGenerator>(); // **AI-powered SQL Generator with HTTP**
builder.Services.AddScoped<IntelligentSQLGenerator>(); // **AI-powered SQL Generator**
builder.Services.AddHttpClient<IAIInstructionService, AIInstructionService>();
builder.Services.AddScoped<IAIInstructionService, AIInstructionService>();

// Phase 4: Advanced AI Services
builder.Services.AddScoped<IAIConversationService, AIConversationService>();
builder.Services.AddScoped<IMultiModelAIService, MultiModelAIService>();
builder.Services.AddScoped<IAIRecommendationService, AIRecommendationService>();

// Phase 6: Security & Performance Services
builder.Services.AddScoped<IAISecurityService, AISecurityService>();
builder.Services.AddScoped<IAIPerformanceService, AIPerformanceService>();

// Volunteer Profile DI
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IVolunteerProfileRepository, VolunteerProfileRepository>();
builder.Services.AddScoped<IVolunteerProfileService, VolunteerProfileService>();

// Coordinator Task DI
builder.Services.AddScoped<ICoordinatorTaskRepository, CoordinatorTaskRepository>();
builder.Services.AddScoped<ICoordinatorTaskService, CoordinatorTaskService>();

// Partner Collaboration DI
builder.Services.AddScoped<IPartnerCollaborationService, PartnerCollaborationService>();
builder.Services.AddScoped<IPartnerCollaborationRepository, PartnerCollaborationRepository>();

// Đăng ký Repository & Service
builder.Services.AddScoped<IEventRepository, EventRepository>();
//builder.Services.AddScoped<IEventService, EventService>();

builder.Services.AddControllers().AddJsonOptions(opt =>
{
    opt.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

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
