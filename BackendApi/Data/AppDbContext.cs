using BackendApi.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace BackendApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketAttachment> TicketAttachments { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CommentAttachment> CommentAttachments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 🔹 Unique constraint cho Email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // 🔹 Quan hệ User - Ticket
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.CreatedByUser)
                .WithMany(u => u.CreatedTickets)
                .HasForeignKey(t => t.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.AssignedToUser)
                .WithMany(u => u.AssignedTickets)
                .HasForeignKey(t => t.AssignedTo)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.RequestedForUser)
                .WithMany(u => u.RequestedTickets)
                .HasForeignKey(t => t.RequestedFor)
                .OnDelete(DeleteBehavior.Restrict);

            // 🔹 Quan hệ Ticket - Comment
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Ticket)
                .WithMany(t => t.Comments)
                .HasForeignKey(c => c.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            // 🔹 Quan hệ Comment - User
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.CreatedByUser)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // 🔹 Mock data 3 user mẫu
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "user1@example.com",
                    FullName = "Normal User",
                    Role = "user",
                    Department = "Sales"
                },
                new User
                {
                    Id = 2,
                    Email = "helpdesk1@example.com",
                    FullName = "Helpdesk Agent",
                    Role = "helpdesk",
                    Department = "IT Support"
                },
                new User
                {
                    Id = 3,
                    Email = "admin1@example.com",
                    FullName = "System Admin",
                    Role = "admin",
                    Department = "Administration"
                }
            );
        }
    }
}
