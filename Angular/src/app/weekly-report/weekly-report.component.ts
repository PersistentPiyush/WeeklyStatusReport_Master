import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { WeeklyReportService } from '../services/weeklyreport.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { WeeklySummaryReport } from "../model/weekly-summary-report.model";
import { WSR_ActionItems } from "../model/wsr-action-items.model";
import { WSR_Teams } from "../model/wsr-teams.model";
import { WSR_SummaryDetails } from "../model/wsr-summary-details.model";
import { ActionItemComponent } from "../action-item/action-item.component"
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.css'],
  providers: [MessageService],
})
export class WeeklyReportComponent implements OnInit {
  items: MenuItem[] = [];
  weeklySummaryReport: WeeklySummaryReport;
  actionItems: WSR_ActionItems[] = [];
  activeIndex: number = 0;
  public summary_form: FormGroup;
  //action_form: FormGroup;
  team_form: FormGroup;
  teamsDetails: WSR_Teams[] = [];
  team: WSR_Teams;
  teamRecord: WSR_Teams;
  SummaryDetails: WSR_SummaryDetails;
  WeekEndingDate: Date;
  oldname: any = { TeamName: "NTP Team 1", TeamID: 1 };
  summaryID : any;

  constructor(public _weeklyReportService: WeeklyReportService, public messageService: MessageService) {
  }

  ngOnInit() {

    console.log(this.weeklySummaryReport);
    this.actionItems = [];
    this.teamsDetails = [];
    this.weeklySummaryReport = new WeeklySummaryReport;
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
      TeamName: new FormControl(""),
      LeadName: new FormControl(""),
      TaskCompleted: new FormControl(""),
      TaskInProgress: new FormControl(""),
      CurrentWeekPlan: new FormControl("")
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
  AddActionItem(data: WSR_ActionItems) {
    console.log(this.actionItems);
  }
  OnNextClick() {
    console.log(this.actionItems);
    this.activeIndex = this.activeIndex + 1;
  }
  OnPreviousClick() {
    this.activeIndex = this.activeIndex - 1;
  }
  bindTeamDetails(TeamName:any){
    debugger;
    let indexToUpdate = this.teamsDetails.findIndex(x => x.TeamID == TeamName.TeamID);    
    console.log(this.teamsDetails[indexToUpdate]);
    if(this.teamsDetails[indexToUpdate])
    {
    this.team_form.reset({
      TeamName: { 
        TeamName: this.teamsDetails[indexToUpdate].TeamName, 
        TeamID: TeamName.TeamID} ,      
      LeadName: this.teamsDetails[indexToUpdate].LeadName,
      TaskCompleted: this.teamsDetails[indexToUpdate].TaskCompleted,
      TaskInProgress: this.teamsDetails[indexToUpdate].TaskInProgress,
      CurrentWeekPlan: this.teamsDetails[indexToUpdate].CurrentWeekPlan
    })
  }
  else{

    //this.team_form.reset(); 
    this.team_form.reset({
      TeamName: { 
        TeamName:TeamName.TeamName, 
        TeamID: TeamName.TeamID}})  

  }
}
  TeamNameChange(data: any) {
    this.addTeamDetailsToTeamArray();
    console.log(this.teamsDetails);
  }
  addTeamDetailsToTeamArray() {
    debugger
    this.team = new WSR_Teams;

    this.teamsDetails=this.weeklySummaryReport.Teams !=null  ? this.weeklySummaryReport.Teams : this.teamsDetails;
    //add team details to teamarray  
    

    let indexToUpdate = this.teamsDetails.findIndex(x => x.TeamID == this.oldname.TeamID);

    if (indexToUpdate != -1) {
      this.teamsDetails[indexToUpdate].LeadName = this.team_form.value.LeadName;
      this.teamsDetails[indexToUpdate].TaskCompleted = this.team_form.value.TaskCompleted;
      this.teamsDetails[indexToUpdate].TaskInProgress = this.team_form.value.TaskInProgress;
      this.teamsDetails[indexToUpdate].CurrentWeekPlan = this.team_form.value.CurrentWeekPlan;
    }
    else {
      this.team.LeadName = this.team_form.value.LeadName;
      this.team.TeamID = this.oldname.TeamID;
      this.team.TeamName = this.oldname.TeamName;
      this.team.TaskCompleted = this.team_form.value.TaskCompleted;
      this.team.TaskInProgress = this.team_form.value.TaskInProgress;
      this.team.CurrentWeekPlan = this.team_form.value.CurrentWeekPlan;
      this.teamsDetails.push(this.team);
    }
   this.bindTeamDetails(this.team_form.value.TeamName);
    console.log(this.teamsDetails);

    console.log("oldname : " + this.oldname);
    this.oldname = this.team_form.value.TeamName;
    console.log("oldname updated to: " + this.oldname);

  }


  OnDateSelection(event: any) {
debugger;
    this._weeklyReportService.getWeeklySummaryReport(event.target.value).subscribe((result: any) => {
      if (result) {
        this.weeklySummaryReport = JSON.parse(result.data);
        if(this.weeklySummaryReport.Summary!=null)
        {
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
          TeamName: this.weeklySummaryReport.Teams[0].TeamName,
          LeadName: this.weeklySummaryReport.Teams[0].LeadName,
          TaskCompleted: this.weeklySummaryReport.Teams[0].TaskCompleted,
          TaskInProgress: this.weeklySummaryReport.Teams[0].TaskInProgress,
          CurrentWeekPlan: this.weeklySummaryReport.Teams[0].CurrentWeekPlan
        })
        this.actionItems = this.weeklySummaryReport.ActionItems;


      }
      else
      {
        this.summary_form.reset();
        this.team_form.reset();

      }
    }
      
    })

  }
  OnSubmitClick(data: any) {
    console.log(this.weeklySummaryReport);
    //add summary details 
    if (this.weeklySummaryReport.Summary != null) {
      this.summaryID = this.weeklySummaryReport.Summary.SummaryID;
    }
    this.SummaryDetails = this.summary_form.value;
    this.weeklySummaryReport.Summary = this.SummaryDetails;
    this.weeklySummaryReport.Summary.CreatedBy = this.SummaryDetails.Name;
    this.weeklySummaryReport.Summary.UpdatedBy = this.SummaryDetails.Name;
    this.weeklySummaryReport.Summary.WeekEndingDate = this.WeekEndingDate;

    this.weeklySummaryReport.ActionItems = this.actionItems;

    this.addTeamDetailsToTeamArray();
    if (this.teamsDetails.length != 4) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please add all Team details', life: 3000 });
    }
    else {
      this.weeklySummaryReport.Teams = this.teamsDetails

      //add
    if (this.summaryID == null) {
      this._weeklyReportService.addWeeklySummaryReport(this.weeklySummaryReport).subscribe((result: any) => {
        if (result) {
          console.log(result);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Weekly report added successfully', life: 3000 });
        }
      })
    }
    else {
      this.weeklySummaryReport.Summary.SummaryID = this.summaryID;
      //update logic
      this._weeklyReportService.updateWeeklySummaryReport(this.weeklySummaryReport).subscribe((result: any) => {
        if (result) {
          console.log(result);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Weekly report updated successfully', life: 3000 });
        }
      })
    }

    }
    console.log(this.weeklySummaryReport);
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

