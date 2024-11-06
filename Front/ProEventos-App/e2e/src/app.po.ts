import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { ContatosComponent } from '@app/components/contatos/contatos.component';
import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { EventoDetalheComponent } from '@app/components/eventos/evento-detalhe/evento-detalhe.component';
import { EventoListaComponent } from '@app/components/eventos/evento-lista/evento-lista.component';
import { EventosComponent } from '@app/components/eventos/eventos.component';
import { PalestrantesComponent } from '@app/components/palestrantes/palestrantes.component';
import { LoginComponent } from '@app/components/user/login/login.component';
import { PerfilComponent } from '@app/components/user/perfil/perfil.component';
import { RegistrationComponent } from '@app/components/user/registration/registration.component';
import { UserComponent } from '@app/components/user/user.component';
import { DateTimeFormatPipe } from '@app/helpers/DateTimeFormat.pipe';
import { EventoService } from '@app/Services/eventos.service';
import { LoteService } from '@app/Services/lote.service';
import { NavComponent } from '@app/shared/nav/nav.component';
import { TituloComponent } from '@app/shared/titulo/titulo.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { browser, by, element } from 'protractor';

export class AppPage {
  async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  async getTitleText(): Promise<string> {
    return element(by.css('app-root .content span')).getText();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    PalestrantesComponent,
    ContatosComponent,
    DashboardComponent,
    PerfilComponent,
    NavComponent,
    DateTimeFormatPipe,
    TituloComponent,
    EventoDetalheComponent,
    EventoListaComponent,
    UserComponent,
    LoginComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({ positionClass: 'inline' }),
    NgxSpinnerModule,
    NgxCurrencyModule,
  ],
  providers: [EventoService, LoteService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
