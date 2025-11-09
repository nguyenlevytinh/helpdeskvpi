namespace BackendApi.Dtos.Dashboard
{
    public class TicketByMonthDto
    {
        public string Month { get; set; } = string.Empty; // e.g., "2025-01"
        public int Count { get; set; }
    }
}
