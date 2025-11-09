namespace BackendApi.Dtos.Dashboard
{
    public class TicketByCategoryDto
    {
        public string Category { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
