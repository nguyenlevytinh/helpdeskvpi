namespace BackendApi.Dtos.Dashboard
{
    public class SlaSummaryDto
    {
        public double ResponseRate { get; set; }  // Tỷ lệ phản hồi
        public double ProcessRate { get; set; }   // Tỷ lệ xử lý
        public double SatisfactionRate { get; set; } // Tỷ lệ hài lòng
    }
}
