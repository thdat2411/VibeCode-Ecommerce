using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Catalog.Migrations
{
    /// <inheritdoc />
    public partial class AddProductSkuAndUpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_products_category",
                table: "products");

            migrationBuilder.DropColumn(
                name: "category",
                table: "products");

            migrationBuilder.DropColumn(
                name: "stock",
                table: "products");

            migrationBuilder.AddColumn<decimal>(
                name: "compare_at_price",
                table: "products",
                type: "numeric(10,2)",
                precision: 10,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                table: "products",
                type: "boolean",
                nullable: false);

            migrationBuilder.AddColumn<int>(
                name: "total_stock",
                table: "products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                table: "collections",
                type: "boolean",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "parent_id",
                table: "collections",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "product_skus",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    product_id = table.Column<string>(type: "text", nullable: false),
                    sku_code = table.Column<string>(type: "text", nullable: false),
                    variant_values = table.Column<string>(type: "text", nullable: false),
                    stock = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    price_override = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: true),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product_skus", x => x.id);
                    table.ForeignKey(
                        name: "FK_product_skus_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_collections_collections_parent_id",
                table: "collections",
                column: "parent_id",
                principalTable: "collections",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.CreateIndex(
                name: "IX_collections_parent_id",
                table: "collections",
                column: "parent_id");

            migrationBuilder.CreateIndex(
                name: "IX_product_skus_product_id",
                table: "product_skus",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_product_skus_product_id_sku_code",
                table: "product_skus",
                columns: new[] { "product_id", "sku_code" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_collections_collections_parent_id",
                table: "collections");

            migrationBuilder.DropTable(
                name: "product_skus");

            migrationBuilder.DropIndex(
                name: "IX_collections_parent_id",
                table: "collections");

            migrationBuilder.DropColumn(
                name: "compare_at_price",
                table: "products");

            migrationBuilder.DropColumn(
                name: "is_active",
                table: "products");

            migrationBuilder.DropColumn(
                name: "total_stock",
                table: "products");

            migrationBuilder.DropColumn(
                name: "is_active",
                table: "collections");

            migrationBuilder.DropColumn(
                name: "parent_id",
                table: "collections");

            migrationBuilder.AddColumn<string>(
                name: "category",
                table: "products",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "stock",
                table: "products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_products_category",
                table: "products",
                column: "category");
        }
    }
}
