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
//import * as XlsxPopulate from 'xlsx-populate';
//import * as XLSXStyle from 'xlsx-style';
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

  selectedOption: string = '--Select--';
  reportOption: string = '--Select--';
  a_startDate: Date;
  a_weekEndDate: Date;
  endDate: Date;
  weekEndDate: Date;
  startDate: Date;
  displayWelcomeMessage: boolean = false;
  selectedFilters: string[] = [];

  actionfilename = `Action-Item-report_${new Date().toLocaleString('en-GB', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}.xlsx`;
  datefilename = `Datewise-summary-report_${new Date().toLocaleString('en-GB', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}.xlsx`;
  allfilename = `Weekly-summary-report_${new Date().toLocaleString('en-GB', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}.xlsx`;

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
    //debugger;
    this._weeklyReportService
      .getDateWeeklySummaryReport(this.a_startDate, this.a_weekEndDate)
      .subscribe((value: any) => {
        var _value = JSON.parse(value.data);
        if (_value.length != 0) {
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
        } else alert('No data! Please choose the Start Date and End Date');
      });
  }

  exportToExcel(event: any) {
    //debugger;
    this._weeklyReportService
      .getWeeklySummaryReport(this.endDate)
      .subscribe((result: any) => {
        var _result = JSON.parse(result.data);
        if (_result.Summary != null) {
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

          // Map the status values to the desired labels
          if (summaryData.OverallStatus === 'g') {
            summaryData.OverallStatus = 'Good';
          } else if (summaryData.OverallStatus === 'y') {
            summaryData.OverallStatus = 'Medium';
          } else if (summaryData.OverallStatus === 'r') {
            summaryData.OverallStatus = 'Critical';
          }

          if (summaryData.ScheduleStatus === 'g') {
            summaryData.ScheduleStatus = 'Good';
          } else if (summaryData.ScheduleStatus === 'y') {
            summaryData.ScheduleStatus = 'Medium';
          } else if (summaryData.ScheduleStatus === 'r') {
            summaryData.ScheduleStatus = 'Critical';
          }

          if (summaryData.ResourceStatus === 'g') {
            summaryData.ResourceStatus = 'Good';
          } else if (summaryData.ResourceStatus === 'y') {
            summaryData.ResourceStatus = 'Medium';
          } else if (summaryData.ResourceStatus === 'r') {
            summaryData.ResourceStatus = 'Critical';
          }

          if (summaryData.RiskStatus === 'g') {
            summaryData.RiskStatus = 'Good';
          } else if (summaryData.RiskStatus === 'y') {
            summaryData.RiskStatus = 'Medium';
          } else if (summaryData.RiskStatus === 'r') {
            summaryData.RiskStatus = 'Critical';
          }

          const summaryWorksheet = XLSX.utils.json_to_sheet([summaryData], {
            header: [
              'Overall',
              'OverallStatus',
              'ScheduleStatus',
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
              return {
                ...rest,
                'Start Date': this.weeklySummaryReport.Summary.CreatedOn,
              };
            }
          );

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
          FileSaver.saveAs(blob, this.allfilename);
        } else {
          alert('No Data! Please choose the correct Week Ending Date');
        }
      });
  }

  byDateExportToExcel(event: any) {
    debugger;
    this._weeklyReportService
      .getDateWeeklySummaryReport(this.startDate, this.weekEndDate)
      .subscribe((value: any) => {
        var _value = JSON.parse(value.data);
        if (_value.length != 0) {
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
          const cellStyles: any = {};
          const colorCode = {
            g: '00FF00', // green
            y: 'FFFF00', // yellow
            r: 'FF0000', // red
          };
          for (let i = 0; i < this.byweekSummaryReport.length; i++) {
            const { SummaryID, ...report } =
              this.byweekSummaryReport[i].Summary;

            // Map the status values to the desired labels
            if (report.OverallStatus === 'g') {
              report.OverallStatus = 'Good';
              cellStyles[`B${i + 2}`] = {
                fill: {
                  patternType: 'solid',
                  fgColor: { rgb: colorCode.g },
                },
              };
            } else if (report.OverallStatus === 'y') {
              report.OverallStatus = 'Medium';
              cellStyles[`B${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.y } },
              };
            } else if (report.OverallStatus === 'r') {
              report.OverallStatus = 'Critical';
              cellStyles[`B${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.r } },
              };
            }

            if (report.ScheduleStatus === 'g') {
              report.ScheduleStatus = 'Good';
              cellStyles[`C${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.g } },
              };
            } else if (report.ScheduleStatus === 'y') {
              report.ScheduleStatus = 'Medium';
              cellStyles[`C${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.y } },
              };
            } else if (report.ScheduleStatus === 'r') {
              report.ScheduleStatus = 'Critical';
              cellStyles[`C${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.r } },
              };
            }

            if (report.ResourceStatus === 'g') {
              report.ResourceStatus = 'Good';
              cellStyles[`D${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.g } },
              };
            } else if (report.ResourceStatus === 'y') {
              report.ResourceStatus = 'Medium';
              cellStyles[`D${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.y } },
              };
            } else if (report.ResourceStatus === 'r') {
              report.ResourceStatus = 'Critical';
              cellStyles[`D${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.r } },
              };
            }

            if (report.RiskStatus === 'g') {
              report.RiskStatus = 'Good';
              cellStyles[`F${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.g } },
              };
            } else if (report.RiskStatus === 'y') {
              report.RiskStatus = 'Medium';
              cellStyles[`F${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.y } },
              };
            } else if (report.RiskStatus === 'r') {
              report.RiskStatus = 'Critical';
              cellStyles[`F${i + 2}`] = {
                fill: { fgColor: { rgb: colorCode.r } },
              };
            }

            summaryData.push(report);
          }

          const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData, {
            header: [
              'Overall',
              'OverallStatus',
              'ScheduleStatus',
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

          FileSaver.saveAs(blob, this.datefilename);
        } else {
          alert('No Data! Please choose the correct Start Date and End Date');
        }
      });
  }

  // byDateExportToExcel(event: any) {
  //   debugger;
  //   this._weeklyReportService
  //     .getDateWeeklySummaryReport(this.startDate, this.weekEndDate)
  //     .subscribe((value: any) => {
  //       var _value = JSON.parse(value.data);
  //       if (_value.length != 0) {
  //         this.byweekSummaryReport = JSON.parse(value.data);

  //         const teamsData: any[] = [];
  //         for (let i = 0; i < this.byweekSummaryReport.length; i++) {
  //           const report = this.byweekSummaryReport[i];
  //           const items = report.Teams.map((item) => {
  //             const { TeamID, SummaryID, ...rest } = item;
  //             return rest;
  //           });
  //           teamsData.push(...items);
  //         }
  //         const teamsWorksheet = XLSX.utils.json_to_sheet(teamsData, {
  //           header: [
  //             'TeamName',
  //             'LeadName',
  //             'TaskCompleted',
  //             'TaskInProgress',
  //             'CurrentWeekPlan',
  //           ],
  //         });

  //         const summaryData = [];
  //         const cellStyles: any = {};
  //         // const colorCode = {
  //         //   g: '#00FF00', // green
  //         //   y: '#FFFF00', // yellow
  //         //   r: '#FF0000', // red
  //         // };

  //         var color = ['#00FF00', '#FFFF00', '#FF0000'];
  //         for (let i = 0; i < this.byweekSummaryReport.length; i++) {
  //           const { SummaryID, ...report } =
  //             this.byweekSummaryReport[i].Summary;

  //           // Map the status values to the desired labels
  //           if (report.OverallStatus === 'g') {
  //             report.OverallStatus = 'Good';
  //             cellStyles[`B${i + 2}`] = {
  //               fill: {
  //                 type: 'pattern',
  //                 pattern: 'solid',
  //                 bgColor: { rgb: color[0] },
  //               },
  //               // font: { fgcolor: { rgb: colorCode.g } },
  //             };
  //           } else if (report.OverallStatus === 'y') {
  //             report.OverallStatus = 'Medium';
  //           } else if (report.OverallStatus === 'r') {
  //             report.OverallStatus = 'Critical';
  //           }

  //           if (report.ScheduleStatus === 'g') {
  //             report.ScheduleStatus = 'Good';
  //           } else if (report.ScheduleStatus === 'y') {
  //             report.ScheduleStatus = 'Medium';
  //           } else if (report.ScheduleStatus === 'r') {
  //             report.ScheduleStatus = 'Critical';
  //           }

  //           if (report.ResourceStatus === 'g') {
  //             report.ResourceStatus = 'Good';
  //           } else if (report.ResourceStatus === 'y') {
  //             report.ResourceStatus = 'Medium';
  //           } else if (report.ResourceStatus === 'r') {
  //             report.ResourceStatus = 'Critical';
  //           }

  //           if (report.RiskStatus === 'g') {
  //             report.RiskStatus = 'Good';
  //           } else if (report.RiskStatus === 'y') {
  //             report.RiskStatus = 'Medium';
  //           } else if (report.RiskStatus === 'r') {
  //             report.RiskStatus = 'Critical';
  //           }

  //           summaryData.push(report);
  //         }

  //         const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData, {
  //           header: [
  //             'Overall',
  //             'OverallStatus',
  //             'ScheduleStatus',
  //             'ResourceStatus',
  //             'Risk',
  //             'RiskStatus',
  //             'WeekEndingDate',
  //             'CreatedBy',
  //             'CreatedOn',
  //             'UpdatedBy',
  //             'UpdatedOn',
  //             'Name',
  //           ],
  //         });

  //         const actionItemsData: any[] = [];
  //         for (let i = 0; i < this.byweekSummaryReport.length; i++) {
  //           const report = this.byweekSummaryReport[i];
  //           const items = report.ActionItems.map((item) => {
  //             const { ActionItemID, SummaryID, isActive, ...rest } = item;
  //             return { ...rest, 'Start Date': report.Summary.CreatedOn };
  //           });
  //           actionItemsData.push(...items);
  //         }
  //         const actionItemsWorksheet = XLSX.utils.json_to_sheet(
  //           actionItemsData,
  //           {
  //             header: [
  //               'ActionItem',
  //               'Owner',
  //               'Start Date',
  //               'ETA',
  //               'Status',
  //               'Remarks',
  //             ],
  //           }
  //         );

  //         XlsxPopulate.fromBlankAsync()
  //           .then((workbook) => {
  //             // Apply header cell style to teams worksheet
  //             const teamsSheetName = 'Teams';
  //             const teamsSheet = workbook.addSheet(teamsSheetName);
  //             XLSX.utils.sheet_add_json(teamsSheet, teamsData, {
  //               origin: 'A2',
  //               skipHeader: true,
  //             });
  //             teamsSheet.row(1).style({ fill: 'FFCCEEFF' });

  //             // Apply header cell style to summary worksheet
  //             const summarySheetName = 'Summary';
  //             const summarySheet = workbook.addSheet(summarySheetName);
  //             XLSX.utils.sheet_add_json(summarySheet, summaryData, {
  //               origin: 'A2',
  //               skipHeader: true,
  //             });
  //             summarySheet.row(1).style({ fill: 'FFCCEEFF' });

  //             // Apply header cell style to action items worksheet
  //             const actionItemsSheetName = 'Action Items';
  //             const actionItemsSheet = workbook.addSheet(actionItemsSheetName);
  //             XLSX.utils.sheet_add_json(actionItemsSheet, actionItemsData, {
  //               origin: 'A2',
  //               skipHeader: true,
  //             });
  //             actionItemsSheet.row(1).style({ fill: 'FFCCEEFF' });

  //             // Save the Excel file
  //             return workbook.toFileAsync(this.datefilename);
  //           })
  //           .then(() => {
  //             console.log('Excel file saved successfully');
  //           })
  //           .catch((error: any) => {
  //             console.error('Error saving Excel file:', error);
  //           });

  //         // const workbook = XLSXStyle.utils.book_new();
  //         // XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');
  //         // XLSX.utils.book_append_sheet(
  //         //   workbook,
  //         //   actionItemsWorksheet,
  //         //   'Action Items'
  //         // );
  //         // XLSX.utils.book_append_sheet(workbook, teamsWorksheet, 'Teams');

  //         // //set header cell styles to light blue color
  //         // const headerStyle = {
  //         //   fill: { fgColor: { rgb: 'FFFFCCOO' } },
  //         // };
  //         // const sheetNames = Object.keys(workbook.Sheets);
  //         // for (let i = 0; i < sheetNames.length; i++) {
  //         //   const sheetName = sheetNames[i];
  //         //   const sheet = workbook.Sheets[sheetName];
  //         //   const headers = Object.keys(sheet).filter((key) =>
  //         //     key.startsWith('A1')
  //         //   );
  //         //   for (let j = 0; j < headers.length; j++) {
  //         //     const header = headers[j];
  //         //     sheet[header].s = headerStyle;
  //         //   }
  //         // }

  //         // const excelBuffer = XLSX.write(workbook, {
  //         //   bookType: 'xlsx',
  //         //   type: 'array',
  //         // });
  //         // // Save the Excel file
  //         // const blob = new Blob([excelBuffer], {
  //         //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         // });

  //         // const headerStyle = {
  //         //   fill: { bgColor: { indexed: 64 }, fgColor: { rgb: 'FFCCEEFF' } },
  //         // };

  //         // // Apply header cell style to teams worksheet

  //         // const teamsSheetName = 'Teams';

  //         // const teamsSheet = XLSX.utils.sheet_add_json(
  //         //   teamsWorksheet,
  //         //   teamsData,
  //         //   {
  //         //     skipHeader: true,

  //         //     origin: 'A2',
  //         //   }
  //         // );

  //         // teamsSheet['!cols'] = [
  //         //   { width: 15 },
  //         //   { width: 15 },
  //         //   { width: 15 },
  //         //   { width: 15 },
  //         //   { width: 20 },
  //         // ];

  //         // teamsSheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

  //         // teamsSheet['A1'].s = headerStyle;

  //         // teamsSheet['B1'].s = headerStyle;

  //         // teamsSheet['C1'].s = headerStyle;

  //         // teamsSheet['D1'].s = headerStyle;

  //         // teamsSheet['E1'].s = headerStyle;

  //         // XLSX.utils.book_append_sheet(workbook, teamsSheet, teamsSheetName);

  //         // // Apply header cell style to summary worksheet

  //         // const summarySheetName = 'Summary';

  //         // const summarySheet = XLSX.utils.sheet_add_json(
  //         //   summaryWorksheet,
  //         //   summaryData,
  //         //   {
  //         //     skipHeader: true,

  //         //     origin: 'A2',
  //         //   }
  //         // );

  //         // summarySheet['!cols'] = Array(12).fill({ width: 15 });

  //         // for (let i = 0; i < 12; i++) {
  //         //   summarySheet[XLSX.utils.encode_col(i) + '1'].s = headerStyle;
  //         // }

  //         // XLSX.utils.book_append_sheet(
  //         //   workbook,
  //         //   summarySheet,
  //         //   summarySheetName
  //         // );

  //         // // Apply header cell style to action items worksheet

  //         // const actionItemsSheetName = 'Action Items';

  //         // const actionItemsSheet = XLSX.utils.sheet_add_json(
  //         //   actionItemsWorksheet,
  //         //   actionItemsData,
  //         //   {
  //         //     skipHeader: true,

  //         //     origin: 'A2',
  //         //   }
  //         // );

  //         // actionItemsSheet['!cols'] = Array(6).fill({ width: 15 });

  //         // for (let i = 0; i < 6; i++) {
  //         //   actionItemsSheet[XLSX.utils.encode_col(i) + '1'].s = headerStyle;
  //         // }

  //         // XLSX.utils.book_append_sheet(
  //         //   workbook,
  //         //   actionItemsSheet,
  //         //   actionItemsSheetName
  //         // );

  //         // const excelBuffer = XLSXStyle.write(workbook, {
  //         //   bookType: 'xlsx',
  //         //   type: 'buffer',
  //         // });

  //         // // Save the Excel file

  //         // const blob = new Blob([excelBuffer], {
  //         //   type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //         // });

  //         // FileSaver.saveAs(blob, this.datefilename);
  //       } else {
  //         alert('No Data! Please choose the correct Start Date and End Date');
  //       }
  //     });
  // }

  // byDateExportToExcel(event: any) {
  //   debugger;
  //   this._weeklyReportService
  //     .getDateWeeklySummaryReport(this.startDate, this.weekEndDate)
  //     .subscribe((value: any) => {
  //       var _value = JSON.parse(value.data);
  //       if (_value.length != 0) {
  //         this.byweekSummaryReport = JSON.parse(value.data);

  //         const teamsData: any[] = [];
  //         for (let i = 0; i < this.byweekSummaryReport.length; i++) {
  //           const report = this.byweekSummaryReport[i];
  //           const items = report.Teams.map((item) => {
  //             const { TeamID, SummaryID, ...rest } = item;
  //             return rest;
  //           });
  //           teamsData.push(...items);
  //         }

  //         const teamsWorksheet = XLSX.utils.json_to_sheet(teamsData, {
  //           header: [
  //             'TeamName',
  //             'LeadName',
  //             'TaskCompleted',
  //             'TaskInProgress',
  //             'CurrentWeekPlan',
  //           ],
  //         });

  //         const summaryData: any[] = [];
  //         const cellStyles: any = {};
  //         // const colorCode = {
  //         //   g: '#00FF00', // green
  //         //   y: '#FFFF00', // yellow
  //         //   r: '#FF0000', // red
  //         // };

  //         var color = ['#00FF00', '#FFFF00', '#FF0000'];
  //         for (let i = 0; i < this.byweekSummaryReport.length; i++) {
  //           const { SummaryID, ...report } =
  //             this.byweekSummaryReport[i].Summary;

  //           // Map the status values to the desired labels
  //           if (report.OverallStatus === 'g') {
  //             report.OverallStatus = 'Good';
  //             cellStyles[`B${i + 2}`] = {
  //               fill: {
  //                 type: 'pattern',
  //                 pattern: 'solid',
  //                 bgColor: { rgb: color[0] },
  //               },
  //               // font: { fgcolor: { rgb: colorCode.g } },
  //             };
  //           } else if (report.OverallStatus === 'y') {
  //             report.OverallStatus = 'Medium';
  //           } else if (report.OverallStatus === 'r') {
  //             report.OverallStatus = 'Critical';
  //           }

  //           if (report.ScheduleStatus === 'g') {
  //             report.ScheduleStatus = 'Good';
  //           } else if (report.ScheduleStatus === 'y') {
  //             report.ScheduleStatus = 'Medium';
  //           } else if (report.ScheduleStatus === 'r') {
  //             report.ScheduleStatus = 'Critical';
  //           }

  //           if (report.ResourceStatus === 'g') {
  //             report.ResourceStatus = 'Good';
  //           } else if (report.ResourceStatus === 'y') {
  //             report.ResourceStatus = 'Medium';
  //           } else if (report.ResourceStatus === 'r') {
  //             report.ResourceStatus = 'Critical';
  //           }

  //           if (report.RiskStatus === 'g') {
  //             report.RiskStatus = 'Good';
  //           } else if (report.RiskStatus === 'y') {
  //             report.RiskStatus = 'Medium';
  //           } else if (report.RiskStatus === 'r') {
  //             report.RiskStatus = 'Critical';
  //           }

  //           summaryData.push(report);
  //         }

  //         const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData, {
  //           header: [
  //             'Overall',
  //             'OverallStatus',
  //             'ScheduleStatus',
  //             'ResourceStatus',
  //             'Risk',
  //             'RiskStatus',
  //             'WeekEndingDate',
  //             'CreatedBy',
  //             'CreatedOn',
  //             'UpdatedBy',
  //             'UpdatedOn',
  //             'Name',
  //           ],
  //         });

  //         const actionItemsData: any[] = [];
  //         for (let i = 0; i < this.byweekSummaryReport.length; i++) {
  //           const report = this.byweekSummaryReport[i];
  //           const items = report.ActionItems.map((item) => {
  //             const { ActionItemID, SummaryID, isActive, ...rest } = item;
  //             return { ...rest, 'Start Date': report.Summary.CreatedOn };
  //           });
  //           actionItemsData.push(...items);
  //         }
  //         const actionItemsWorksheet = XLSX.utils.json_to_sheet(
  //           actionItemsData,
  //           {
  //             header: [
  //               'ActionItem',
  //               'Owner',
  //               'Start Date',
  //               'ETA',
  //               'Status',
  //               'Remarks',
  //             ],
  //           }
  //         );

  //         // const workbook  = XLSX.utils.book_new();
  //         XlsxPopulate.fromBlankAsync()
  //           .then((workbook: any) => {
  //             // Apply header cell style to teams worksheet
  //             const teamsSheetName = 'Teams';
  //             const teamsSheet = workbook.addSheet(teamsSheetName);
  //             XLSX.utils.sheet_add_json(teamsSheet, teamsData, {
  //               origin: 'A2',
  //               skipHeader: true,
  //             });
  //             teamsSheet.row(1).style({ fill: 'FFCCEEFF' });

  //             // Apply header cell style to summary worksheet
  //             const summarySheetName = 'Summary';
  //             const summarySheet = workbook.addSheet(summarySheetName);
  //             XLSX.utils.sheet_add_json(summarySheet, summaryData, {
  //               origin: 'A2',
  //               skipHeader: true,
  //             });
  //             summarySheet.row(1).style({ fill: 'FFCCEEFF' });

  //             // Apply header cell style to action items worksheet
  //             const actionItemsSheetName = 'Action Items';
  //             const actionItemsSheet = workbook.addSheet(actionItemsSheetName);
  //             XLSX.utils.sheet_add_json(actionItemsSheet, actionItemsData, {
  //               origin: 'A2',
  //               skipHeader: true,
  //             });
  //             actionItemsSheet.row(1).style({ fill: 'FFCCEEFF' });

  //             // Save the Excel file
  //             return workbook.toFileAsync(this.datefilename);
  //           })
  //           .then(() => {
  //             console.log('Excel file saved successfully');
  //           })
  //           .catch((error: any) => {
  //             console.error('Error saving Excel file:', error);
  //           });
  //       } else {
  //         alert('No Data! Please choose the correct Start Date and End Date');
  //       }
  //     });
  // }

  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
