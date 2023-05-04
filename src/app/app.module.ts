import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './common/component/header/header.component';
import { LeftPanelComponent } from './common/component/left-panel/left-panel.component';
import { SummaryComponent } from './summary/summary.component';
import { ReportComponent } from './report/report.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ActionItemComponent } from './action-item/action-item.component';
import { TeamComponent } from './team/team.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftPanelComponent,
    SummaryComponent,
    ReportComponent,
    PageNotFoundComponent,
    ActionItemComponent,
    TeamComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    KeyFilterModule,
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
