using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Skills",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Province",
                table: "VolunteerProfile",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "ProfilePictureUrl",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "VolunteerProfile",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Occupation",
                table: "VolunteerProfile",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Interests",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "VolunteerProfile",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "FacebookUrl",
                table: "VolunteerProfile",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(300)",
                oldMaxLength: 300);

            migrationBuilder.AlterColumn<string>(
                name: "EmergencyContactPhone",
                table: "VolunteerProfile",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "EmergencyContactName",
                table: "VolunteerProfile",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "EducationLevel",
                table: "VolunteerProfile",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Company",
                table: "VolunteerProfile",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "VolunteerProfile",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Bio",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Availability",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "CreatedAt", "Email", "EmailVerified", "IsActive", "LastLogin", "PasswordHash", "RoleId", "UpdatedAt", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1373), "volunteer1@example.com", true, true, null, "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", 2, new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1373), "volunteer1" },
                    { 2, new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1376), "volunteer2@example.com", true, true, null, "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", 2, new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1377), "volunteer2" },
                    { 3, new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1379), "admin@example.com", true, true, null, "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", 4, new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1379), "admin" }
                });

            migrationBuilder.InsertData(
                table: "VolunteerProfile",
                columns: new[] { "Id", "Address", "Availability", "BackgroundCheckDate", "Bio", "City", "Company", "CreatedAt", "DateOfBirth", "EducationLevel", "EmergencyContactName", "EmergencyContactPhone", "FacebookUrl", "FirstName", "Gender", "Interests", "IsBackgroundChecked", "LastName", "Occupation", "Phone", "ProfilePictureUrl", "Province", "Skills", "UpdatedAt", "UserId", "VolunteerHoursCompleted" },
                values: new object[,]
                {
                    { 1, "123 Đường Láng, Đống Đa", "Weekends,Evenings", null, "Tình nguyện viên nhiệt huyết với 5 năm kinh nghiệm trong các hoạt động cộng đồng.", "Hà Nội", "FPT Software", new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1437), new DateTime(1995, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "Đại học", "Nguyen Thi B", "0987654322", null, "Nguyen", "Male", "Environmental Conservation,Education", false, "Van A", "Kỹ sư phần mềm", "0987654321", null, "Hà Nội", "First Aid,Teaching", new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1437), 1, 50 },
                    { 2, "456 Nguyễn Trãi, Thanh Xuân", "Weekdays,Evenings", null, "Tình nguyện viên năng động, thích tham gia các hoạt động phát triển cộng đồng.", "Hà Nội", "VinGroup", new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1455), new DateTime(1998, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Đại học", "Tran Van D", "0912345679", null, "Tran", "Female", "Community Development,Health", false, "Thi C", "Nhân viên marketing", "0912345678", null, "Hà Nội", "Event Management,Public Speaking", new DateTime(2025, 5, 28, 16, 7, 41, 297, DateTimeKind.Utc).AddTicks(1455), 2, 30 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "VolunteerProfile",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "VolunteerProfile",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.AlterColumn<string>(
                name: "Skills",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Province",
                table: "VolunteerProfile",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ProfilePictureUrl",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "VolunteerProfile",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Occupation",
                table: "VolunteerProfile",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Interests",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "VolunteerProfile",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "FacebookUrl",
                table: "VolunteerProfile",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(300)",
                oldMaxLength: 300,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmergencyContactPhone",
                table: "VolunteerProfile",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EmergencyContactName",
                table: "VolunteerProfile",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "EducationLevel",
                table: "VolunteerProfile",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Company",
                table: "VolunteerProfile",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "City",
                table: "VolunteerProfile",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Bio",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Availability",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Address",
                table: "VolunteerProfile",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
