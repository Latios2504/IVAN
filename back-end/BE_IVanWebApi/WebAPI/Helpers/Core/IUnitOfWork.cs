using Microsoft.EntityFrameworkCore.Storage;
using WebAPI.Data.Entities;

namespace WebAPI.Helpers.Core
{
    public interface IUnitOfWork
    {
        IRepository<OrganizationProfile> OrganizationProfile { get; }

        int Commit();
        Task<int> CommitAsync(CancellationToken cancellationToken = default(CancellationToken));
        IDbContextTransaction BeginTransactionScope();
    }
}
