import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { WeeklySummaryReport } from '../model/weekly-summary-report.model';

@Injectable({
  providedIn: 'root',
})
export class WeeklyReportService {
  constructor(private _http: HttpClient) {}

  getWeeklySummaryReport(WeekEndingDate: Date): Observable<any> {
    return this._http.get(
      'https://localhost:7267/GetWeeklySummaryReport?WeekEndingDate=' +
        WeekEndingDate
    );
  }

  addWeeklySummaryReport(data: WeeklySummaryReport): Observable<any> {
    return this._http.post(
      'https://localhost:7267/AddWeeklySummaryReport',
      data
    );
  }

  getDateWeeklySummaryReport(
    StartDate: Date,
    WeekEndingDate: Date
  ): Observable<any> {
    return this._http.get(
      'https://localhost:7267/GetDateSummaryReport?StartDate=' +
        StartDate +
        '&WeekEndingDate=' +
        WeekEndingDate
    );
  }
}
