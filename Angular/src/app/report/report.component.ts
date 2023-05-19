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
  dateSummaryReport: WeeklySummaryReport[];
  byweekSummaryReport: WeeklySummaryReport[];
  actionItems: WSR_ActionItems[] = [];
  teamsDetails: WSR_Teams[] = [];
  public summary_form: FormGroup;
  action_form: FormGroup;
  items: MenuItem[] = [];
  team_form: FormGroup;
  formName: FormGroup;
  calendarForm: FormGroup;
  weekcalendarForm: FormGroup;
  datecalendarForm: FormGroup;

  selectedOption: string = '--Select Drop Down--';
  reportOption: string = '--Select Drop Down--';
  a_startDate: Date;
  a_weekEndDate: Date;
  endDate: Date;
  weekEndDate: Date;
  startDate: Date;
  displayWelcomeMessage: boolean = false;
  selectedFilters: string[] = [];

  actionfilename = `Action-Item-report_${new Date()
    .toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/[\s/:]/g, '-')}.xlsx`;
  datefilename = `Datewise-summary-report_${new Date()
    .toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/[\s/:]/g, '-')}.xlsx`;
  allfilename = `Weekly-summary-report_${new Date()
    .toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    .replace(/[\s/:]/g, '-')}.xlsx`;

  constructor(
    public _weeklyReportService: WeeklyReportService,
    private formBuilder: FormBuilder
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

    this.formName = this.formBuilder.group({
      WeekEndingDate: ['', Validators.max(Date.parse(this.getCurrentDate()))],
    });

    this.calendarForm = this.formBuilder.group({
      a_startDate: ['', Validators.required],
      a_weekEndDate: ['', Validators.required],
    });

    this.weekcalendarForm = this.formBuilder.group({
      endDate: ['', Validators.required],
    });

    this.datecalendarForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      weekEndDate: ['', Validators.required],
    });
  }

  exportactionDateToExcel(event: any) {
    this._weeklyReportService
      .getDateWeeklySummaryReport(this.a_startDate, this.a_weekEndDate)
      .subscribe(
        (value: any) => {
          if (value) {
            this.dateSummaryReport = JSON.parse(value.data);

            const actionItemsData = [];
            for (let i = 0; i < this.dateSummaryReport.length; i++) {
              const report = this.dateSummaryReport[i];
              const items = report.ActionItems.map((item) => {
                const { ActionItemID, SummaryID, isActive, ...rest } = item;
                return { ...rest, 'Start Date': report.Summary.CreatedOn };
              });
              actionItemsData.push(...items);
            }

            const actionItemsWorksheet = XLSX.utils.json_to_sheet(
              actionItemsData,
              {
                header: [
                  'ActionItem',
                  'Owner',
                  'Start Date',
                  'ETA',
                  'Status',
                  'Remarks',
                ],
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
            FileSaver.saveAs(blob, this.actionfilename);
          }
        },
        (error: any) => {
          alert('Please choose the Start Date and End Date');
        }
      );
  }

  // exportactionDateToExcel(event: any) {                          // for direct download to document folder
  //   this._weeklyReportService
  //     .getDateWeeklySummaryReport(this.a_startDate, this.a_weekEndDate)
  //     .subscribe(
  //       (value: any) => {
  //         if (value) {
  //           this.dateSummaryReport = JSON.parse(value.data);
  //           const actionItemsData = [];

  //           for (const report of this.dateSummaryReport) {
  //             const items = report.ActionItems.map(
  //               ({ ActionItemID, SummaryID, isActive, ...rest }) => rest
  //             );
  //             actionItemsData.push(...items);
  //           }

  //           const actionItemsWorksheet = XLSX.utils.json_to_sheet(
  //             actionItemsData,
  //             {
  //               header: ['ActionItem', 'Owner', 'ETA', 'Status', 'Remarks'],
  //             }
  //           );

  //           const workbook = XLSX.utils.book_new();
  //           XLSX.utils.book_append_sheet(
  //             workbook,
  //             actionItemsWorksheet,
  //             'Action Items'
  //           );

  //           const excelBuffer = XLSX.write(workbook, {
  //             bookType: 'xlsx',
  //             type: 'array',
  //           });

  //           // Create a temporary link element
  //           const link = document.createElement('a');
  //           link.href = URL.createObjectURL(
  //             new Blob([excelBuffer], {
  //               type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //             })
  //           );

  //           // Set the file name
  //           link.download = `Documents/${this.actionfilename}`;

  //           // Programmatically click the link to trigger the download
  //           link.click();

  //           // Display success message
  //           alert('File has been successfully downloaded.');
  //         }
  //       },
  //       (error: any) => {
  //         alert('Please choose the Start Date and End Date');
  //       }
  //     );
  // }

  exportToExcel(event: any) {
    debugger;
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
          FileSaver.saveAs(blob, this.allfilename);
        }
      },
      (error: any) => {
        alert('Please choose the Week Ending Date');
      }
    );
  }

  byDateExportToExcel(event: any) {
    this._weeklyReportService
      .getDateWeeklySummaryReport(this.startDate, this.weekEndDate)
      .subscribe(
        (value: any) => {
          if (value) {
            this.byweekSummaryReport = JSON.parse(value.data);

            const teamsData = [];
            for (let i = 0; i < this.byweekSummaryReport.length; i++) {
              const report = this.byweekSummaryReport[i];
              const items = report.Teams.map((item) => {
                const { TeamID, SummaryID, ...rest } = item;
                return rest;
              });
              teamsData.push(...items);
            }
            const teamsWorksheet = XLSX.utils.json_to_sheet(teamsData, {
              header: [
                'TeamName',
                'LeadName',
                'TaskCompleted',
                'TaskInProgress',
                'CurrentWeekPlan',
              ],
            });

            const summaryData = [];
            for (let i = 0; i < this.byweekSummaryReport.length; i++) {
              const { SummaryID, ...report } =
                this.byweekSummaryReport[i].Summary;
              summaryData.push(report);
            }

            const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData, {
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

            const actionItemsData = [];
            for (let i = 0; i < this.byweekSummaryReport.length; i++) {
              const report = this.byweekSummaryReport[i];
              const items = report.ActionItems.map((item) => {
                const { ActionItemID, SummaryID, isActive, ...rest } = item;
                return { ...rest, 'Start Date': report.Summary.CreatedOn };
              });
              actionItemsData.push(...items);
            }
            const actionItemsWorksheet = XLSX.utils.json_to_sheet(
              actionItemsData,
              {
                header: [
                  'ActionItem',
                  'Owner',
                  'Start Date',
                  'ETA',
                  'Status',
                  'Remarks',
                ],
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
            // FileSaver.saveAs(blob, 'weekly-summary-report.xlsx');
            FileSaver.saveAs(blob, this.datefilename);
          }
        },
        (error: any) => {
          alert('Please choose the Start Date and End Date');
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
}
