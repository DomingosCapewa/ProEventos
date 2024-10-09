import { Evento } from "./Evento";

export interface Lote {
   id: number;
   nome: string;
   preco: number;
   dataInicio?: Date;
   dataFim?: Date;
   qualidade: number;
   eventoId: number;
   evento: number;
}
