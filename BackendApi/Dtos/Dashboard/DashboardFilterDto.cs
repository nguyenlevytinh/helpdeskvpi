namespace BackendApi.Dtos.Dashboard
{
    public class DashboardFilterDto
    {
        public string? Department { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Category { get; set; }
        public string? Email { get; set; }
    }
}
