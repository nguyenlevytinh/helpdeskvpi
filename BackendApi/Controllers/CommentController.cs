using BackendApi.Dtos.Comment;
using BackendApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace BackendApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentController(CommentService commentService)
        {
            _commentService = commentService;
        }

        private string GetUserEmail()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
            return jwt.Subject;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> AddComment([FromBody] CommentCreateDto dto)
        {
            var success = await _commentService.AddCommentAsync(dto, GetUserEmail());
            if (!success) return BadRequest("Invalid user or ticket");
            return Ok("Comment added successfully");
        }

        [HttpGet("List/{ticketId}")]
        public async Task<IActionResult> GetComments(int ticketId)
        {
            var comments = await _commentService.GetCommentsByTicketAsync(ticketId);
            return Ok(comments);
        }
    }
}
