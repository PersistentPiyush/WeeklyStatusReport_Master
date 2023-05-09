import { Component } from '@angular/core';
import {  OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { WeeklyReportService } from '../services/weeklyreport.service';

@Component({
  selector: 'app-weekly-report',
  templateUrl: './weekly-report.component.html',
  styleUrls: ['./weekly-report.component.css']
})
export class WeeklyReportComponent implements OnInit {
  items: MenuItem[] =[];
  activeIndex :number = 0;

  constructor(){   
  }

  ngOnInit() {
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
  OnSubmitClick(){
    /*this._weeklyReportService.getWeeklySummaryReport().subscribe((result)=>{
      if(result){
        console.log(result);
      }
    })  */ 
}
}

