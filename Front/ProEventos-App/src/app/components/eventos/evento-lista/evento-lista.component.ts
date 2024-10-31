import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/Services/eventos.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {
  modalRef = {} as BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  public eventoId = 0;

  largulaImgem = 130;
  margemImagem = 2;
  exibirImagem = true;
  private filtroListado = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.spinner.show();
    this.carregarEventos();
  }

  public get filtroLista() {
    return this.filtroListado;
  }

  public set filtroLista(value: string) {
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: Evento) =>
        evento.tema.toLocaleLowerCase().includes(filtrarPor) ||
        evento.local.toLocaleLowerCase().includes(filtrarPor) ||
        evento.lote.toLocaleLowerCase().includes(filtrarPor)
    );
  }

  public alterarImagem() {
    this.exibirImagem = !this.exibirImagem;
  }

  public carregarEventos(): void {
    const timeoutDuration = 3000;
    const hideSpinner = setTimeout(() => {
      this.spinner.hide();
    }, timeoutDuration);

    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log(error);
        this.toastr.error('Erro ao carregar os Eventos', 'Erro!');
      },
      complete: () => {
        clearTimeout(hideSpinner);
        this.spinner.hide();
      },
    });
  }

  public openModal(template: TemplateRef<any>, eventoId: number): void {
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public confirm(): void {
    this.modalRef.hide();
    this.spinner.show(); // Exibe o spinner

    this.eventoService.deleteEvento(this.eventoId).subscribe({
        next: (result: any) => {
            console.log(result);
            this.toastr.success('O evento foi deletado com sucesso', 'Deletado!');
            this.carregarEventos(); // Atualiza a lista de eventos
        },
        error: (error: any) => {
            console.error(error);
            this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro');
        }
    }).add(() => this.spinner.hide());
}
  

  // private carregarEventos() {
  //   this.eventos = this.eventos.filter(evento => evento.id !== this.eventoId);
  //   this.eventosFiltrados = this.filtrarEventos(this.filtroLista);
  // }

  public decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
