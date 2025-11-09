using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BackendApi.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = "user"; // user, helpdesk, admin

        public string? Department { get; set; }

        // Navigation properties
        public ICollection<Ticket>? CreatedTickets { get; set; }
        public ICollection<Ticket>? AssignedTickets { get; set; }
        public ICollection<Ticket>? RequestedTickets { get; set; }
        public ICollection<Comment>? Comments { get; set; }
    }
}
