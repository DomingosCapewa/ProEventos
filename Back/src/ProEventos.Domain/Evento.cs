using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;


namespace ProEventos.Domain

{

    [Table("EventosDetalhes")]
    public class Evento
    {
        public int Id { get; set; }
        public string Local {get; set; }
        public DateTime? DataEvento {get; set; }
        public string Tema {get; set; }
        public int QtdPessoas {get; set; }
        public string Lote {get; set; }
        public string  ImagemURL {get; set; }
        public string Telefone {get; set;}
        public string Email {get; set;}
        public IEnumerable<Lote> Lotes {get; set;}
        public IEnumerable<RedeSocial> RedesSociais {get; set;} 
        public IEnumerable<PalestranteEvento> PalestrantesEventos {get; set;}
        
    } 

    //estudar sobre heranças
    //list
    //IEnumerable
    //QUeryble
    //FirstOrDefaul()

}


// dados que são enviados e recebidos nas requisições HTTP.
 //Interfaces e classes abstratas ajudam a organizar e reutilizar o código na programação orientada a objetos.
//Entity Framework Tutorial