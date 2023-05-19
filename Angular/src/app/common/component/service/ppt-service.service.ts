import { Injectable, Input } from '@angular/core';
import { WeeklySummaryReport } from 'src/app/model/weekly-summary-report.model';
import PptxGenJS from 'pptxgenjs';
import { WeeklyReportService } from 'src/app/services/weeklyreport.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PptServiceService {
  constructor(private weeklyReportService:WeeklyReportService) {
  
   }

   transformDate(date: string | number | Date) {
    return""
   // return this.datePipe.transform(date, 'dd-MM-yyyy')?.toString();
  }
  createPPt(weeklySummaryReport:WeeklySummaryReport) {
    let ppt = new PptxGenJS();
    ppt.layout = "LAYOUT_WIDE";


    let slide11 = ppt.addSlide();
    slide11.addText("SummitAIWeekly Delivery Report Week -08/05/2023", {
      shape: ppt.ShapeType.roundRect,
      color: "FFFFFF",
      h: 0.507,
      w: 12.9,
      bold: true,
      align: "center",
      fill: { color: "0C8346" },
     x: 0.2,
     y: 0.2
    });


  
    let slide = ppt.addSlide();
  
    // Page title
    slide.addText("SummitAI – Summary Delivery Report", {
      shape: ppt.ShapeType.roundRect,
      color: "FFFFFF",
      h: 0.507,
      w: 12.9,
      bold: true,
      align: "center",
      fill: { color: "0C8346" },
     x: 0.2,
     y: 0.2
    });
  
    // vp name
    slide.addText(weeklySummaryReport.Summary.Name, {
      h: 0.437,
      w: 12.9,
      bold: true,
      align: "left",
      x: 0.3,
      y: 0.7
    });
  
    
    let summary: PptxGenJS.TableRow[] = [];
    summary.push([
      { text: "Item", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} },
      { text: "Current Status", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} },
      { text: "Status Details", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} }
    ]);

    summary.push([
      {text: "Overall", options: { align: "left", fontSize: 14, bold: true } },
      { text: " ", options: {bullet: true, align: "center",valign:"middle", fontSize: 70,color: this.statusColor(weeklySummaryReport.Summary.OverallStatus) } },
      {text: weeklySummaryReport.Summary.Overall, options: { align: "left", fontSize: 14, }}
    ], 
    [
      {text: "Risks", options: { align: "left", fontSize: 14, bold: true } },
      { text: " ", options: {bullet: true, align: "center",valign:"middle", fontSize: 70,color: this.statusColor(weeklySummaryReport.Summary.RiskStatus)} },
      {text: weeklySummaryReport.Summary.Risk, options: { align: "left", fontSize: 14, }}
    ]
    
    );
  
    slide.addTable(summary , {
      w: 8.35,
      x: 0.35,
      y: 1.20,
      border: { type: "solid", pt: 1 },
      colW: [1.5, 1.5, 5.5]
    });
  
  
    // Dokumentasi
    // slide.addShape(ppt.ShapeType.rect, {
    //   line: { color: "0C8346", pt: 1 },
    //   x: 8.97,
    //   y: 1.20,
    //   h: 6.02,
    //   w: 4.15
    // });


let teamData=this.weeklyReportService.getTeamDetails(); 
let tlabels=teamData.map((p: { projectName: any; }) =>p.projectName);
let tTotalResource=teamData.map((p: { totalSize: any; }) =>p.totalSize);
let tActiveResource=teamData.map((p: { tdTeamMembers: any; }) =>p.tdTeamMembers);

    let dataChartAreaLine = [
      {
        name: "Required Resource",
        labels: tlabels,
        values: tTotalResource,
      },
      {
        name: "Active Resource",
        labels: tlabels,
        values: tActiveResource,
      },
    ];


    slide.addChart(ppt.ChartType.bar, dataChartAreaLine, {  x: 8.97,
      y: 1,
      h: 3.20,
      w: 4.15 ,showLegend: true,showTitle: true,title:"Resource",showCatAxisTitle:false,catAxisTitle:'',showValAxisTitle:true,valAxisTitle:'Resource'});
  
    // slide.addText("Dokumentasi", {
    //   shape: ppt.ShapeType.roundRect,
    //   color: "FFFFFF",
    //   h: 0.507,
    //   w: 2.55,
    //   bold: true,
    //   align: "center",
    //   fill: { color: "329F5B" },
    //   x: 10.37,
    //   y: 1.02
    // });
  
    // let images = JSON.parse(this.data[0].images);
    // let imagePlaced = images.length > 6 ? 6 : images.length;
    // for (let i = 0; i < imagePlaced; i++) {
    //   if (i === 0) {
    //     slide.addImage({ path: images[i], x: 7.02, y: 1.6, w: 3, h: 1.687 });
    //   }
    // }
   
    let scheduleData=this.weeklyReportService.getScheduleDetail(); 
