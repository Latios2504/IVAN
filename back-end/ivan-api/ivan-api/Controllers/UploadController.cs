using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.Common;

namespace ivan_api.Controllers
{
    /// <summary>
    /// Controller for handling file uploads
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UploadController> _logger;

        public UploadController(
            IWebHostEnvironment environment,
            ILogger<UploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        /// <summary>
        /// Upload profile image (avatar, banner, or logo)
        /// </summary>
        /// <param name="imageType">Type of image: avatar, banner, or logo</param>
        /// <param name="userId">User ID</param>
        /// <param name="image">Image file</param>
        /// <returns>URL of uploaded image</returns>
        [HttpPost("{imageType}/{userId}")]
        public async Task<ActionResult<ApiResponseDTO<ImageUploadResponseDto>>> UploadProfileImage(
            string imageType,
            int userId,
            IFormFile image)
        {
            try
            {
                // Validate image type parameter
                var validImageTypes = new[] { "avatar", "banner", "logo" };
                if (!validImageTypes.Contains(imageType.ToLower()))
                {
                    return BadRequest(new ApiResponseDTO<ImageUploadResponseDto>
                    {
                        Success = false,
                        Message = "Invalid image type. Allowed types: avatar, banner, logo",
                        Errors = new List<string> { "Invalid image type" }
                    });
                }

                // Validate file
                if (image == null || image.Length == 0)
                {
                    return BadRequest(new ApiResponseDTO<ImageUploadResponseDto>
                    {
                        Success = false,
                        Message = "No image file provided",
                        Errors = new List<string> { "Image file is required" }
                    });
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                var fileExtension = Path.GetExtension(image.FileName).ToLower();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new ApiResponseDTO<ImageUploadResponseDto>
                    {
                        Success = false,
                        Message = "Invalid file type. Allowed types: JPG, JPEG, PNG, GIF, WEBP",
                        Errors = new List<string> { "Invalid file type" }
                    });
                }

                // Validate file size (5MB limit)
                const long maxFileSize = 5 * 1024 * 1024; // 5MB
                if (image.Length > maxFileSize)
                {
                    return BadRequest(new ApiResponseDTO<ImageUploadResponseDto>
                    {
                        Success = false,
                        Message = "File size exceeds 5MB limit",
                        Errors = new List<string> { "File too large" }
                    });
                }

                // Create uploads directory structure
                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads",
                    imageType);
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Generate unique filename
                var fileName = $"{userId}_{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                // Generate URL (this would be your actual domain in production)
                var imageUrl = $"/uploads/{imageType}/{fileName}";

                _logger.LogInformation($"Image uploaded successfully: {imageUrl} for user {userId}");

                return Ok(new ApiResponseDTO<ImageUploadResponseDto>
                {
                    Success = true,
                    Data = new ImageUploadResponseDto { ImageUrl = imageUrl },
                    Message = "Image uploaded successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error uploading {imageType} image for user {userId}");
                return StatusCode(500, new ApiResponseDTO<ImageUploadResponseDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to upload image" }
                });
            }
        }

        /// <summary>
        /// Upload support request attachment
        /// </summary>
        /// <param name="file">File to upload</param>
        /// <returns>URL of uploaded file</returns>
        [HttpPost("support-request-attachment")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<FileUploadResponseDto>>> UploadSupportRequestAttachment(
            IFormFile file)
        {
            try
            {
                // Validate file
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new ApiResponseDTO<FileUploadResponseDto>
                    {
                        Success = false,
                        Message = "No file provided",
                        Errors = new List<string> { "File is required" }
                    });
                }

                // Validate file type
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx", ".txt" };
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest(new ApiResponseDTO<FileUploadResponseDto>
                    {
                        Success = false,
                        Message = "Invalid file type. Allowed types: JPG, JPEG, PNG, GIF, PDF, DOC, DOCX, TXT",
                        Errors = new List<string> { "Invalid file type" }
                    });
                }

                // Validate file size (10MB limit)
                const long maxFileSize = 10 * 1024 * 1024; // 10MB
                if (file.Length > maxFileSize)
                {
                    return BadRequest(new ApiResponseDTO<FileUploadResponseDto>
                    {
                        Success = false,
                        Message = "File size exceeds 10MB limit",
                        Errors = new List<string> { "File too large" }
                    });
                }

                // Create uploads directory structure
                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads",
                    "support-requests");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                // Generate unique filename
                var fileName = $"{DateTime.Now:yyyyMMdd_HHmmss}_{Guid.NewGuid()}{fileExtension}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Generate URL
                var fileUrl = $"/uploads/support-requests/{fileName}";

                _logger.LogInformation($"Support request attachment uploaded successfully: {fileUrl}");

                return Ok(new ApiResponseDTO<FileUploadResponseDto>
                {
                    Success = true,
                    Data = new FileUploadResponseDto { FileUrl = fileUrl },
                    Message = "File uploaded successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading support request attachment");
                return StatusCode(500, new ApiResponseDTO<FileUploadResponseDto>
                {
                    Success = false,
                    Message = "Internal server error",
                    Errors = new List<string> { "Failed to upload file" }
                });
            }
        }
    }

    public class ImageUploadResponseDto
    {
        public string ImageUrl { get; set; } = null!;
    }

    public class FileUploadResponseDto
    {
        public string FileUrl { get; set; } = null!;
    }
}
