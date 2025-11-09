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

            var result = await query
                .GroupBy(t => new { t.CreatedAt.Year, t.CreatedAt.Month })
                .Select(g => new TicketByMonthDto
                {
                    Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Count = g.Count()
                })
                .OrderBy(g => g.Month)
                .ToListAsync();

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

        // 🟧 4. Danh sách ticket (dành cho table trong Dashboard)
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
                    Difficulty = t.Difficulty,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();

            return tickets;
        }
    }
}
