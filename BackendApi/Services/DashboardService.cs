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

        // ⭐ ROLE FILTER
        private IQueryable<Models.Ticket> ApplyRoleFilter(
            IQueryable<Models.Ticket> query,
            int userId,
            string role)
        {
            return role switch
            {
                "admin" => query,                                       // xem tất cả
                "helpdesk" => query.Where(t => t.AssignedTo == userId), // xem ticket assign
                _ => query.Where(t => t.CreatedBy == userId),           // user bình thường → xem của mình
            };
        }

        // FILTER 
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

        // ------------------------------------------------------------------------------------
        //  1. Tổng ticket theo status
        public async Task<List<TicketCountByStatusDto>> GetTicketCountByStatusAsync(
            DashboardFilterDto filter,
            int userId,
            string role)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyRoleFilter(query, userId, role);
            query = ApplyFilter(query, filter);

            return await query
                .GroupBy(t => t.Status)
                .Select(g => new TicketCountByStatusDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();
        }

        // ------------------------------------------------------------------------------------
        //  2. Ticket theo tháng
        public async Task<List<TicketByMonthDto>> GetTicketByMonthAsync(
            DashboardFilterDto filter,
            int userId,
            string role)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyRoleFilter(query, userId, role);
            query = ApplyFilter(query, filter);

            var grouped = await query
                .GroupBy(t => new { t.CreatedAt.Year, t.CreatedAt.Month })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            return grouped
                .Select(g => new TicketByMonthDto
                {
                    Month = $"{g.Year}-{g.Month:D2}",
                    Count = g.Count
                })
                .OrderBy(x => x.Month)
                .ToList();
        }

        // ------------------------------------------------------------------------------------
        //  3. Category pie chart
        public async Task<List<TicketByCategoryDto>> GetTicketByCategoryAsync(
            DashboardFilterDto filter,
            int userId,
            string role)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyRoleFilter(query, userId, role);
            query = ApplyFilter(query, filter);

            var total = await query.CountAsync();
            if (total == 0) return new List<TicketByCategoryDto>();

            return await query
                .GroupBy(t => t.Category)
                .Select(g => new TicketByCategoryDto
                {
                    Category = g.Key,
                    Count = g.Count(),
                    Percentage = (double)g.Count() * 100 / total
                })
                .OrderByDescending(x => x.Count)
                .ToListAsync();
        }

        // ------------------------------------------------------------------------------------
        //  4. Danh sách ticket trong dashboard
        public async Task<List<TicketListDto>> GetFilteredTicketsAsync(
            DashboardFilterDto filter,
            int userId,
            string role)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyRoleFilter(query, userId, role);
            query = ApplyFilter(query, filter);

            return await query
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
        }

        // ------------------------------------------------------------------------------------
        //  5. SLA chung
        public async Task<SlaSummaryDto> GetSlaSummaryAsync(
            DashboardFilterDto filter,
            int userId,
            string role)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            query = ApplyRoleFilter(query, userId, role);
            query = ApplyFilter(query, filter);
            query = query.Where(t => t.Priority != null);

            var tickets = await query.ToListAsync();
            if (!tickets.Any())
                return new SlaSummaryDto();

            int total = tickets.Count;
            int countResponseOK = 0;
            int countProcessOK = 0;
            double totalRating = 0;

            foreach (var t in tickets)
            {
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
                    case "Thấp":        responseStd = 0.25; processStd = 2; break;
                    case "Trung bình":  responseStd = 0.34; processStd = 3; break;
                    case "Cao":         responseStd = 0.42; processStd = 8; break;
                    case "Khẩn cấp":    responseStd = 0.50; processStd = 32; break;
                }

                if (responseDuration.HasValue && responseDuration <= responseStd)
                    countResponseOK++;

                if (processDuration.HasValue && processDuration <= processStd)
                    countProcessOK++;

                if (t.UserRating.HasValue)
                    totalRating += t.UserRating.Value;
            }

            return new SlaSummaryDto
            {
                ResponseRate = Math.Round((double)countResponseOK / total, 3),
                ProcessRate = Math.Round((double)countProcessOK / total, 3),
                SatisfactionRate = Math.Round(totalRating / (5 * total), 3)
            };
        }
    }
}
