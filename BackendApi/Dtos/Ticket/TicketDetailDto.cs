namespace BackendApi.Dtos.Ticket
{
    public class TicketDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? SubCategory { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Priority { get; set; }
        public string? Difficulty { get; set; }
        public string? AdminNote { get; set; }
        public string? AgentNote { get; set; }
        public string? CreatedBy { get; set; }
        public string? AssignedTo { get; set; }
        public string? RequestedFor { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string>? Attachments { get; set; }
    }
}
