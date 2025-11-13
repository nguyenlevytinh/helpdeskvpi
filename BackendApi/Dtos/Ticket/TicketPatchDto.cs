namespace BackendApi.Dtos.Ticket
{
    public class TicketPatchDto
    {
        public string? Status { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? RefusalReason { get; set; }
    }
}
