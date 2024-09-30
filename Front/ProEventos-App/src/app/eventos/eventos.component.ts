import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

public eventos: any = [];
public eventosFiltrados:any = [];
largulaImgem= 130;
 margemImagem= 2;
 exibirImagem = true;
 private _filtroLista = '';

 public get filtroLista() {
  return this._filtroLista;
 }

 public set filtroLista(value:string){
  this._filtroLista = value;
  this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
 }

 filtrarEventos(filtrarPor: string): any{
  filtrarPor = filtrarPor.toLocaleLowerCase();
  return this.eventos.filter(
    (evento:any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
    evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
    evento.lote.toLocaleLowerCase().indexOf(filtrarPor) !== -1
  )
 }
  constructor(private http: HttpClient) { /*client é armazenado na propriedade http*/ }

  ngOnInit(): void {
    this.getEventos();
  }

  alterarImagem(){
    this.exibirImagem = !this.exibirImagem;
  }
  public getEventos(): void {

      this.http.get('https://localhost:5001/api/eventos').subscribe(
        response => {
          this.eventos = response;
        this.eventosFiltrados = this.eventos},
        error => console.log(error),

      );
  }

}