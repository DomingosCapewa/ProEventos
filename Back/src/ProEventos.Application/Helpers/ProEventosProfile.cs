using AutoMapper;
using ProEventos.Application.Helpers;
using ProEventos.Domain;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Helpers

{
    public class ProEventosProfile : Profile
{
    public ProEventosProfile()
    {
        CreateMap<Evento, EventoDto>().ReverseMap();
        CreateMap<Lote, LoteDto>().ReverseMap();
        CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
        CreateMap<Palestrante, PalestranteDto>().ReverseMap();

    }
}

}