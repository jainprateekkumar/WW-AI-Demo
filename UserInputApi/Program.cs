using System.ComponentModel.DataAnnotations;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

var dataFile = Path.Combine(builder.Environment.ContentRootPath,
    builder.Configuration["Storage:FilePath"] ?? "data/entries.json");
builder.Services.AddSingleton(new EntryStore(dataFile));

var app = builder.Build();

app.MapPost("/api/entries", async (EntryRequest request, EntryStore store) =>
{
    var errors = new List<ValidationResult>();
    if (!Validator.TryValidateObject(request, new ValidationContext(request), errors, true))
    {
        return Results.ValidationProblem(errors
            .GroupBy(e => e.MemberNames.FirstOrDefault() ?? "")
            .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage ?? "Invalid").ToArray()));
    }

    var entry = new Entry(Guid.NewGuid(), request.Name!.Trim(), request.Email!.Trim(), request.Message!.Trim(), DateTime.UtcNow);
    await store.AddAsync(entry);
    return Results.Created($"/api/entries/{entry.Id}", entry);
});

app.MapGet("/api/entries", async (EntryStore store) => Results.Ok(await store.GetAllAsync()));

app.Run();

public record EntryRequest(
    [property: Required, StringLength(100)] string? Name,
    [property: Required, EmailAddress, StringLength(200)] string? Email,
    [property: Required, StringLength(2000)] string? Message);

public record Entry(Guid Id, string Name, string Email, string Message, DateTime CreatedAtUtc);

public class EntryStore
{
    private readonly string _filePath;
    private readonly SemaphoreSlim _lock = new(1, 1);
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    public EntryStore(string filePath)
    {
        _filePath = filePath;
        Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
    }

    public async Task AddAsync(Entry entry)
    {
        await _lock.WaitAsync();
        try
        {
            var entries = await ReadAsync();
            entries.Add(entry);
            await File.WriteAllTextAsync(_filePath, JsonSerializer.Serialize(entries, JsonOptions));
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<List<Entry>> GetAllAsync()
    {
        await _lock.WaitAsync();
        try
        {
            return await ReadAsync();
        }
        finally
        {
            _lock.Release();
        }
    }

    private async Task<List<Entry>> ReadAsync()
    {
        if (!File.Exists(_filePath)) return new List<Entry>();
        var json = await File.ReadAllTextAsync(_filePath);
        return JsonSerializer.Deserialize<List<Entry>>(json) ?? new List<Entry>();
    }
}
