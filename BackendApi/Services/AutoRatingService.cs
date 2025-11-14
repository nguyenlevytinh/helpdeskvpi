using BackendApi.Data;

public class AutoRatingService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    public AutoRatingService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var autoRateCandidates = context.Tickets
                .Where(t => t.Status == "Resolved"
                            && t.ResolvedAt <= DateTime.UtcNow.AddHours(-24)
                            && t.UserRating == null);

            foreach (var t in autoRateCandidates)
            {
                t.UserRating = 5; // hoặc logic khác
            }

            await context.SaveChangesAsync();

            await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken);
        }
    }
}
