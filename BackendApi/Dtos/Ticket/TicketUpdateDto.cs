namespace BackendApi.Dtos.Ticket
{
    public class TicketUpdateDto
    {
        public string? Category { get; set; }
        public string? Subcategory { get; set; }
        public string? Difficulty { get; set; }
        public string? AssignedToEmail { get; set; }
    }
}
