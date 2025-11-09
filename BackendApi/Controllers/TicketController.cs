using BackendApi.Dtos.Ticket;
using BackendApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace BackendApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketController : ControllerBase
    {
        private readonly TicketService _ticketService;

        public TicketController(TicketService ticketService)
        {
            _ticketService = ticketService;
        }

        private string GetUserEmail()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token);
            return jwt.Subject;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateTicket([FromBody] TicketCreateDto dto)
        {
            var result = await _ticketService.CreateTicketAsync(dto, GetUserEmail());
            if (result == null) return BadRequest("Invalid user or requestedFor email");
            return Ok(result);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] TicketUpdateDto dto)
        {
            var success = await _ticketService.UpdateTicketAsync(id, dto);
            if (!success) return NotFound("Ticket not found or invalid AssignedToEmail");
            return Ok("Updated successfully");
        }

        [HttpPatch("Status/{id}")]
        public async Task<IActionResult> ChangeStatus(int id, [FromQuery] string status)
        {
            var success = await _ticketService.ChangeStatusAsync(id, status);
            if (!success) return NotFound("Ticket not found");
            return Ok("Status updated");
        }

        [HttpPost("Feedback/{id}")]
        public async Task<IActionResult> GiveFeedback(int id, [FromBody] TicketFeedbackDto dto)
        {
            var success = await _ticketService.GiveFeedbackAsync(id, dto);
            if (!success) return NotFound("Ticket not found");
            return Ok("Feedback recorded");
        }

        [HttpGet("List")]
        public async Task<IActionResult> GetTickets([FromQuery] TicketFilterDto filter)
        {
            var (tickets, total) = await _ticketService.GetTicketsAsync(filter);
            return Ok(new { TotalCount = total, Data = tickets });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketDetail(int id)
        {
            var ticket = await _ticketService.GetTicketDetailAsync(id);
            if (ticket == null) return NotFound();
            return Ok(ticket);
        }
    }
}
