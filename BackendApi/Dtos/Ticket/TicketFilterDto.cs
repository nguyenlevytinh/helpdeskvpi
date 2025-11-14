namespace BackendApi.Dtos.Ticket
{
    public class TicketFilterDto
    {
        public string? Title { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
