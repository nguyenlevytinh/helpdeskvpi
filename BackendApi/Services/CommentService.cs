using BackendApi.Data;
using BackendApi.Dtos.Comment;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Services
{
    public class CommentService
    {
        private readonly AppDbContext _context;

        public CommentService(AppDbContext context)
        {
            _context = context;
        }

        // 🟢 Thêm comment mới
        public async Task<bool> AddCommentAsync(CommentCreateDto dto, string createdByEmail)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == createdByEmail);
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == dto.TicketId);

            if (user == null || ticket == null) return false;

            var comment = new Comment
            {
                TicketId = dto.TicketId,
                CreatedBy = user.Id,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            // attachments
            if (dto.AttachmentsBase64 != null && dto.AttachmentsBase64.Any())
            {
                foreach (var base64 in dto.AttachmentsBase64)
                {
                    _context.CommentAttachments.Add(new CommentAttachment
                    {
                        CommentId = comment.Id,
                        Base64 = base64
                    });
                }
                await _context.SaveChangesAsync();
            }

            return true;
        }

        // 🟡 Danh sách comment của 1 ticket
        public async Task<List<CommentListDto>> GetCommentsByTicketAsync(int ticketId)
        {
            var comments = await _context.Comments
                .Where(c => c.TicketId == ticketId)
                .Include(c => c.CreatedByUser)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            var result = new List<CommentListDto>();

            foreach (var c in comments)
            {
                var attachments = await _context.CommentAttachments
                    .Where(a => a.CommentId == c.Id)
                    .Select(a => a.Base64)
                    .ToListAsync();

                result.Add(new CommentListDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedBy = c.CreatedByUser?.Email ?? "Unknown",
                    CreatedAt = c.CreatedAt,
                    Attachments = attachments
                });
            }

            return result;
        }
    }
}
