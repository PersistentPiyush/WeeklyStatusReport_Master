import { Component } from '@angular/core';
import { WeeklyReportService } from '../services/weeklyreport.service';
import { WeeklySummaryReport } from '../model/weekly-summary-report.model';
import { WSR_ActionItems } from '../model/wsr-action-items.model';
import { WSR_Teams } from '../model/wsr-teams.model';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MenuItem } from 'primeng/api';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent {
  weeklySummaryReport: WeeklySummaryReport;
  actionItems: WSR_ActionItems[] = [];
  teamsDetails: WSR_Teams[] = [];
  public summary_form: FormGroup;
  action_form: FormGroup;
  items: MenuItem[] = [];
  team_form: FormGroup;
  formName: FormGroup;

  selectedOption: string = '--Select Drop Down--';
  reportOption: string = '--Select Drop Down--';
  a_startDate: Date;
  a_weekEndDate: Date;
  endDate: Date;
  weekEndDate: Date;
  startDate: Date;
  displayWelcomeMessage: boolean = false;
  selectedFilters: string[] = [];

  constructor(
    public _weeklyReportService: WeeklyReportService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.actionItems = [];
    this.teamsDetails = [];
    this.weeklySummaryReport = new WeeklySummaryReport();

    this.summary_form = new FormGroup({
      Overall: new FormControl('', Validators.required),
      OverallStatus: new FormControl(''),
      Schedule: new FormControl(''),
      ScheduleStatus: new FormControl(''),
      Resource: new FormControl(''),
      ResourceStatus: new FormControl(''),
      Risk: new FormControl(''),
      RiskStatus: new FormControl(''),
      WeekEndingDate: new FormControl(''),
      Name: new FormControl(''),
    });

    this.team_form = new FormGroup({
      Name: new FormControl('', Validators.required),
      TaskCompleted: new FormControl(''),
      TaskInProgress: new FormControl(''),
      CurrentWeekPlan: new FormControl(''),
      NoOfTaskCompleted: new FormControl(''),
      NoOfTaskInProgress: new FormControl(''),
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

    this.formName = this.fb.group({
      WeekEndingDate: ['', Validators.max(Date.parse(this.getCurrentDate()))],
    });
  }

  exportToExcel(event: any) {
    this._weeklyReportService.getWeeklySummaryReport(this.endDate).subscribe(
      (result: any) => {
        if (result) {
          this.weeklySummaryReport = JSON.parse(result.data);
          const teamsData = this.weeklySummaryReport.Teams.map((item: any) => {
            const { TeamID, SummaryID, ...rest } = item; // exclude the TeamID and SummaryID columns
            return rest;
          });
          const teamsWorksheet = XLSX.utils.json_to_sheet(teamsData, {
            header: [
              'TeamName',
              'LeadName',
              'TaskCompleted',
              'TaskInProgress',
              'CurrentWeekPlan',
            ],
          });
          const { SummaryID, ...summaryData } =
            this.weeklySummaryReport.Summary;
          const summaryWorksheet = XLSX.utils.json_to_sheet([summaryData], {
            header: [
              'Overall',
              'OverallStatus',
              'Schedule',
              'ScheduleStatus',
              'Resource',
              'ResourceStatus',
              'Risk',
              'RiskStatus',
              'WeekEndingDate',
              'CreatedBy',
              'CreatedOn',
              'UpdatedBy',
              'UpdatedOn',
              'Name',
            ],
          });
          const actionItemsData = this.weeklySummaryReport.ActionItems.map(
            (item: any) => {
              const { ActionItemID, SummaryID, isActive, ...rest } = item; // exclude the ActionItemID, SummaryID and isActive columns
              return rest;
            }
          );
          const actionItemsWorksheet = XLSX.utils.json_to_sheet(
            actionItemsData,
            {
              header: ['ActionItem', 'Owner', 'ETA', 'Status', 'Remarks'],
            }
          );
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
          XLSX.utils.book_append_sheet(
            workbook,
            actionItemsWorksheet,
            'Action Items'
          );
          XLSX.utils.book_append_sheet(workbook, teamsWorksheet, 'Teams');
          const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          // Save the Excel file
          const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          FileSaver.saveAs(blob, 'weekly-summary-report.xlsx');
        }
      },
      (error: any) => {
        alert('Please choose the Week Ending Date');
      }
    );
  }

  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  exportactionDateToExcel(event: any) {
    this._weeklyReportService
      .getDateWeeklySummaryReport(this.a_startDate, this.a_weekEndDate)
      .subscribe(
        (value: any) => {
          if (value) {
            this.weeklySummaryReport = JSON.parse(value.data);

            const actionItemsData = this.weeklySummaryReport.ActionItems.map(
              (item: any) => {
                const { ActionItemID, SummaryID, isActive, ...rest } = item; // exclude the ActionItemID, SummaryID and isActive columns
                return rest;
              }
            );
            const actionItemsWorksheet = XLSX.utils.json_to_sheet(
              actionItemsData,
              {
                header: ['ActionItem', 'Owner', 'ETA', 'Status', 'Remarks'],
              }
            );

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(
              workbook,
              actionItemsWorksheet,
              'Action Items'
            );
            const excelBuffer = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array',
            });
            // Save the Excel file
            const blob = new Blob([excelBuffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            FileSaver.saveAs(blob, 'ActionItem-Report.xlsx');
          }
        },
        (error: any) => {
          alert('Please choose the Start Date and End Date');
        }
      );
  }

  byDateExportToExcel(event: any) {
    this._weeklyReportService
      .getDateWeeklySummaryReport(this.startDate, this.weekEndDate)
      .subscribe(
        (value: any) => {
          if (value) {
            this.weeklySummaryReport = JSON.parse(value.data);
            const teamsData = this.weeklySummaryReport.Teams.map(
              (item: any) => {
                const { TeamID, SummaryID, ...rest } = item; // exclude the TeamID and SummaryID columns
                return rest;
              }
            );
            const teamsWorksheet = XLSX.utils.json_to_sheet(teamsData, {
              header: [
                'TeamName',
                'LeadName',
                'TaskCompleted',
                'TaskInProgress',
                'CurrentWeekPlan',
              ],
            });
            const { SummaryID, ...summaryData } =
              this.weeklySummaryReport.Summary;
            const summaryWorksheet = XLSX.utils.json_to_sheet([summaryData], {
              header: [
                'Overall',
                'OverallStatus',
                'Schedule',
                'ScheduleStatus',
                'Resource',
                'ResourceStatus',
                'Risk',
                'RiskStatus',
                'WeekEndingDate',
                'CreatedBy',
                'CreatedOn',
                'UpdatedBy',
                'UpdatedOn',
                'Name',
              ],
            });
            const actionItemsData = this.weeklySummaryReport.ActionItems.map(
              (item: any) => {
                const { ActionItemID, SummaryID, isActive, ...rest } = item; // exclude the ActionItemID, SummaryID and isActive columns
                return rest;
              }
            );
            const actionItemsWorksheet = XLSX.utils.json_to_sheet(
              actionItemsData,
              {
                header: ['ActionItem', 'Owner', 'ETA', 'Status', 'Remarks'],
              }
            );

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
            XLSX.utils.book_append_sheet(
              workbook,
              actionItemsWorksheet,
              'Action Items'
            );
            XLSX.utils.book_append_sheet(workbook, teamsWorksheet, 'Teams');
            const excelBuffer = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array',
            });
            // Save the Excel file
            const blob = new Blob([excelBuffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            FileSaver.saveAs(blob, 'weekly-summary-report.xlsx');
          }
        },
        (error: any) => {
          alert('Please choose the Start Date and End Date');
        }
      );
  }
}
