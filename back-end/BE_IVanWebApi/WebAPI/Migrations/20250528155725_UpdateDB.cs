using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VolunteerProfiles_users_UserId",
                table: "VolunteerProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VolunteerProfiles",
                table: "VolunteerProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.RenameTable(
                name: "VolunteerProfiles",
                newName: "VolunteerProfile");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "User");

            migrationBuilder.RenameIndex(
                name: "IX_VolunteerProfiles_UserId",
                table: "VolunteerProfile",
                newName: "IX_VolunteerProfile_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VolunteerProfile",
                table: "VolunteerProfile",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User",
                table: "User",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VolunteerProfile_User_UserId",
                table: "VolunteerProfile",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VolunteerProfile_User_UserId",
                table: "VolunteerProfile");

            migrationBuilder.DropPrimaryKey(
                name: "PK_VolunteerProfile",
                table: "VolunteerProfile");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User",
                table: "User");

            migrationBuilder.RenameTable(
                name: "VolunteerProfile",
                newName: "VolunteerProfiles");

            migrationBuilder.RenameTable(
                name: "User",
                newName: "users");

            migrationBuilder.RenameIndex(
                name: "IX_VolunteerProfile_UserId",
                table: "VolunteerProfiles",
                newName: "IX_VolunteerProfiles_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_VolunteerProfiles",
                table: "VolunteerProfiles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VolunteerProfiles_users_UserId",
                table: "VolunteerProfiles",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
