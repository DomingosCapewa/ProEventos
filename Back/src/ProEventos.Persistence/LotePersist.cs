using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Contextos;

namespace ProEventos.Persistence
{
    public class LotePersist : ILotePersist
    {
        private readonly ProEventosContext _context;

        public LotePersist(ProEventosContext context)
        {
            _context = context;
        }

        // Corrigido para retornar um array de Lote
        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                         .Where(lote => lote.EventoId == eventoId); // Corrigido para 'EventoId' (verifique se a propriedade está correta)

            return await query.ToArrayAsync();           
        }

        // Corrigido para retornar um único Lote
        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int id)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                         .Where(lote => lote.EventoId == eventoId && lote.Id == id); // Corrigido para 'EventoId'

            return await query.FirstOrDefaultAsync();
        }
    }
}
