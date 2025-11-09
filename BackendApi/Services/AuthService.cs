using BackendApi.Data;
using BackendApi.Dtos.Auth;
using BackendApi.Helpers;
using BackendApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendApi.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        // simple in-memory refresh token storage (can move to DB)
        private static readonly Dictionary<string, string> _refreshTokens = new();

        public AuthService(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return null;

            var accessToken = _jwtHelper.GenerateAccessToken(user);
            var refreshToken = _jwtHelper.GenerateRefreshToken();

            _refreshTokens[user.Email] = refreshToken;

            return new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddHours(2)
            };
        }

        public async Task<CurrentUserDto?> GetCurrentUserAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return null;

            return new CurrentUserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                Department = user.Department ?? string.Empty
            };
        }

        public async Task<LoginResponseDto?> RefreshTokenAsync(RefreshTokenDto dto)
        {
            var userEmail = _refreshTokens.FirstOrDefault(x => x.Value == dto.RefreshToken).Key;
            if (string.IsNullOrEmpty(userEmail)) return null;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null) return null;

            var newAccessToken = _jwtHelper.GenerateAccessToken(user);
            var newRefreshToken = _jwtHelper.GenerateRefreshToken();

            _refreshTokens[userEmail] = newRefreshToken;

            return new LoginResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                Expiration = DateTime.UtcNow.AddHours(2)
            };
        }
    }
}
