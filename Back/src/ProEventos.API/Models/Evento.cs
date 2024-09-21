using System;
namespace ProEventos.API.Models

{
    public class Evento
    {
        public int EventoId { get; set; }
        public string Local {get; set; }
        public DateTime DataEvento {get; set; }
        public string Tema {get; set; }
        public int QtdPessoas {get; set; }
        public string Lote {get; set; }
        public string  ImagemURL {get; set; }
    
    }
} //como é composta uma classe
//classe public privada e abstrata 

// dados que são enviados e recebidos nas requisições HTTP.