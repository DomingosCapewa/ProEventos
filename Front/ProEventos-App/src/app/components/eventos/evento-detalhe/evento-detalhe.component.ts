import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/Services/eventos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { finalize } from 'rxjs/operators';
import { Lote } from '@app/models/Lote';
import { LoteService } from './../../../Services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  form: FormGroup;
  estadoSalvar = 'post';
  loteAtual = {id: 0,nome: '', indice: 0 };

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router,
    private loteService: LoteService,
  ) {
    this.localeService.use('pt-br');
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required],
      lotes: this.fb.array([])
    });
  }

  public mudarValorData(value: Date, indice: number, campo: string): void {
          this.lotes.value[indice]['campo'] = value;
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome],
      quantidade: [lote.quantidade],
      preco: [lote.preco],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

    if (this.eventoId !== null && this.eventoId !== 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(this.eventoId).subscribe({
        next: (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          });
        },
        error: (err) => {
          this.spinner.hide();
          this.toastr.error('Erro ao tentar carregar Evento.', 'Erro!');
          console.error(err);
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
  }

  ngOnInit(): void {
    this.carregarEvento();
  }

  get formControllEventoDetalhe() {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }
  get bsConfigLote(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }

  retornaTituloLote(nome: string): string {
    return nome === null || nome ===''
    ? 'Nome do lote' : nome;
  }

  public cssValidator(campoForm: AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched };
  }

  public salvarEvento(): any {
    this.spinner.show();
    if (this.form.valid) {
      this.evento = (this.estadoSalvar === 'post')
                   ? { ...this.form.value }
                   : { id: this.evento.id, ...this.form.value };

      this.eventoService[this.estadoSalvar](this.evento).pipe(
        finalize(() => this.spinner.hide())
      ).subscribe(
        (eventoRetorno: Evento) => {
          this.toastr.success('Evento salvo com sucesso!', 'Sucesso');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
        },
        (err: any) => {
          console.error(err);
          this.toastr.error('Erro ao salvar evento', 'Erro');
        }
      );
    } else {
      this.toastr.warning('Por favor, preencha todos os campos obrigatórios.', 'Atenção');
    }
  }

  public salvarLotes(): void {

    if (this.form.controls.lotes.valid) {
      this.spinner.show();
      this.loteService.saveLote(this.eventoId, this.form.value.lotes)
                      .subscribe(
                        () => {
                          this.toastr.success('Lotes salvos com sucesso!', 'Sucesso!');
                          this.lotes.clear();
                        },
                        (error: any) => {
                          this.toastr.error('Erro ao tentar salvar lotes.', 'Erro!');
                        }
                      ).add(() => this.spinner.hide());
    }
  }

  public removerLote(template: TemplateRef<any>,
                      indice: number): void {

                        this.loteAtual.id = this.lotes.get(indice + '.id').value;
                        this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
                        this.loteAtual.indice = indice;

                      this.modalRef = this.modalService.show(template, {class:'modal-sm'});
                      this.lotes.removeAt(indice);
  }

  decline(): void {

    this.modalRef.hide();
  }
  confirmDeleteLote(): void {
    this.modalRef.hide();
    this.spinner.show();

    this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
            .subscribe(
              () => {
                this.toastr.success('Lote deletado com sucesso', 'Sucesso');
                this.lotes.removeAt(this.loteAtual.indice);
              },
              (error: any) => {
                this.toastr.error(`Erro ao tentar deletar o Lote ${this.loteAtual.id}`, 'Erro');
                console.error(error);
              }
            ).add(() => this.spinner.hide());
  }
  declineDeliteLote(): void {
    this.modalRef.hide();
  }
}
