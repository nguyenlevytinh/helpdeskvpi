using BackendApi.Dtos.Dashboard;
using BackendApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("TicketCountByStatus")]
        public async Task<IActionResult> GetTicketCountByStatus([FromQuery] DashboardFilterDto filter)
        {
            var data = await _dashboardService.GetTicketCountByStatusAsync(filter);
            return Ok(data);
        }

        [HttpGet("TicketByMonth")]
        public async Task<IActionResult> GetTicketByMonth([FromQuery] DashboardFilterDto filter)
        {
            var data = await _dashboardService.GetTicketByMonthAsync(filter);
            return Ok(data);
        }

        [HttpGet("TicketByCategory")]
        public async Task<IActionResult> GetTicketByCategory([FromQuery] DashboardFilterDto filter)
        {
            var data = await _dashboardService.GetTicketByCategoryAsync(filter);
            return Ok(data);
        }

        [HttpGet("TicketList")]
        public async Task<IActionResult> GetFilteredTickets([FromQuery] DashboardFilterDto filter)
        {
            var data = await _dashboardService.GetFilteredTicketsAsync(filter);
            return Ok(data);
        }

        [HttpGet("SLA")]
        public async Task<IActionResult> GetSlaSummary([FromQuery] string period = "month")
        {
            var result = await _dashboardService.GetSlaSummaryByPeriodAsync(period);
            return Ok(result);
        }

    }
}
