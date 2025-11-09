using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    public class TicketAttachment
    {
        public int Id { get; set; }

        [ForeignKey("Ticket")]
        public int TicketId { get; set; }
        public string Base64 { get; set; } = string.Empty;

        public Ticket? Ticket { get; set; }
    }
}
