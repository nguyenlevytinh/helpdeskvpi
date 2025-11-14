using BackendApi.Dtos.Ticket;
using BackendApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        // Lấy email từ JWT
        private string GetUserEmail()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("email")
                ?? User.Identity.Name
                ?? "";
        }

        // Lấy userId từ JWT
        private int GetUserId()
        {
            var id = User.FindFirstValue("id");
            return id != null ? int.Parse(id) : 0;
        }

        // Lấy role từ JWT
        private string GetUserRole()
        {
            return User.FindFirstValue(ClaimTypes.Role)
                ?? User.FindFirstValue("role")
                ?? "User";
        }

        // ---------------------------------------------
        [HttpPost("Create")]
        public async Task<IActionResult> CreateTicket([FromBody] TicketCreateDto dto)
        {
            var email = GetUserEmail();
            var result = await _ticketService.CreateTicketAsync(dto, email);

            if (result == null)
                return BadRequest("Invalid user or RequestedFor email");

            return Ok(result);
        }

        // ---------------------------------------------
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateTicket(int id, [FromBody] TicketUpdateDto dto)
        {
            var success = await _ticketService.UpdateTicketAsync(id, dto);

            if (!success)
                return NotFound("Ticket not found or invalid AssignedToEmail");

            return Ok("Updated successfully");
        }

        // ---------------------------------------------
        [HttpPatch("Status/{id}")]
        public async Task<IActionResult> ChangeStatus(int id, [FromBody] TicketPatchDto dto)
        {
            var success = await _ticketService.ChangeStatusAsync(id, dto);

            if (!success)
                return NotFound("Ticket not found");

            return Ok("Status updated");
        }

        // ---------------------------------------------
        [HttpPatch("AgentNote/{id}")]
        public async Task<IActionResult> UpdateAgentNote(int id, [FromBody] AgentNoteDto dto)
        {
            var success = await _ticketService.UpdateAgentNoteAsync(id, dto);

            if (!success)
                return NotFound("Ticket not found");

            return Ok("Agent note updated");
        }

        // ---------------------------------------------
        [HttpPost("Feedback/{id}")]
        public async Task<IActionResult> GiveFeedback(int id, [FromBody] TicketFeedbackDto dto)
        {
            var success = await _ticketService.GiveFeedbackAsync(id, dto);

            if (!success)
                return NotFound("Ticket not found");

            return Ok("Feedback recorded");
        }

        // ---------------------------------------------
        // LIST + FILTER + PAGINATION + ROLE FILTER
        [HttpGet("List")]
        public async Task<IActionResult> GetTickets([FromQuery] TicketFilterDto filter)
        {
            var userId = GetUserId();
            var role = GetUserRole();

            var (tickets, total) = await _ticketService.GetTicketsAsync(filter, userId, role);

            return Ok(new
            {
                TotalCount = total,
                Data = tickets
            });
        }

        // ---------------------------------------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketDetail(int id)
        {
            var ticket = await _ticketService.GetTicketDetailAsync(id);

            if (ticket == null)
                return NotFound();

            return Ok(ticket);
        }
    }
}
