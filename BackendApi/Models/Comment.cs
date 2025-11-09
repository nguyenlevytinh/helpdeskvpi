using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    public class Comment
    {
        public int Id { get; set; }

        [ForeignKey("Ticket")]
        public int TicketId { get; set; }

        [ForeignKey("CreatedByUser")]
        public int CreatedBy { get; set; }

        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Ticket? Ticket { get; set; }
        public User? CreatedByUser { get; set; }

        public ICollection<CommentAttachment>? Attachments { get; set; }
    }
}
