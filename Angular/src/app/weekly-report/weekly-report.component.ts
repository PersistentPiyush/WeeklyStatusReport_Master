import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { WeeklyReportService } from '../services/weeklyreport.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { WeeklySummaryReport } from '../model/weekly-summary-report.model';
import { WSR_ActionItems } from '../model/wsr-action-items.model';
import { WSR_Teams } from '../model/wsr-teams.model';
import { WSR_SummaryDetails } from '../model/wsr-summary-details.model';
import { ActionItemComponent } from '../action-item/action-item.component';
import { MessageService } from 'primeng/api';
import { PptServiceService } from '../common/component/service/ppt-service.service';
import * as moment from 'moment';
import { parse } from "date-fns";

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
  filteredActionItems: WSR_ActionItems[] = [];
  activeIndex: number = 0;
  public summary_form: FormGroup;
  //action_form: FormGroup;
  team_form: FormGroup;
  teamData: any[];
  teamsDetails: WSR_Teams[] = [];
  team: WSR_Teams;
  teamRecord: WSR_Teams;
  SummaryDetails: WSR_SummaryDetails;
  WeekEndingDate: Date;
  previousTeamName: any = { TeamName: 'NTP Team 1', TeamID: 1 };
  summaryID: any;

  constructor(
    public _weeklyReportService: WeeklyReportService,
    public messageService: MessageService,
    private pptServiceService: PptServiceService
  ) { }

  ngOnInit() {console.log(this.weeklySummaryReport);
    this.actionItems = [];
    this.teamsDetails = [];
    //let teams=new WSR_Teams[]=[];
    this.weeklySummaryReport = new WeeklySummaryReport();

    // this.weeklySummaryReport.Summary=new WSR_SummaryDetails;
    // this.weeklySummaryReport.Teams=this.teamsDetails;
    // this.weeklySummaryReport.ActionItems=[];

    this.summary_form = new FormGroup({
      Overall: new FormControl('', Validators.required),
      OverallStatus: new FormControl('', Validators.required),
      Risk: new FormControl('', Validators.required),
      RiskStatus: new FormControl('', Validators.required),
      WeekEndingDate: new FormControl(''),
      Name: new FormControl('', Validators.required),
    });

    this.team_form = new FormGroup({
      TeamName: new FormControl('', Validators.required),
      LeadName: new FormControl('', Validators.required),
      TaskCompleted: new FormControl('', Validators.required),
      TaskInProgress: new FormControl('', Validators.required),
      CurrentWeekPlan: new FormControl('', Validators.required),
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
    this.teamData = [{

      "id": 1,

      "name": "Reporting Team",

      "cliLead": "VP – Vasudev Pandurang Nayak",

      "perLead": "Nandakumaran Muniswamy",

      "scrumMaster": "Nandakumaran Muniswamy",

      "projectName": "Reporting Dashboard",

      "totalSize": 5,

      "status": 0,

      "tdTeamMembers": 5

    },

    {

      "id": 2,

      "name": "NTP Team",

      "cliLead": "VP – Vasudev Pandurang Nayak",

      "perLead": "Gunasekar Ganapathi ",

      "scrumMaster": "Gunasekar Ganapathi ",

      "projectName": "NTP Product Development",

      "totalSize": 100,

      "status": 0,

      "tdTeamMembers": 8

    },

    ];
    this.previousTeamName = this.teamData[0];
    this.team_form.reset({
      LeadName: this.teamData.find((x) => x.id == 1).perLead,
      TeamName: this.teamData.find((x) => x.id == 1)
    });
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
  bindTeamDetails(teamData: any) {
    let indexToBind = this.teamsDetails.findIndex(
      (x) => x.TeamID == teamData.id
    );
    console.log(this.teamsDetails[indexToBind]);
    if (this.teamsDetails[indexToBind]) {
      const name = this.teamData.find(
        (x) => x.id == this.team_form.value.TeamName.id
      ).perLead;
      this.team_form.reset({
        LeadName: name,
        TeamName: this.teamData.find(
          (x) => x.id == this.team_form.value.TeamName.id
        ),
        TaskCompleted: this.teamsDetails[indexToBind].TaskCompleted,
        TaskInProgress: this.teamsDetails[indexToBind].TaskInProgress,
        CurrentWeekPlan: this.teamsDetails[indexToBind].CurrentWeekPlan,
      });
    } else {
      this.team_form.reset({
        TeamName: this.teamData.find(
          (x) => x.id == this.team_form.value.TeamName.id
        ),
        LeadName: this.teamData.find(
          (x) => x.id == this.team_form.value.TeamName.id
        ).perLead,
      });
    }
  }
  TeamNameChange() {
    console.log(this.team_form);
    this.addTeamDataToArray();
  }
  addTeamDataToArray() {
    debugger;
    this.team = new WSR_Teams();
    this.teamsDetails =
      this.weeklySummaryReport.Teams != null
        ? this.weeklySummaryReport.Teams
        : this.teamsDetails;
    //add team details to teamarray
    let indexToUpdate = this.teamsDetails.findIndex(
      (x) => x.TeamID == this.previousTeamName.id
    );

    if (indexToUpdate != -1) {
      this.teamsDetails[indexToUpdate].LeadName = this.team_form.value.LeadName;
      this.teamsDetails[indexToUpdate].TaskCompleted =
        this.team_form.value.TaskCompleted;
      this.teamsDetails[indexToUpdate].TaskInProgress =
        this.team_form.value.TaskInProgress;
      this.teamsDetails[indexToUpdate].CurrentWeekPlan =
        this.team_form.value.CurrentWeekPlan;
    } else {
      console.log(this.team_form.value);
      this.team.LeadName = this.team_form.value.LeadName;
      this.team.TeamID = this.previousTeamName.id;
      this.team.TeamName = this.previousTeamName.name;
      this.team.TaskCompleted = this.team_form.value.TaskCompleted;
      this.team.TaskInProgress = this.team_form.value.TaskInProgress;
      this.team.CurrentWeekPlan = this.team_form.value.CurrentWeekPlan;
      this.teamsDetails.push(this.team);
    }
    console.log(this.team_form.value.TeamName);
    debugger;
    this.bindTeamDetails(this.team_form.value.TeamName);
    console.log(this.teamsDetails);
    this.previousTeamName = this.team_form.value.TeamName;
  }

  OnDateSelection(event: any) {
    //debugger;
    this._weeklyReportService
      .getWeeklySummaryReport(event.target.value)
      .subscribe((result: any) => {
        if (result) {
          this.weeklySummaryReport = JSON.parse(result.data);
          if (this.weeklySummaryReport.Summary != null)
            //converting json string to obj
            this.weeklySummaryReport = JSON.parse(result.data);

          this.summary_form.setValue({
            Overall: this.weeklySummaryReport.Summary.Overall,
            OverallStatus: this.weeklySummaryReport.Summary.OverallStatus,
            Risk: this.weeklySummaryReport.Summary.Risk,
            RiskStatus: this.weeklySummaryReport.Summary.RiskStatus,
            Name: this.weeklySummaryReport.Summary.Name,
            WeekEndingDate: this.weeklySummaryReport.Summary.WeekEndingDate,
          });
          this.team_form.setValue({
            TeamName: this.teamData.find(
              (x) => x.name == this.weeklySummaryReport.Teams[0].TeamName
            ),
            LeadName: this.weeklySummaryReport.Teams[0].LeadName,
            TaskCompleted: this.weeklySummaryReport.Teams[0].TaskCompleted,
            TaskInProgress: this.weeklySummaryReport.Teams[0].TaskInProgress,
            CurrentWeekPlan: this.weeklySummaryReport.Teams[0].CurrentWeekPlan,
          });

          this.filteredActionItems=this.weeklySummaryReport.ActionItems.filter(x=>x.Status=='Open'&&x.isActive==true);
          this.actionItems = this.weeklySummaryReport.ActionItems;
        } else {
          this.summary_form.reset();
          this.team_form.reset({
            TeamName: this.teamData.find((x) => x.id == 1),
            LeadName: this.teamData.find((x) => x.id == 1).perLead,
          });
        }
      });
  }
  OnSubmitWeeklyReportForm(data: any) {
    console.log(this.weeklySummaryReport);
    debugger;
    //add summary details
    if (this.weeklySummaryReport.Summary != null) {
      this.summaryID = this.weeklySummaryReport.Summary.SummaryID;
    } else {
      this.weeklySummaryReport = new WeeklySummaryReport();
      this.weeklySummaryReport.Summary = new WSR_SummaryDetails();
      //this.weeklySummaryReport.Teams=[];
      //this.weeklySummaryReport.ActionItems=[];
    }

    this.SummaryDetails = this.summary_form.value;
    this.weeklySummaryReport.Summary.ScheduleStatus = 'g';
    this.weeklySummaryReport.Summary.ResourceStatus = 'r';
    this.weeklySummaryReport.Summary = this.SummaryDetails;
    this.weeklySummaryReport.Summary.CreatedBy = this.SummaryDetails.Name;
    this.weeklySummaryReport.Summary.UpdatedBy = this.SummaryDetails.Name;
    this.weeklySummaryReport.Summary.WeekEndingDate = this.WeekEndingDate;

    this.weeklySummaryReport.ActionItems = this.filteredActionItems;
    debugger;

    this.addTeamDataToArray();

    if (this.teamsDetails.length != 2) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please add all Team details',
        life: 3000,
      });
    } else {
      this.weeklySummaryReport.Teams = this.teamsDetails;
      debugger;
      //add
      if (this.summaryID == null) {

        // for (let i = 0; i < this.actionItems.length; i++) {
        //   this.actionItems[i].ActionItemID = 0;
        //   console.log('Block statement execution no.' + i);
        // }
        // this.weeklySummaryReport.ActionItems = this.actionItems;

        this._weeklyReportService
          .addWeeklySummaryReport(this.weeklySummaryReport)
          .subscribe((result: any) => {
            if (result) {
              console.log(result);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Weekly report added successfully',
                life: 3000,
              });
            }
          });
      } else {
        this.weeklySummaryReport.Summary.SummaryID = this.summaryID;
        //update logic
        this._weeklyReportService
          .updateWeeklySummaryReport(this.weeklySummaryReport)
          .subscribe((result: any) => {
            if (result) {
              console.log(result);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Weekly report updated successfully',
                life: 3000,
              });
            }
          });
      }
    }
    console.log(this.weeklySummaryReport);
  }

  isNextEnable(formIndex: number): boolean {
    switch (formIndex) {
      case 0:
        return this.summary_form.valid;
        break;
      case 1:
        return true; //this.action_form.valid
        break;
      case 2:
        return true; //this.action_form.valid && this.summary_form.valid && this.team_form.valid
        break;
      default:
        return false;
    }
  }
  onpptClick() {
    this.pptServiceService.createPPt(this.weeklySummaryReport);

  }
}
