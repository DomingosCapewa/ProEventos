using System.Threading.Tasks;
using ProEventos.Domain;
using System.Collections.Generic; 
namespace ProEventos.Persistence.Contratos

{
    public interface IGeralPersist
    {
        
         void Add<T>(T entity) where T: class;
         void Update<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         void DeleteRange<T>(IEnumerable<T> entities) where T : class;

        
        Task<bool> SaveChangesAsync();
    
    }
}