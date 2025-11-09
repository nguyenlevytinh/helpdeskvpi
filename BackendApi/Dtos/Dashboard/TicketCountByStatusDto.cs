namespace BackendApi.Dtos.Dashboard
{
    public class TicketCountByStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
