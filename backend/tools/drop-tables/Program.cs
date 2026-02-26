using Npgsql;

var connStr = "Host=aws-1-ap-south-1.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.ynxrmcxmfqpbkfepxynf;Password=caothaidat123;SslMode=Require;Trust Server Certificate=true;No Reset On Close=true;";

Console.WriteLine("Connecting to Supabase...");
var dataSource = new NpgsqlDataSourceBuilder(connStr).Build();
await using var conn = await dataSource.OpenConnectionAsync();
Console.WriteLine("✓ Connected!");

var sql = @"
DROP TABLE IF EXISTS product_skus CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS ""__EFMigrationsHistory"" CASCADE;
";

await using var cmd = new NpgsqlCommand(sql, conn);
await cmd.ExecuteNonQueryAsync();
Console.WriteLine("✓ All tables dropped successfully.");
