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

  ngOnInit(): void {
    this.spinner.show();
    this.carregarEventos();
  }

  get filtroLista() {
    return this.filtroListado;
  }

  set filtroLista(value: string) {
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: Evento) =>
        evento.tema.toLocaleLowerCase().includes(filtrarPor) ||
        evento.local.toLocaleLowerCase().includes(filtrarPor) ||
        evento.lote.toLocaleLowerCase().includes(filtrarPor)
    );
  }

  alterarImagem() {
    this.exibirImagem = !this.exibirImagem;
  }

  carregarEventos(): void {
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

  openModal(template: TemplateRef<any>, eventoId: number): void {
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.eventoService.deleteEvento(this.eventoId).subscribe({
        next: (result: any) => {
            console.log(result);
            this.toastr.success('O evento foi deletado com sucesso', 'Deletado!');
            this.carregarEventos();
        },
        error: (error: any) => {
            console.error(error);
            this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`, 'Erro');
        }
    }).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void {
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
