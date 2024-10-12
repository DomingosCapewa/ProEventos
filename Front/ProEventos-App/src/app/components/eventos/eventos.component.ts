import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../../Services/eventos.service';
import { Evento } from '../../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss'],
})
export class EventosComponent implements OnInit {
  modalRef = {} as BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados: Evento[] = [];
  largulaImgem = 130;
  margemImagem = 2;
  exibirImagem = true;
  private filtroListado = '';

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
        evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
        evento.lote.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  public ngOnInit(): void {
    this.spinner.show();
    this.getEventos();
  }

  public alterarImagem() {
    this.exibirImagem = !this.exibirImagem;
  }

  public getEventos(): void {
    const timeoutDuration = 3000; // Tempo em milissegundos

    const hideSpinner = setTimeout(() => {
      this.spinner.hide();
    }, timeoutDuration);

    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.toastr.error('Erro ao carregar os Eventos', 'Erro!');
      },
      complete: () => {
        clearTimeout(hideSpinner);
        this.spinner.hide();
      },
    });
  }

  public openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  public confirm(): void {
    this.modalRef.hide();
    this.toastr.success('O evento foi deletado com sucesso', 'Deletado!');
  }

  public decline(): void {
    this.modalRef.hide();
  }
}