let sPlannedWorkItems=scheduleData.map((p: { PlannedWorkItems: any; }) =>p.PlannedWorkItems);
let sCompletedWorkItems=scheduleData.map((p: { CompletedWorkItems: any; }) =>p.CompletedWorkItems);
let sIncompleteWorkItems=scheduleData.map((p: { IncompleteWorkItems: any; }) =>p.IncompleteWorkItems);

    let WorkItems = [
      {
        name: "Planned",
        labels: ["Sprint57"],
        values: sPlannedWorkItems,
      },
      {
        name: "Completed",
        labels: ["Sprint57"],
        values: sCompletedWorkItems,
      },
      {
        name: "Incomplete",
        labels: ["Sprint57"],
        values: sIncompleteWorkItems,
      },
    ];


    slide.addChart(ppt.ChartType.bar, WorkItems, {  x: 8.97,
      y: 4.20,
      h: 3,
      w: 4.15 ,showLegend: true,showTitle: true,title:"Schedule"});
  
  
  
    //////////////////////////Action//////
  
    let Actionslide = ppt.addSlide();
  
     // Page title
     Actionslide.addText("Action Items from Last meeting", {
      shape: ppt.ShapeType.roundRect,
      color: "FFFFFF",
      h: 0.507,
      w: 12.9,
      bold: true,
      align: "center",
      fill: { color: "0C8346" },
     x: 0.2,
     y: 0.2
    });
  
     // Tabel sales
     let actionItem: PptxGenJS.TableRow[] = [];
     actionItem.push([
       { text: "SR NO", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} },
       { text: "Action Item", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} },
       { text: "Owner", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} },
       { text: "ETA", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} },
       { text: "Status", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} },
       { text: "Remarks", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} }
     ]);
     let actionCount=0;
     weeklySummaryReport.ActionItems.forEach(action => {
      actionCount++;
      actionItem.push([
        { text: actionCount.toString(), options: { align: "left", fontSize: 14 } },
        { text: action.ActionItem, options: { align: "left", fontSize: 14 } },
        { text: action.Owner, options: { align: "left", fontSize: 14 } },
        { text: new Date(action.ETA).toDateString(), options: { align: "left", fontSize: 14 } },
        { text: action.Status, options: { align: "left", fontSize: 14 } },
        { text: action.Remarks, options: { align: "left", fontSize: 14 } },
      ]);
    });
  
    Actionslide.addTable(actionItem, {
      w: 12.9,
      x: 0.35,
      y: 1.20,
      border: { type: "solid", pt: 1 },
      colW: [1,4,1.5,1.5,1,3]
    });

    ////////////////////////////////////
  
    weeklySummaryReport.Teams.forEach(team => {
      let teamSlide = ppt.addSlide();
  // Page title
  teamSlide.addText(team.TeamName, {
    shape: ppt.ShapeType.roundRect,
    color: "FFFFFF",
    h: 0.507,
    w: 12.9,
    bold: true,
    align: "center",
    fill: { color: "0C8346" },
   x: 0.2,
   y: 0.2
  });

  // lead name
  teamSlide.addText(team.LeadName, {
    h: 0.437,
    w: 12.9,
    bold: true,
    align: "left",
    x: 0.3,
    y: 0.7
  });

  // Tabel sales
  let teamRow: PptxGenJS.TableRow[] = [];
  teamRow.push([
    { text: "Item", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} },
   // { text: "Current Status", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} },
    { text: "Status Details", options: { align: "center", fontSize: 15, bold: true , color: "FFFFFF",  fill: { color: "0C8346" }} }
  ]);

  teamRow.push([
    {text: "Task Completed", options: { align: "left", fontSize: 14, bold: true } },
   // { text: " ", options: {bullet: true, align: "center", fontSize: 70,color: this.statusColor(weeklySummaryReport.Summary.OverallStatus) } },
    {text: team.TaskCompleted, options: { align: "left", fontSize: 14, }}
  ], 
  [
    {text: "Task In-Progress", options: { align: "left", fontSize: 14, bold: true } },
    {text: team.TaskInProgress, options: { align: "left", fontSize: 14,}}
  ]
  , 
  [
    {text: "Current Week Plan", options: { align: "left", fontSize: 14, bold: true } },
    {text: team.CurrentWeekPlan, options: { align: "left", fontSize: 14, }}
  ]
  
  );

  teamSlide.addTable(teamRow , {
    w: 8.35,
    x: 0.35,
    y: 1.20,
    border: { type: "solid", pt: 1 },
    colW: [1.5, 1.5, 5.5],
    autoPage: true,
    autoPageRepeatHeader: true,
    autoPageLineWeight:0.9,
   // autoPageCharWeight:1,
   // margin: 0.05
  });







     //// 
    });
    // Save the Presentation
    ppt.writeFile({ fileName: 'tabc.pptx' });
  }
  
 

  statusColor(value:string): string {
    switch (value) {
      case "y":
        return "#ffff00"
        break;
      case "r":
        return "#ff0000"
        break;
    
      default:
        return "0C8346";
    }

  }

}






