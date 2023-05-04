import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReportComponent } from './report/report.component';
import { ActionItemComponent } from './action-item/action-item.component';
import { TeamComponent } from './team/team.component';

const routes: Routes = [
  { path: 'Summary', component: SummaryComponent },
  { path: 'Report', component: ReportComponent },
  { path: 'Team', component: TeamComponent },
  { path: 'Action-Item', component: ActionItemComponent },
  { path: '', redirectTo: '/Summary', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
