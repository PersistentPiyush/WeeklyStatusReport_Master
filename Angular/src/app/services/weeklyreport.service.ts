import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})

export class WeeklyReportService {

  constructor(private _http: HttpClient) { }

  public WeekEndingDate:Date ;
  

  getWeeklySummaryReport(): Observable<any> {
    return this._http.get("https://localhost:7267/GetWeeklySummaryReport?WeekEndingDate=5%2F6%2F2023");
  }

  addWeeklySummaryReport(data: any): Observable<any> { 
    console.log(data);
    return this._http.post("https://localhost:7267/AddWeeklySummaryReport", data);
  }
}
