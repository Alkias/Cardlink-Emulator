using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using CardLinkEmulator.DAL.Entities;

namespace CardLinkEmulator.DAL
{
    public class EmulatorContext : DbContext
    {
        public EmulatorContext() : base("EmulatorContext") { }

        public DbSet<Payment> Payment { get; set; }

        protected override void OnModelCreating (DbModelBuilder modelBuilder) {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}