namespace BackendApi.Dtos.Ticket
{
    public class TicketListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Difficulty { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
