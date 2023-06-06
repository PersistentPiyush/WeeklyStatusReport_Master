import { Component, OnInit } from '@angular/core';
import { WeeklyReportService } from 'src/app/services/weeklyreport.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  data: any;
  options: any;
  teamData:any;

  constructor(private weeklyReportService:WeeklyReportService){}

  ngOnInit() {
   this.teamData=this.weeklyReportService.getTeamDetails();   
   // [
  //     {
  //       "id": 1,
  //       "name": "Reporting Team",
  //       "cliLead": "VP – Vasudev Pandurang Nayak",
  //       "perLead": "Nandakumaran Muniswamy",
  //       "scrumMaster": "Nandakumaran Muniswamy",
  //       "projectName": "Reporting Dashboard",
  //       "totalSize": 5,
  //       "status": 0,
  //       "tdTeamMembers": 5
  //     },
  //     {
  //       "id": 2,
  //       "name": "NTP Team",
  //       "cliLead": "VP – Vasudev Pandurang Nayak",
  //       "perLead": "Gunasekar Ganapathi ",
  //       "scrumMaster": "Gunasekar Ganapathi ",
  //       "projectName": "NTP Product Development",
  //       "totalSize": 100,
  //       "status": 0,
  //       "tdTeamMembers": 8
  //     },
  //   ]


let tlabels=this.teamData.map((p: { projectName: any; }) =>p.projectName);
let tTotalResource=this.teamData.map((p: { totalSize: any; }) =>p.totalSize);
let tActiveResource=this.teamData.map((p: { tdTeamMembers: any; }) =>p.tdTeamMembers);
//let tlabels=this.teamData.map(p =>p.projectName);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: tlabels,
      datasets: [
        {
          label: 'Required Resource',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data:tTotalResource
        },
        {
          label: 'Active Resource',
          backgroundColor: documentStyle.getPropertyValue('--green-500'),
          borderColor: documentStyle.getPropertyValue('--green-500'),
          data: tActiveResource
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        Headers:{
          Text:"Resourcessss",
          font: {
            size: 18
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Project",
            font: {
              size: 18
            }},
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          title: {
            display: true,
            text: "Resource",
            font: {
              size: 18
            }},
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }

      }
    };
  }

}
