import { Component } from '@angular/core';
import { WeeklyReportService } from '../services/weeklyreport.service';
import { WeeklySummaryReport } from '../model/weekly-summary-report.model';
import { WSR_ActionItems } from '../model/wsr-action-items.model';
import { WSR_Teams } from '../model/wsr-teams.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent {
  weeklySummaryReport: WeeklySummaryReport;
  actionItems: WSR_ActionItems[] = [];
  teamsDetails: WSR_Teams[] = [];
  public summary_form: FormGroup;
  action_form: FormGroup;
  items: MenuItem[] = [];
  team_form: FormGroup;

  constructor(public _weeklyReportService: WeeklyReportService) {}

  ngOnInit() {
    debugger;
    console.log(this.weeklySummaryReport);
    this.actionItems = [];
    this.teamsDetails = [];
    this.weeklySummaryReport = new WeeklySummaryReport();

    this.summary_form = new FormGroup({
      Overall: new FormControl('', Validators.required),
      OverallStatus: new FormControl(''),
      Schedule: new FormControl(''),
      ScheduleStatus: new FormControl(''),
      Resource: new FormControl(''),
      ResourceStatus: new FormControl(''),
      Risk: new FormControl(''),
      RiskStatus: new FormControl(''),
      WeekEndingDate: new FormControl(''),
      Name: new FormControl(''),
    });

    this.team_form = new FormGroup({
      Name: new FormControl('', Validators.required),
      TaskCompleted: new FormControl(''),
      TaskInProgress: new FormControl(''),
      CurrentWeekPlan: new FormControl(''),
      NoOfTaskCompleted: new FormControl(''),
      NoOfTaskInProgress: new FormControl(''),
    });

    this.items = [
      {
        label: 'Summary',
      },
      {
        label: 'Action Item',
      },
      {
        label: 'Team',
      },
    ];
  }

  OnDateSelection(event: any) {
    this._weeklyReportService
      .getWeeklySummaryReport(event.target.value)
      .subscribe((result: any) => {
        if (result) {
          //converting json string to obj
          this.weeklySummaryReport = JSON.parse(result.data);

          this.summary_form.setValue({
            Overall: this.weeklySummaryReport.Summary.Overall,
            OverallStatus: this.weeklySummaryReport.Summary.OverallStatus,
            Schedule: this.weeklySummaryReport.Summary.Schedule,
            ScheduleStatus: this.weeklySummaryReport.Summary.ScheduleStatus,
            Resource: this.weeklySummaryReport.Summary.Resource,
            ResourceStatus: this.weeklySummaryReport.Summary.ResourceStatus,
            Risk: this.weeklySummaryReport.Summary.Risk,
            RiskStatus: this.weeklySummaryReport.Summary.RiskStatus,
            Name: this.weeklySummaryReport.Summary.Name,
            WeekEndingDate: this.weeklySummaryReport.Summary.WeekEndingDate,
          });

          this.team_form.setValue({
            Name: this.weeklySummaryReport.Teams[0].LeadName,
            TaskCompleted: this.weeklySummaryReport.Teams[0].TaskCompleted,
            TaskInProgress: this.weeklySummaryReport.Teams[0].TaskInProgress,
            CurrentWeekPlan: this.weeklySummaryReport.Teams[0].CurrentWeekPlan,
          });
          debugger;
          this.actionItems = this.weeklySummaryReport.ActionItems;
        }
      });
  }
}
