using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.SupportRequest
{
    public class SupportRequestCreateDTO
    {
        [Required(ErrorMessage = "Danh mục hỗ trợ là bắt buộc")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Tiêu đề là bắt buộc")]
        [StringLength(300, ErrorMessage = "Tiêu đề không được vượt quá 300 ký tự")]
        public string Subject { get; set; } = null!;

        [Required(ErrorMessage = "Mô tả là bắt buộc")]
        public string Description { get; set; } = null!;

        public string Priority { get; set; } = "Medium";

        public List<string>? AttachmentUrls { get; set; }
    }
}
