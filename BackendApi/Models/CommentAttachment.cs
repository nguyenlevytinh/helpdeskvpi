using System.ComponentModel.DataAnnotations.Schema;

namespace BackendApi.Models
{
    public class CommentAttachment
    {
        public int Id { get; set; }

        [ForeignKey("Comment")]
        public int CommentId { get; set; }

        public string Base64 { get; set; } = string.Empty;

        public Comment? Comment { get; set; }
    }
}
