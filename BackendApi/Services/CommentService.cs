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
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == createdByEmail);

            if (user == null) return false;

            var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == dto.TicketId);
            if (!ticketExists) return false;

            var comment = new Comment
            {
                TicketId = dto.TicketId,
                CreatedBy = user.Id,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            // 🟡 Lưu attachments
            if (dto.AttachmentsBase64 != null)
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

        // 🟡 Lấy danh sách comment theo ticket
        public async Task<List<CommentListDto>> GetCommentsByTicketAsync(int ticketId)
        {
            var comments = await _context.Comments
                .Where(c => c.TicketId == ticketId)
                .Include(c => c.CreatedByUser)     // JOIN User
                .Include(c => c.Attachments)       // JOIN CommentAttachments
                .OrderBy(c => c.CreatedAt)
                .Select(c => new CommentListDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt,
                    CreatedBy = c.CreatedByUser.Email,
                    CreatedByFullName = c.CreatedByUser.FullName,

                    Attachments = c.Attachments
                        .Select(a => new CommentAttachmentDto
                        {
                            Id = a.Id,
                            Base64 = a.Base64
                        }).ToList()
                })
                .ToListAsync();

            return comments;
        }
    }
}
