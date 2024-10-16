import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.formPerfil();
  }

  public formPerfil(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      primeiroNome: ['', [Validators.required]],
      ultimoNome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      funcao: ['', Validators.required],
      descricao: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmeSenha: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('senha')?.value === form.get('confirmeSenha')?.value ? null : { mismatch: true };
  }

  get formControllPerfil() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.valid) {
      // Lógica para cadastro
      console.log('Formulário enviado com sucesso', this.form.value);
    } else {
      // Marca todos os campos como tocados para mostrar erros
      this.form.markAllAsTouched();

    }

  }
  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

}


