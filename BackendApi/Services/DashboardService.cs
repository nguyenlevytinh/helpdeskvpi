using BackendApi.Data;
using BackendApi.Dtos.Dashboard;
using BackendApi.Dtos.Ticket;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Services
{
    public class DashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 Apply filter logic (reusable)
        private IQueryable<Models.Ticket> ApplyFilter(IQueryable<Models.Ticket> query, DashboardFilterDto filter)
        {
            if (!string.IsNullOrEmpty(filter.Department))
                query = query.Where(t => t.CreatedByUser.Department == filter.Department);

            if (!string.IsNullOrEmpty(filter.Category))
                query = query.Where(t => t.Category == filter.Category);

            if (!string.IsNullOrEmpty(filter.Email))
                query = query.Where(t => t.CreatedByUser.Email == filter.Email);

            if (filter.StartDate.HasValue)
                query = query.Where(t => t.CreatedAt >= filter.StartDate.Value);

            if (filter.EndDate.HasValue)
                query = query.Where(t => t.CreatedAt <= filter.EndDate.Value);

            return query;
        }

        // 🟩 1. Đếm tổng số ticket theo Status
        public async Task<List<TicketCountByStatusDto>> GetTicketCountByStatusAsync(DashboardFilterDto filter)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyFilter(query, filter);

            var result = await query
                .GroupBy(t => t.Status)
                .Select(g => new TicketCountByStatusDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return result;
        }

        // 🟨 2. Số lượng ticket theo tháng (bar chart)
        public async Task<List<TicketByMonthDto>> GetTicketByMonthAsync(DashboardFilterDto filter)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyFilter(query, filter);

            // ⚙️ GroupBy và Count trên SQL → format ở .NET
            var grouped = await query
                .GroupBy(t => new { t.CreatedAt.Year, t.CreatedAt.Month })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            var result = grouped
                .Select(g => new TicketByMonthDto
                {
                    Month = $"{g.Year}-{g.Month:D2}",
                    Count = g.Count
                })
                .OrderBy(e => e.Month)
                .ToList();

            return result;
        }

        // 🟦 3. Cơ cấu % ticket theo Category (pie chart)
        public async Task<List<TicketByCategoryDto>> GetTicketByCategoryAsync(DashboardFilterDto filter)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyFilter(query, filter);

            var total = await query.CountAsync();
            if (total == 0) return new List<TicketByCategoryDto>();

            var result = await query
                .GroupBy(t => t.Category)
                .Select(g => new TicketByCategoryDto
                {
                    Category = g.Key,
                    Count = g.Count(),
                    Percentage = (double)g.Count() * 100 / total
                })
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            return result;
        }

        // 🟧 4. Danh sách ticket (table trong Dashboard)
        public async Task<List<TicketListDto>> GetFilteredTicketsAsync(DashboardFilterDto filter)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyFilter(query, filter);

            var tickets = await query
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new TicketListDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Category = t.Category,
                    Status = t.Status,
                    Priority = t.Priority,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return tickets;
        }

        // 🟪 5. Tính SLA (ResponseRate, ProcessRate, SatisfactionRate)
        public async Task<SlaSummaryDto> GetSlaSummaryAsync(DashboardFilterDto filter)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyFilter(query, filter);
            query = query.Where(t => t.Priority != null);

            var tickets = await query.ToListAsync();
            if (!tickets.Any())
                return new SlaSummaryDto { ResponseRate = 0, ProcessRate = 0, SatisfactionRate = 0 };

            int total = tickets.Count;
            int countResponseOK = 0;
            int countProcessOK = 0;
            double totalRating = 0;

            foreach (var t in tickets)
            {
                if (t.CreatedAt == default) continue;

                double? responseDuration = null;
                double? processDuration = null;

                if (t.AcceptedAt.HasValue)
                    responseDuration = (t.AcceptedAt.Value - t.CreatedAt).TotalHours;

                if (t.AcceptedAt.HasValue && t.ResolvedAt.HasValue)
                    processDuration = (t.ResolvedAt.Value - t.AcceptedAt.Value).TotalHours;

                double responseStd = 0;
                double processStd = 0;

                switch (t.Priority)
                {
                    case "Thấp": responseStd = 0.25; processStd = 2; break;
                    case "Trung bình": responseStd = 0.34; processStd = 3; break;
                    case "Cao": responseStd = 0.42; processStd = 8; break;
                    case "Khẩn cấp": responseStd = 0.5; processStd = 32; break;
                }

                if (responseDuration.HasValue && responseDuration <= responseStd)
                    countResponseOK++;

                if (processDuration.HasValue && processDuration <= processStd)
                    countProcessOK++;

                if (t.UserRating.HasValue)
                    totalRating += t.UserRating.Value;
            }

            var responseRate = total > 0 ? (double)countResponseOK / total : 0;
            var processRate = total > 0 ? (double)countProcessOK / total : 0;
            var satisfactionRate = total > 0 ? totalRating / (5 * total) : 0;

            return new SlaSummaryDto
            {
                ResponseRate = Math.Round(responseRate, 3),
                ProcessRate = Math.Round(processRate, 3),
                SatisfactionRate = Math.Round(satisfactionRate, 3)
            };
        }

        // 🟫 6. SLA theo kỳ (tháng / quý / năm)
        public async Task<SlaSummaryDto> GetSlaSummaryByPeriodAsync(string period)
        {
            DateTime now = DateTime.UtcNow;
            DateTime startDate;
            DateTime endDate = now;

            // 🔸 Xác định khoảng thời gian theo period
            switch (period.ToLower())
            {
                case "month":
                    startDate = new DateTime(now.Year, now.Month, 1);
                    break;
                case "quarter":
                    int quarter = (now.Month - 1) / 3 + 1;
                    int firstMonthOfQuarter = (quarter - 1) * 3 + 1;
                    startDate = new DateTime(now.Year, firstMonthOfQuarter, 1);
                    break;
                case "year":
                    startDate = new DateTime(now.Year, 1, 1);
                    break;
                default:
                    throw new ArgumentException("Invalid period. Use month, quarter, or year.");
            }

            var filter = new DashboardFilterDto
            {
                StartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc),
                EndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc)
            };

            // ⚙️ Gọi lại hàm SLA tổng quát
            return await GetSlaSummaryAsync(filter);
        }
    }
}
