import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  eventoId: number;
  evento = {} as Evento;
  form: FormGroup;
  estadoSalvar = 'post';

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

  adicionarLote(): void {
    this.lotes.push(this.criarLote({ id: 0 } as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
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
    this.spinner.show();
    if (this.form.controls.lotes.valid) {
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
}
