namespace BackendApi.Dtos.Comment
{
    public class CommentAttachmentDto
    {
        public int Id { get; set; }
        public string Base64 { get; set; } = string.Empty;
    }
}
