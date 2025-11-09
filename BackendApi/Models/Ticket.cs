using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? SubCategory { get; set; }
        public string? Category { get; set; }

        [ForeignKey("CreatedByUser")]
        public int CreatedBy { get; set; }

        [ForeignKey("AssignedToUser")]
        public int? AssignedTo { get; set; }

        [ForeignKey("RequestedForUser")]
        public int? RequestedFor { get; set; }

        public string Status { get; set; } = "Chờ tiếp nhận";
        public string? RefusalReason { get; set; }
        public string? AdminNote { get; set; }
        public string? AgentNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }

        public string? Priority { get; set; }
        public string? Difficulty { get; set; }

        public int? UserRating { get; set; }
        public string? UserFeedback { get; set; }

        // Navigation properties
        public User? CreatedByUser { get; set; }
        public User? AssignedToUser { get; set; }
        public User? RequestedForUser { get; set; }

        public ICollection<TicketAttachment>? Attachments { get; set; }
        public ICollection<Comment>? Comments { get; set; }
    }
}
