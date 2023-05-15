import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { WeeklyReportService } from '../services/weeklyreport.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { WeeklySummaryReport } from "../model/weekly-summary-report.model";
import { WSR_ActionItems } from "../model/wsr-action-items.model";
import { WSR_Teams } from "../model/wsr-teams.model";
import { WSR_SummaryDetails } from "../model/wsr-summary-details.model";
import {ActionItemComponent } from "../action-item/action-item.component"

@Component({
  selector: 'app-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.css']
})
export class WeeklyReportComponent implements OnInit {
  items: MenuItem[] = [];
  weeklySummaryReport : WeeklySummaryReport;
  actionItems:WSR_ActionItems[]=[];
  activeIndex: number = 0;
  public summary_form: FormGroup;
  action_form: FormGroup;
  team_form: FormGroup;
  teamsDetails: WSR_Teams[]=[];
  SummaryDetails: WSR_SummaryDetails;

  constructor(public _weeklyReportService: WeeklyReportService) {
  }

  ngOnInit() {
    debugger;
    console.log(this.weeklySummaryReport);
     this.actionItems = [];
     this.teamsDetails = [];
    this.weeklySummaryReport= new WeeklySummaryReport;
    this.summary_form = new FormGroup({
      Overall: new FormControl("", Validators.required),
      OverallStatus: new FormControl(""),
      Schedule: new FormControl(""),
      ScheduleStatus: new FormControl(""),
      Resource: new FormControl(""),
      ResourceStatus: new FormControl(""),
      Risk: new FormControl(""),
      RiskStatus: new FormControl(""),
      WeekEndingDate: new FormControl(""),
      Name: new FormControl("")
    })

    this.team_form = new FormGroup({
      Name: new FormControl("", Validators.required),      
      TaskCompleted: new FormControl(""),
      TaskInProgress: new FormControl(""),
      CurrentWeekPlan: new FormControl(""),
      NoOfTaskCompleted: new FormControl(""),
      NoOfTaskInProgress: new FormControl("")      
    })

    this.items = [
      {
        label: 'Summary'
      },
      {
        label: 'Action Item'
      },
      {
        label: 'Team'
      }
    ];
  }
  AddActionItem(data:WSR_ActionItems){
    debugger;
    this.actionItems.push(data);
    console.log(this.actionItems);
  }
  OnNextClick() {
    console.log(this.actionItems);
    this.activeIndex = this.activeIndex + 1;
  }
  OnPreviousClick() {
    this.activeIndex = this.activeIndex - 1;
  }
  OnDateSelection(event:any) {

    this._weeklyReportService.getWeeklySummaryReport(event.target.value).subscribe((result: any) => {
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
        })

        this.team_form.setValue({
          Name: this.weeklySummaryReport.Teams[0].LeadName,
          TaskCompleted: this.weeklySummaryReport.Teams[0].TaskCompleted,
          TaskInProgress: this.weeklySummaryReport.Teams[0].TaskInProgress,
          CurrentWeekPlan: this.weeklySummaryReport.Teams[0].CurrentWeekPlan
        })
        debugger;
        this.actionItems=this.weeklySummaryReport.ActionItems;
        

      }
    })

  }
  OnSubmitClick(data: any) {
    console.log(this.weeklySummaryReport);
    debugger;
    
    this.SummaryDetails=this.summary_form.value;
    this.weeklySummaryReport.Summary=this.SummaryDetails;
    this.weeklySummaryReport.Summary.CreatedBy=this.SummaryDetails.Name;
    this.weeklySummaryReport.Summary.UpdatedBy=this.SummaryDetails.Name;

    this.weeklySummaryReport.ActionItems=this.actionItems;
    this.teamsDetails.push(this.team_form.value);
    this.teamsDetails.push(this.team_form.value);
    this.weeklySummaryReport.Teams=this.teamsDetails
    console.log(this.weeklySummaryReport);


    this._weeklyReportService.addWeeklySummaryReport(this.weeklySummaryReport).subscribe((result: any) => {
      if (result) {
        console.log(result);
      }
    })
  }
  
  isNextEnable(formIndex: number): boolean {
    switch (formIndex) {
      case 0:
        return this.summary_form.valid
        break;
      case 1:
        return true//this.action_form.valid
        break;
      case 2:
        return true//this.action_form.valid && this.summary_form.valid && this.team_form.valid
        break;
      default:
        return false;
    }

  }
}

