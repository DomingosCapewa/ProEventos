import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/Services/eventos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {
  evento = {} as Evento;
  form: FormGroup;
  estadoSalvar = 'post';


  constructor(
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private router: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');


    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required]
    });
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');

    if (eventoIdParam !== null) {
      this.spinner.show();

      this.estadoSalvar = 'put';
      this.eventoService.getEventoById(+eventoIdParam).subscribe({
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

  get bsConfig() : any {
    return {adaptivePosition: true,
    dateInputFormat: 'DD/MM/YYYY hh:mm a',
    containerClass: 'theme-default',
    showWeekNumbers: false}
  };


  public resertForm(): void {
    this.form.reset();
  }

  public cssValidator(campoForm: AbstractControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched }
  }

  public salvarAlteracao(): any {
    this.spinner.show();
    if(this.form.valid) {
      this.evento = (this.estadoSalvar === 'post')
               ? {...this.form.value}
               : this.evento = {id: this.evento.id, ...this.form.value};
      }
      this.eventoService[this.estadoSalvar](this.evento).pipe(
        finalize(() => this.spinner.hide())
      ).subscribe(
          () => this.toastr.success('Evento salvo com Sucesso!', 'Sucesso'),
          (err: any) => {
            console.error(err);
            this.spinner.hide()
            this.toastr.error('Erro ao salvar evento', 'Erro');
          },
          () => this.spinner.hide()
      );
    }
  }
