namespace BackendApi.Dtos.Comment
{
    public class CommentListDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<string>? Attachments { get; set; }
    }
}
