using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using WebAPI.Data.Entities;

namespace WebAPI.Helpers.Core
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly DbContext _dbContext;
        public virtual IRepository<OrganizationProfile> OrganizationProfile { get; }

        public UnitOfWork(DbContext dbContext,
            IRepository<OrganizationProfile> organizationProfile)
        {
            _dbContext = dbContext;
            OrganizationProfile = organizationProfile;
        }

        public IDbContextTransaction BeginTransactionScope()
        {
            return _dbContext.Database.BeginTransaction();
        }
        public int Commit()
        {
            return _dbContext.SaveChanges();
        }

        public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
