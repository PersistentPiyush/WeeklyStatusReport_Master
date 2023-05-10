import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { WeeklyReportService } from '../services/weeklyreport.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.css']
})
export class WeeklyReportComponent implements OnInit {
  items: MenuItem[] =[];
  activeIndex :number = 0;
   summary_form: FormGroup;
   action_form: FormGroup;
   team_form: FormGroup;
  constructor(public _weeklyReportService:WeeklyReportService){   
  }

  ngOnInit() {
    
this.summary_form = new FormGroup({
  Overall:new FormControl("",Validators.required),
  OverallStatus:new FormControl(""),
  Schedule:new FormControl(""),
  ScheduleStatus:new FormControl(""),
  Resource:new FormControl(""),
  ResourceStatus:new FormControl(""),
  Risk:new FormControl(""),
  RiskStatus:new FormControl(""),
  WeekEndingDate: new FormControl(""),
  LeadName: new FormControl("")})

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

  OnNextClick()
  {
    this.activeIndex = this.activeIndex + 1;
  }
  OnPreviousClick()
  {
    this.activeIndex = this.activeIndex - 1;
  }
  OnSubmitClick(data :any){
    //added for testing purpose
    this._weeklyReportService.getWeeklySummaryReport().subscribe((result: any)=>{
      if(result){
        console.log(result);
      }
    }) 

   this._weeklyReportService.addWeeklySummaryReport(data).subscribe((result: any)=>{
      if(result){
        console.log(result);
      }
    }) 
}
isNextEnable( formIndex:number):boolean
{
  switch (formIndex){
    case 0:
      return this.summary_form.valid
      break;
    case 1:
      return this.action_form.valid
      break;
    case 2:
      return this.action_form.valid && this.summary_form.valid && this.team_form.valid
      break;
      default:
        return false;
  }

}
}

