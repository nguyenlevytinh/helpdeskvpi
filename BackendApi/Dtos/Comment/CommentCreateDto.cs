namespace BackendApi.Dtos.Comment
{
    public class CommentCreateDto
    {
        public int TicketId { get; set; }
        public string Content { get; set; } = string.Empty;
        public List<string>? AttachmentsBase64 { get; set; }
    }
}
