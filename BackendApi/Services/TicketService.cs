using BackendApi.Data;
using BackendApi.Dtos.Ticket;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Services
{
    public class TicketService
    {
        private readonly AppDbContext _context;

        public TicketService(AppDbContext context)
        {
            _context = context;
        }

        // Tạo ticket mới
        public async Task<TicketDetailDto?> CreateTicketAsync(TicketCreateDto dto, string createdByEmail)
        {
            var createdBy = await _context.Users.FirstOrDefaultAsync(u => u.Email == createdByEmail);
            var requestedFor = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.RequestedForEmail);

            if (createdBy == null) return null;

            var ticket = new Ticket
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                CreatedBy = createdBy.Id,
                RequestedFor = requestedFor?.Id ?? createdBy.Id,
                Status = "Chờ tiếp nhận",
                CreatedAt = DateTime.UtcNow
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            // Lưu attachments
            if (dto.AttachmentsBase64 != null && dto.AttachmentsBase64.Any())
            {
                foreach (var base64 in dto.AttachmentsBase64)
                {
                    _context.TicketAttachments.Add(new TicketAttachment
                    {
                        TicketId = ticket.Id,
                        Base64 = base64
                    });
                }
                await _context.SaveChangesAsync();
            }

            return await GetTicketDetailAsync(ticket.Id);
        }

        // Update ticket
        public async Task<bool> UpdateTicketAsync(int id, TicketUpdateDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return false;

            if (!string.IsNullOrEmpty(dto.Category))
                ticket.Category = dto.Category;

            if (!string.IsNullOrEmpty(dto.Difficulty))
                ticket.Difficulty = dto.Difficulty;

            if (!string.IsNullOrEmpty(dto.AssignedToEmail))
            {
                var assignedUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.AssignedToEmail);
                if (assignedUser == null) return false;
                ticket.AssignedTo = assignedUser.Id;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        // Đổi trạng thái
        public async Task<bool> ChangeStatusAsync(int id, string newStatus)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return false;

            ticket.Status = newStatus;
            await _context.SaveChangesAsync();
            return true;
        }

        // Feedback
        public async Task<bool> GiveFeedbackAsync(int id, TicketFeedbackDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return false;

            ticket.UserRating = dto.UserRating;
            ticket.UserFeedback = dto.UserFeedback;
            await _context.SaveChangesAsync();
            return true;
        }

        // Danh sách ticket (filter + search + pagination)
        public async Task<(List<TicketListDto>, int)> GetTicketsAsync(TicketFilterDto filter)
        {
            var query = _context.Tickets.AsQueryable();

            if (!string.IsNullOrEmpty(filter.Title))
                query = query.Where(t => t.Title.ToLower().Contains(filter.Title.ToLower())
                                         || t.Id.ToString().Contains(filter.Title));

            if (!string.IsNullOrEmpty(filter.Status))
                query = query.Where(t => t.Status == filter.Status);

            if (!string.IsNullOrEmpty(filter.Difficulty))
                query = query.Where(t => t.Difficulty == filter.Difficulty);

            var totalCount = await query.CountAsync();
            var tickets = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((filter.PageIndex - 1) * filter.PageSize)
                .Take(filter.PageSize)
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

            return (tickets, totalCount);
        }

        // 🟤 Chi tiết ticket
        public async Task<TicketDetailDto?> GetTicketDetailAsync(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Include(t => t.RequestedForUser)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null) return null;

            var attachments = await _context.TicketAttachments
                .Where(a => a.TicketId == id)
                .Select(a => a.Base64)
                .ToListAsync();

            return new TicketDetailDto
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Category = ticket.Category,
                SubCategory = ticket.SubCategory,
                Status = ticket.Status,
                Priority = ticket.Priority,
                Difficulty = ticket.Difficulty,
                AdminNote = ticket.AdminNote,
                AgentNote = ticket.AgentNote,
                CreatedBy = ticket.CreatedByUser?.Email,
                AssignedTo = ticket.AssignedToUser?.Email,
                RequestedFor = ticket.RequestedForUser?.Email,
                CreatedAt = ticket.CreatedAt,
                Attachments = attachments
            };
        }
    }
}
