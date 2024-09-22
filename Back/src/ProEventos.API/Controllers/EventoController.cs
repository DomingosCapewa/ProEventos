using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks; //assincrona
using Microsoft.AspNetCore.Mvc; //Api web
using Microsoft.Extensions.Logging; //inf sobre a app

using ProEventos.API.Models;
using ProEventos.API.Data;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly DataContext _context;

        public EventoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
            return _context.Eventos;
        }

        [HttpGet("{id}")]
        public Evento GetById(int id)
        {
            return _context.Eventos.FirstOrDefault(evento => evento.EventoId == id);
            
        }

        [HttpPost]
        public IActionResult Post(Evento evento)
        {
            _context.Eventos.Add(evento);
            _context.SaveChanges();
            return Ok(evento);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, Evento evento)
        {
            var eventoExistente = _context.Eventos.FirstOrDefault(e => e.EventoId == id);
            if (eventoExistente == null) return NotFound();

            eventoExistente.Nome = evento.Nome;
            // Atualizar outros campos conforme necessário

            _context.SaveChanges();
            return Ok(eventoExistente);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var evento = _context.Eventos.FirstOrDefault(e => e.EventoId == id);
            if (evento == null) return NotFound();

            _context.Eventos.Remove(evento);
            _context.SaveChanges();
            return Ok();
        }
    }
}
