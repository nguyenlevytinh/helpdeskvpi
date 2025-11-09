namespace BackendApi.Dtos.Ticket
{
    public class TicketCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? RequestedForEmail { get; set; } = string.Empty;
        public List<string> AttachmentsBase64 { get; set; } = new List<string>();
    }
}
