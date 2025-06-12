using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Linq.Expressions;

namespace WebAPI.Helpers.Core
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly DbSet<T> _dbSet;
        private readonly DbContext _dbContext;

        public Repository(DbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<T>();
        }

        public virtual void Insert(T entity)
        {
            _dbSet.Add(entity);
        }

        public virtual void Remove(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
        }

        public virtual void Remove(T entity)
        {
            _dbSet.Remove(entity);
        }

        public virtual void Insert(IEnumerable<T> lstEntity)
        {
            foreach (var item in lstEntity)
            {
                _dbSet.Add(item);
            }
        }

        public virtual void Update(IEnumerable<T> entityToUpdate)
        {
            _dbContext.ChangeTracker.Clear();////
            foreach (var item in entityToUpdate)
            {
                _dbSet.Attach(item);
                _dbContext.Entry(item).State = EntityState.Modified;
            }
        }

        public virtual void Update(T entityToUpdate)
        {
            _dbContext.ChangeTracker.Clear();//
            _dbSet.Attach(entityToUpdate);
            _dbContext.Entry(entityToUpdate).State = EntityState.Modified;
        }

        public virtual bool CheckExsist(Expression<Func<T, bool>> predicate, Ref<CheckError> checkError = null)
        {
            try
            {
                return _dbContext.Set<T>().Any(predicate);
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                return false;
            }
        }

        public virtual int GetCount(Expression<Func<T, bool>> predicate, Ref<CheckError> checkError = null)
        {
            try
            {
                return _dbContext.Set<T>().Where(predicate).Count();
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                return -1;
            }
        }

        public virtual T GetById(object id, Ref<CheckError> checkError = null)
        {
            try
            {
                if (id == null) return null;
                return _dbContext.Set<T>().Find(id);
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                throw ex;
            }
        }

        public virtual T GetOne(Expression<Func<T, bool>> predicate, Ref<CheckError> checkError = null)
        {
            try
            {
                return  _dbContext.Set<T>().Where(predicate).FirstOrDefault();
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                return null;
            }
        }

        public virtual  IEnumerable<T> Get(string storedProcedureName, SqlParameter[] parameters = null, Ref<CheckError> checkError = null)
        {
            try
            {
                if (parameters != null)
                {
                    var query = string.Concat("Exec ", storedProcedureName, " ");
                    foreach (var item in parameters)
                    {
                        if (item.Direction != ParameterDirection.Output)
                        {
                            query += string.Concat(item.ParameterName, ",");
                        }
                        else
                        {
                            query += string.Concat(item.ParameterName + "OUTPUT", ",");
                        }
                    }
                    query = parameters.Length > 0 ? query.Substring(0, query.Length - 1) : storedProcedureName;

                    return _dbSet.FromSqlRaw(query, parameters).ToList();
                }
                else
                {
                    return _dbSet.FromSqlRaw(storedProcedureName).ToList();
                }
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                return null;
            }
        }

        public virtual T GetOne(string storedProcedureName, SqlParameter[] parameters = null, Ref<CheckError> checkError = null)
        {
            try
            {
                if (parameters != null)
                {
                    var query = string.Concat("EXEC ", storedProcedureName, " ");
                    foreach (var item in parameters)
                    {
                        var itemObject = item;
                        query += string.Concat(itemObject.ParameterName, ",");
                    }
                    query = parameters.Length > 0 ? query.Substring(0, query.Length - 1) : storedProcedureName;

                    return  _dbSet.FromSqlRaw(query, parameters).FirstOrDefault();
                }
                else
                {
                    return  _dbSet.FromSqlRaw(storedProcedureName).FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                return null;
            }
        }

        public virtual IEnumerable<SqlParameter> GetOutPut(string storedProcedureName, SqlParameter[] parameters, Ref<CheckError> checkError = null)
        {
            try
            {
                if (parameters != null)
                {
                    var query = string.Concat("", storedProcedureName, "");
                    var listParameterOutPut = new List<SqlParameter>();
                    foreach (var item in parameters)
                    {
                        var itemObject = item;
                        if (itemObject.Direction == ParameterDirection.Output)
                        {
                            listParameterOutPut.Add(itemObject);
                            query += string.Concat(itemObject.ParameterName, " OUT,");
                        }
                        else
                        {
                            query += string.Concat(itemObject.ParameterName, ",");
                        }
                    }
                    query = parameters.Length > 0 ? query.Substring(0, query.Length - 1) : storedProcedureName;

                    _dbContext.Database.ExecuteSqlRaw(query, parameters);

                    return listParameterOutPut;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                return null;
            }
        }

        public IQueryable<T> FindAll(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includeProperties)
        {
            IQueryable<T> items = _dbContext.Set<T>();
            if (includeProperties != null)
            {
                foreach (var includeProperty in includeProperties)
                {
                    items = items.Include(includeProperty);
                }
            }
            return items.Where(predicate);
        }

        public bool Delete(T entity, Ref<CheckError> checkError = null)
        {
            try
            {
                _dbContext.Set<T>().Remove(entity);
                return _dbContext.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                return false;
            }
        }

        public bool Delete(object id, Ref<CheckError> checkError = null)
        {
            try
            {
                T entity = GetById(id);
                if (entity != null)
                {
                    _dbContext.Set<T>().Remove(entity);
                    return _dbContext.SaveChanges() > 0;
                }
                return true;
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                return false;
            }
        }

        public bool DeleteAll(IList<T> list, Ref<CheckError> checkError = null)
        {
            try
            {
                _dbContext.Set<T>().RemoveRange(list);
                return _dbContext.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                if (checkError != null)
                {
                    checkError.Value = new CheckError() { IsError = true, Exception = ex, Message = ex.Message };
                }
                return false;
            }
        }

        public virtual IQueryable<T> GetQueryable()
        {
            return _dbContext.Set<T>();
        }

        public virtual IQueryable<T> GetQueryable(Expression<Func<T, bool>> condition)
        {
            return _dbSet.Where(condition);
        }
    }
}
