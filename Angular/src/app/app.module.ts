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
import {FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './common/component/header/header.component';
import { LeftPanelComponent } from './common/component/left-panel/left-panel.component';
import { SummaryComponent } from './summary/summary.component';
import { ReportComponent } from './report/report.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ActionItemComponent } from './action-item/action-item.component';
import { TeamComponent } from './team/team.component';
import { WeeklyReportComponent } from './weekly-report/weekly-report.component';
import { StepsModule } from "primeng/steps";
import { ToastModule } from "primeng/toast";
import {HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToolbarModule ,} from 'primeng/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ChartModule } from 'primeng/chart';
import { BarChartComponent } from './common/bar-chart/bar-chart.component';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftPanelComponent,
    SummaryComponent,
    ReportComponent,
    PageNotFoundComponent,
    ActionItemComponent,
    TeamComponent,
    WeeklyReportComponent,
    BarChartComponent
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
    StepsModule,
    ToastModule,
    HttpClientModule,
    ReactiveFormsModule,
    DialogModule,
    TagModule,
    ToolbarModule,
    BrowserAnimationsModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    ChartModule,
    DatePipe
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
