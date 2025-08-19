using FluentValidation;
using System.ComponentModel.DataAnnotations;

namespace ivan_api.DTOs.PartnerCollaboration
{
    public class PartnerCollaborationCreateDto
    {
        [Required(ErrorMessage = "Tổ chức là bắt buộc!")]
        public int OrganizationId { get; set; }

        [Required(ErrorMessage = "Đối tác là bắt buộc!")]
        public int PartnerId { get; set; }

        [Required(ErrorMessage = "Loại hợp tác là bắt buộc!")]
        public int TypeId { get; set; }

        [Required(ErrorMessage = "Tên hợp tác là bắt buộc!")]
        public string CollaborationName { get; set; } = null!;

        public string? Description { get; set; }

        public string? Objectives { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public string? Status { get; set; }

        public decimal? Budget { get; set; }

        public string? Currency { get; set; }

        public string? ContractDocumentUrl { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }

    public class PartnerCollaborationCreateValidator : AbstractValidator<PartnerCollaborationCreateDto>
    {
        public PartnerCollaborationCreateValidator()
        {
            RuleFor(x => x.OrganizationId)
                .GreaterThan(0).WithMessage("Tổ chức là bắt buộc");

            RuleFor(x => x.PartnerId)
                .GreaterThan(0).WithMessage("Đối tác là bắt buộc");

            RuleFor(x => x.TypeId)
                .GreaterThan(0).WithMessage("Loại hợp tác là bắt buộc");

            RuleFor(x => x.CollaborationName)
                .NotEmpty().WithMessage("Tên hợp tác là bắt buộc")
                .MaximumLength(300).WithMessage("Tên hợp tác không được vượt quá 300 ký tự");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Mô tả không được vượt quá 2000 ký tự");

            RuleFor(x => x.Budget)
                .GreaterThanOrEqualTo(0).WithMessage("Ngân sách phải lớn hơn hoặc bằng 0")
                .When(x => x.Budget.HasValue);

            RuleFor(x => x.Currency)
                .Must(x => new[] { "VND", "USD", "EUR" }.Contains(x))
                .WithMessage("Đơn vị tiền tệ không hợp lệ");

            // Kiểm tra ngày hợp lệ
            RuleFor(x => x)
                .Must(x => !(x.StartDate!=null) || !x.EndDate.HasValue || x.StartDate < x.EndDate)
                .WithMessage("Ngày bắt đầu phải trước ngày kết thúc");
        }
    }
}
