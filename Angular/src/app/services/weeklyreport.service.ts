import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { WeeklySummaryReport } from '../model/weekly-summary-report.model';


@Injectable({
  providedIn: 'root'
})

export class WeeklyReportService {

  constructor(private _http: HttpClient) { }

  getWeeklySummaryReport(WeekEndingDate ?: Date): Observable<any> {
    let url="https://localhost:7267/GetWeeklySummaryReport";
    if(WeekEndingDate!=null)
    {
      url=url+"?WeekEndingDate=" + WeekEndingDate;
    }    
    return this._http.get( url);
  }

  addWeeklySummaryReport(data: WeeklySummaryReport): Observable<any> {
    return this._http.post("https://localhost:7267/AddWeeklySummaryReport", data);
  }
  updateWeeklySummaryReport(data: WeeklySummaryReport): Observable<any> {
    const params = new HttpParams()
      .set('SummaryID', data.Summary.SummaryID)
    return this._http.put("https://localhost:7267/UpdateWeeklySummaryReport", data, { params });
  }
  getTeamDetails() {
    return [

      {

        "id": 1,

        "name": "Reporting Team",

        "cliLead": "VP – Vasudev Pandurang Nayak",

        "perLead": "Nandakumaran Muniswamy",

        "scrumMaster": "Nandakumaran Muniswamy",

        "projectName": "Reporting Dashboard",

        "totalSize": 50,

        "status": 0,

        "tdTeamMembers": 40

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

        "tdTeamMembers": 80

      },

    ]

  }

  getScheduleDetail() {
    return [
      {

        "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",

        "SprintNumber": "Sprint57",

        "SprintName": "Sprint57",

        "PlannedWorkItems": 158,

        "CompletedWorkItems": 56,

        "IncompleteWorkItems": 102

      }

    ]

  }

  getDateWeeklySummaryReport(StartDate: Date,WeekEndingDate: Date): Observable<any> {

    return this._http.get('https://localhost:7267/GetDateSummaryReport?StartDate=' +StartDate +'&WeekEndingDate=' +WeekEndingDate);

  }

}
