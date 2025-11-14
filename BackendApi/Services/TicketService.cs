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

        // Role filtering logic
        private IQueryable<Ticket> ApplyRoleFilter(IQueryable<Ticket> query, int userId, string role)
        {
            return role switch
            {
                "Admin" => query,
                "Helpdesk" => query.Where(t => t.AssignedTo == userId),
                _ => query.Where(t => t.CreatedBy == userId),
            };
        }

        // Create ticket
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

            // Save attachments
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

            if (!string.IsNullOrEmpty(dto.Subcategory))
                ticket.SubCategory = dto.Subcategory;

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

        // Change status
        public async Task<bool> ChangeStatusAsync(int id, TicketPatchDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return false;

            ticket.Status = dto.Status ?? ticket.Status;
            ticket.AcceptedAt = dto.AcceptedAt ?? ticket.AcceptedAt;
            ticket.ResolvedAt = dto.ResolvedAt ?? ticket.ResolvedAt;
            ticket.CompletedAt = dto.CompletedAt ?? ticket.CompletedAt;
            ticket.RefusalReason = dto.RefusalReason ?? ticket.RefusalReason;

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

        // Update agent note
        public async Task<bool> UpdateAgentNoteAsync(int id, AgentNoteDto dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return false;

            ticket.AgentNote = dto.AgentNote;

            await _context.SaveChangesAsync();
            return true;
        }

        // Get ticket list (search + filter + pagination + role filtering)
        public async Task<(List<TicketListDto>, int)> GetTicketsAsync(
            TicketFilterDto filter,
            int userId,
            string role)
        {
            var query = _context.Tickets
                .Include(t => t.CreatedByUser)
                .AsQueryable();

            // Apply role permissions
            query = ApplyRoleFilter(query, userId, role);

            // Search by Title or Id
            if (!string.IsNullOrEmpty(filter.Title))
            {
                query = query.Where(t =>
                    t.Title.ToLower().Contains(filter.Title.ToLower()) ||
                    t.Id.ToString().Contains(filter.Title)
                );
            }

            // Filter by status
            if (!string.IsNullOrEmpty(filter.Status))
            {
                query = query.Where(t => t.Status == filter.Status);
            }

            // Filter by priority
            if (!string.IsNullOrEmpty(filter.Priority))
            {
                query = query.Where(t => t.Priority == filter.Priority);
            }

            // Total records
            var totalCount = await query.CountAsync();

            // Sort by CreatedAt (newest to oldest) and apply pagination
            var tickets = await query
                .OrderByDescending(t => t.CreatedAt) // Sort by CreatedAt descending
                .Skip((filter.PageIndex - 1) * filter.PageSize)
                .Take(filter.PageSize)
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

            return (tickets, totalCount);
        }

        // Get ticket detail
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
                Department = ticket.RequestedForUser?.Department,
                CreatedAt = ticket.CreatedAt,
                Attachments = attachments,
                UserRating = ticket.UserRating,
                Feedback = ticket.UserFeedback
            };
        }
    }
}
