namespace BackendApi.Dtos.Ticket
{
    public class TicketListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Priority { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
