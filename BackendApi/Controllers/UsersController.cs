using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendApi.Data;  
using BackendApi.Models;

namespace BackendApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Search users by email (autocomplete for assigning ticket)
        /// </summary>
        /// <param name="query">Keyword to search in email</param>
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(new List<string>());

            var emails = await _context.Users
                .Where(u => u.Email.Contains(query))
                .OrderBy(u => u.Email)
                .Select(u => u.Email)
                .Take(10)
                .ToListAsync();

            return Ok(emails);
        }
    }
}
