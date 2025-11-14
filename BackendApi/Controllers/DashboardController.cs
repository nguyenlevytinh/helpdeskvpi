using BackendApi.Dtos.Dashboard;
using BackendApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackendApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // Lấy userId và role từ JWT
        private (int userId, string role) GetUserInfo()
        {
            var userId = int.Parse(User.FindFirstValue("id"));
            var role = User.FindFirstValue(ClaimTypes.Role) 
                       ?? User.FindFirstValue("role") 
                       ?? "User";

            return (userId, role);
        }

        // ---------------------------------------------------------------------------------------
        [HttpGet("TicketCountByStatus")]
        public async Task<IActionResult> GetTicketCountByStatus([FromQuery] DashboardFilterDto filter)
        {
            var (userId, role) = GetUserInfo();
            var data = await _dashboardService.GetTicketCountByStatusAsync(filter, userId, role);
            return Ok(data);
        }

        // ---------------------------------------------------------------------------------------
        [HttpGet("TicketByMonth")]
        public async Task<IActionResult> GetTicketByMonth([FromQuery] DashboardFilterDto filter)
        {
            var (userId, role) = GetUserInfo();
            var data = await _dashboardService.GetTicketByMonthAsync(filter, userId, role);
            return Ok(data);
        }

        // ---------------------------------------------------------------------------------------
        [HttpGet("TicketByCategory")]
        public async Task<IActionResult> GetTicketByCategory([FromQuery] DashboardFilterDto filter)
        {
            var (userId, role) = GetUserInfo();
            var data = await _dashboardService.GetTicketByCategoryAsync(filter, userId, role);
            return Ok(data);
        }

        // ---------------------------------------------------------------------------------------
        [HttpGet("TicketList")]
        public async Task<IActionResult> GetFilteredTickets([FromQuery] DashboardFilterDto filter)
        {
            var (userId, role) = GetUserInfo();
            var data = await _dashboardService.GetFilteredTicketsAsync(filter, userId, role);
            return Ok(data);
        }

        // ---------------------------------------------------------------------------------------
        [HttpGet("SLA")]
        public async Task<IActionResult> GetSlaSummary(
            [FromQuery] DashboardFilterDto filter,
            [FromQuery] string period = "month")
        {
            var (userId, role) = GetUserInfo();
            var data = await _dashboardService.GetSlaSummaryAsync(filter, userId, role);
            return Ok(data);
        }
    }
}
