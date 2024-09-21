using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks; //assincrona
using Microsoft.AspNetCore.Mvc; //Api web
using Microsoft.Extensions.Logging; //inf sobre a app

using ProEventos.API.Models;
namespace ProEventos.API.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
    
        public IEnumerable<Evento> _evento = new Evento[]{ //estanciar um array
        
                new Evento(){
                    EventoId = 1,
                    Tema = "Angular 11 e .NET 5",
                    Local = "Belo Horizonte",
                    Lote= "1º Lote",
                    QtdPessoas = 250,
                    DataEvento = DateTime.Now.AddDays(2),
                    ImagemURL = "img.png"
                }, 
                new Evento(){
                    EventoId = 2,
                    Tema = "Angular 11 e .NET 5 e suas novidades",
                    Local = "Belo Horizonte",
                    Lote= "2º Lote",
                    QtdPessoas = 350,
                    DataEvento = DateTime.Now.AddDays(3), //tipar o valor
                    ImagemURL = "img.png"
                   
                },
                
                
            };
        public EventoController()
        {  
        }

        [HttpGet]
        public IEnumerable<Evento> Get()
        {
           return _evento;
        }
         [HttpGet("{id}")]
        public IEnumerable<Evento> GetById(int id)
        {
           return _evento.Where(evento => evento.EventoId == id );
        }

         [HttpPost]
        public String Post()
        {
            return "Exemplo de post";
        }
         [HttpPut("{id}")]
        public String Put(int id)
        {
            return $"Exemplo de Put com id = {id}";
        }
         [HttpDelete("{id}")]
        public String Delete(int id)
        {
            return $"Exemplo de Delete com id = {id}";
        }
    }
}
