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
    // debugger;
    // console.log(this.weeklySummaryReport);
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

  // showWelcomeMessage(): void {
  //   this.displayWelcomeMessage = true;
  // }

  // exportsummaryDateToExcel(event: any) {
  //   this._weeklyReportService
  //     .getDateWeeklySummaryReport(this.startDate, this.weekEndDate)
  //     .subscribe(
  //       (value: any) => {
  //         if (value) {
  //           this.weeklySummaryReport = JSON.parse(value.data);
  //           const { SummaryID, ...summaryData } =
  //             this.weeklySummaryReport.Summary;
  //           // Convert summaryData to an array of objects
  //           const summaryDataArray = [summaryData];
  //           // Create the worksheet
  //           const worksheet = XLSX.utils.json_to_sheet(summaryDataArray, {
  //             header: [
  //               'Overall',
  //               'OverallStatus',
  //               'Schedule',
  //               'ScheduleStatus',
  //               'Resource',
  //               'ResourceStatus',
  //               'Risk',
  //               'RiskStatus',
  //               'WeekEndingDate',
  //               'CreatedBy',
  //               'CreatedOn',
  //               'UpdatedBy',
  //               'UpdatedOn',
  //               'Name',
  //             ],
  //           });
  //           // Set cell colors based on OverallStatus
  //           const range = worksheet['!ref']
  //             ? XLSX.utils.decode_range(worksheet['!ref'])
  //             : null;
  //           if (range) {
  //             for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
  //               const cellRef = XLSX.utils.encode_cell({ r: rowNum, c: 1 }); // Column index 1 is for OverallStatus
  //               const cell = worksheet[cellRef];
  //               const style = { fill: { fgColor: { rgb: '' } } }; // Default style
  //               if (cell.v === 'g') {
  //                 style.fill.fgColor.rgb = '00FF00'; // Green color
  //               } else if (cell.v === 'm') {
  //                 style.fill.fgColor.rgb = 'FFFF00'; // Yellow color
  //               } else if (cell.v === 'c') {
  //                 style.fill.fgColor.rgb = 'FF0000'; // Red color
  //               }
  //               cell.s = style;
  //               console.log(cell.v);
  //             }
  //           }
  //           // Create the workbook and add the worksheet
  //           const workbook = XLSX.utils.book_new();
  //           XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary');
  //           // Generate Excel file
  //           const excelBuffer = XLSX.write(workbook, {
  //             bookType: 'xlsx',
  //             type: 'array',
  //           });
  //           // Save the file
  //           const blob = new Blob([excelBuffer], {
  //             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //           });
  //           FileSaver.saveAs(blob, 'Datewise-Summary-Report.xlsx');
  //         }
  //       },
  //       (error: any) => {
  //         alert('Please choose the End Date');
  //       }
  //     );
  // }

  // exportSummaryDateToExcel(event: any) {
  //   this._weeklyReportService
  //     .getDateWeeklySummaryReport(this.startDate, this.weekEndDate)
  //     .subscribe(
  //       (value: any) => {
  //         if (value) {
  //           this.weeklySummaryReport = JSON.parse(value.data);
  //           const { SummaryID, ...summaryData } =
  //             this.weeklySummaryReport.Summary;
  //           // Convert summaryData to an array of objects
  //           const summaryDataArray = [summaryData];
  //           // Create the worksheet
  //           const worksheet = XLSX.utils.json_to_sheet(summaryDataArray, {
  //             header: [
  //               'Overall',
  //               'OverallStatus',
  //               'Schedule',
  //               'ScheduleStatus',
  //               'Resource',
  //               'ResourceStatus',
  //               'Risk',
  //               'RiskStatus',
  //               'WeekEndingDate',
  //               'CreatedBy',
  //               'CreatedOn',
  //               'UpdatedBy',
  //               'UpdatedOn',
  //               'Name',
  //             ],
  //           });
  //           // Set cell colors based on OverallStatus
  //           const range = worksheet['!ref']
  //             ? XLSX.utils.decode_range(worksheet['!ref'])
  //             : null;
  //           if (range) {
  //             for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
  //               const cellRef = XLSX.utils.encode_cell({ r: rowNum, c: 1 }); // Column index 1 is for OverallStatus
  //               const cell = worksheet[cellRef];
  //               let style: Partial<XLSX.CellStyle> = {};
  //               if (cell.v === 'g') {
  //                 style = { fill: { fgColor: { rgb: '00FF00' } } }; // Green color
  //               } else if (cell.v === 'm') {
  //                 style = { fill: { fgColor: { rgb: 'FFFF00' } } }; // Yellow color
  //               } else {
  //                 style = { fill: { fgColor: { rgb: 'FF0000' } } }; // Red color
  //               }
  //               cell.s = style;
  //             }
  //           }
  //           // Create the workbook and add the worksheet
  //           const workbook = XLSX.utils.book_new();
  //           XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary');

  //           // Generate Excel file
  //           const excelBuffer = XLSX.write(workbook, {
  //             bookType: 'xlsx',
  //             type: 'array',
  //           });

  //           // Save the file
  //           const blob = new Blob([excelBuffer], {
  //             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //           });
  //           FileSaver.saveAs(blob, 'Datewise-Summary-Report.xlsx');
  //         }
  //       },
  //       (error: any) => {
  //         alert('Please choose the End Date');
  //       }
  //     );
  // }

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
          alert('Please choose the End Date');
        }
      );
  }

  // exportteamDateToExcel(event: any) {
  //   this._weeklyReportService
  //     .getDateWeeklySummaryReport(this.startDate, this.weekEndDate)
  //     .subscribe(
  //       (value: any) => {
  //         if (value) {
  //           this.weeklySummaryReport = JSON.parse(value.data);

  //           const teamsData = this.weeklySummaryReport.Teams.map(
  //             (item: any) => {
  //               const { TeamID, SummaryID, ...rest } = item; // exclude the TeamID and SummaryID columns
  //               return rest;
  //             }
  //           );
  //           const teamsWorksheet = XLSX.utils.json_to_sheet(teamsData, {
  //             header: [
  //               'TeamName',
  //               'LeadName',
  //               'TaskCompleted',
  //               'TaskInProgress',
  //               'CurrentWeekPlan',
  //             ],
  //           });
  //           const workbook = XLSX.utils.book_new();
  //           XLSX.utils.book_append_sheet(workbook, teamsWorksheet, 'Teams');
  //           const excelBuffer = XLSX.write(workbook, {
  //             bookType: 'xlsx',
  //             type: 'array',
  //           });
  //           // Save the Excel file
  //           const blob = new Blob([excelBuffer], {
  //             type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //           });
  //           FileSaver.saveAs(blob, 'Datewise-Teams-Report.xlsx');
  //         }
  //       },
  //       (error: any) => {
  //         alert('Please choose the End Date');
  //       }
  //     );
  // }

  // applyFilters() {
  //   this.selectedFilters = []; // Clear the selected filters array
  //   if (this.startDate && this.weekEndDate) {
  //     this.selectedFilters.push('Summary', 'Action Items', 'Teams');
  //     this.displayWelcomeMessage = true;
  //   } else {
  //     this.displayWelcomeMessage = false;
  //   }
  // }

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
          alert('Please choose the Week Ending Date');
        }
      );
  }
}
