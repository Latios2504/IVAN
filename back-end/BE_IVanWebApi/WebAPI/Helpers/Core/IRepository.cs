using Microsoft.Data.SqlClient;
using System.Linq.Expressions;

namespace WebAPI.Helpers.Core
{
    public interface IRepository<T>
    {
        void Insert(T entity);
        void Remove(IEnumerable<T> entities);
        void Remove(T entity);
        void Insert(IEnumerable<T> lstEntity);
        void Update(T entityToUpdate);
        void Update(IEnumerable<T> entityToUpdate);
        bool CheckExsist(Expression<Func<T, bool>> predicate, Ref<CheckError> checkError = null);
        int GetCount(Expression<Func<T, bool>> predicate, Ref<CheckError> checkError = null);
        T GetById(object id, Ref<CheckError> checkError = null);
        T GetOne(Expression<Func<T, bool>> predicate, Ref<CheckError> checkError = null);
        IEnumerable<T> Get(string storedProcedureName, SqlParameter[] parameters = null, Ref<CheckError> checkError = null);
        T GetOne(string storedProcedureName, SqlParameter[] parameters = null, Ref<CheckError> checkError = null);
        IEnumerable<SqlParameter> GetOutPut(string storedProcedureName, SqlParameter[] parameters, Ref<CheckError> checkError = null);
        IQueryable<T> FindAll(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties);
        bool Delete(object id, Ref<CheckError> checkError = null);
        bool Delete(T entity, Ref<CheckError> checkError = null);
        bool DeleteAll(IList<T> list, Ref<CheckError> checkError = null);
        IQueryable<T> GetQueryable();
        IQueryable<T> GetQueryable(Expression<Func<T, bool>> condition);
    }
}
