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
import { Fill, Workbook, Worksheet, Cell } from 'exceljs';

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
  _summaryData: any;

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
  ) { }

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
      .subscribe((value: any) => {
        var _value = JSON.parse(value.data);
        if (_value.length != 0) {
          this.dateSummaryReport = JSON.parse(value.data);
          const actionItemsData = [];
          for (let i = 0; i < this.dateSummaryReport.length; i++) {
            const report = this.dateSummaryReport[i];
            const items = report.ActionItems.map((item) => {
              const { ActionItemID, SummaryID, isActive, ...rest } = item;
              const startDate = this.formateDate(report.Summary.CreatedOn);
              const etaDate = this.formateDate(rest.ETA);
              const completionDate =
                this.formateDate(rest.CompletionDate) === '01-01-1' ? '' : this.formateDate(rest.CompletionDate);
              return { ...rest, 'Start Date': startDate, ETA: etaDate,CompletionDate: completionDate};
            });
            actionItemsData.push(...items);
          }

          const workbook = new Workbook();
          const worksheet = workbook.addWorksheet('Action Items');
          const header = [
            'ActionItem',
            'Owner',
            'Start Date',
            'ETA',
            'CompletionDate',
            'Status',
            'Remark',
          ];

          //set header row
          const headerRow = worksheet.addRow(header);
          headerRow.eachCell((cell) => {
            //set font to bold
            cell.font = { bold: true, color: { argb: 'ffffff' } }; //white

            //set cell fill color to dark blue
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '00008B' },
            };
          });
          //add data rows
          actionItemsData.forEach((item) => {
            const rowDate = [
              item.ActionItem,
              item.Owner,
              item['Start Date'],
              item.ETA,
              item.CompletionDate,
              item.Status,
              item.Remarks,
            ];
            worksheet.addRow(rowDate);
          });

          //set column width for all columns
          worksheet.columns.forEach((column) => {
            column.width = 15;
          });

          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            FileSaver.saveAs(blob, this.actionfilename);
          });
        } else {
          alert('Please choose correct Start Date and End Date');
        }
      });
  }

  exportToExcel(event: any) {
    debugger;
    this._weeklyReportService
      .getWeeklySummaryReport(this.endDate)
      .subscribe((result: any) => {
        var _result = JSON.parse(result.data);
        if (_result.Summary != null) {
          this.weeklySummaryReport = JSON.parse(result.data);

          const workbook = new Workbook();

          const headerStyle = {
            font: { bold: true, color: { argb: 'ffffff' } },
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '00008B' }, // dark blue color
            } as any,
          };

          const summaryWorksheet: Worksheet = workbook.addWorksheet('Summary');
          summaryWorksheet.addRow([
            'SummitLead',
            'CreatedBy',
            'CreatedOn',
            'UpdatedBy',
            'UpdatedOn',
            'Overall',
            'OverallStatus',
            'ScheduleStatus',
            'ResourceStatus',
            'Risk',
            'RiskStatus',
            'WeekEndingDate',
            'RiskMitigation',
          ]).font = headerStyle.font;

          // get the first row of the worksheet
          var fisrtRow = summaryWorksheet.getRow(1);

          //Iterate over each cell in the first row
          fisrtRow.eachCell((cell, colNumber) => {
            cell.fill = headerStyle.fill;
          });

          const actionItemsWorksheet = workbook.addWorksheet('Action Items');
          actionItemsWorksheet.addRow([
            'ActionItem',
            'Owner',
            'Start Date',
            'ETA',
            'CompletionDate',
            'Status',
            'Remark',
          ]).font = headerStyle.font;
          fisrtRow = actionItemsWorksheet.getRow(1);
          fisrtRow.eachCell((cell, colNumber) => {
            cell.fill = headerStyle.fill;
          });

          const teamsWorksheet = workbook.addWorksheet('Teams');
          teamsWorksheet.addRow([
            'TeamName',
            'LeadName',
            'TaskCompleted',
            'TaskInProgress',
            'CurrentWeekPlan',
          ]).font = headerStyle.font;
          fisrtRow = teamsWorksheet.getRow(1);
          fisrtRow.eachCell((cell, colNumber) => {
            cell.fill = headerStyle.fill;
          });

          const teamsData = this.weeklySummaryReport.Teams.map((item: any) => {
            const { TeamID, SummaryID, ...rest } = item;
            return rest;
          });

          const { SummaryID, ...summaryData } =
            this.weeklySummaryReport.Summary;

          // Map the status values to the desired labels
          summaryData.OverallStatus = this.getStatusLabel(
            summaryData.OverallStatus
          );
          summaryData.ScheduleStatus = this.getStatusLabel(
            summaryData.ScheduleStatus
          );
          summaryData.ResourceStatus = this.getStatusLabel(
            summaryData.ResourceStatus
          );
          summaryData.RiskStatus = this.getStatusLabel(summaryData.RiskStatus);

          // Format dates and update the corresponding cells
          this._summaryData = summaryData;
          this._summaryData.CreatedOn = this.formateDate(summaryData.CreatedOn);
          this._summaryData.UpdatedOn = this.formateDate(summaryData.UpdatedOn);
          if (this._summaryData.UpdatedOn === '01-01-1')
            this._summaryData.UpdatedOn = '';
          this._summaryData.WeekEndingDate = this.formateDate(
            summaryData.WeekEndingDate
          );
          this._summaryData.SummitLead = this._summaryData.Name;
          delete this._summaryData.Name;

          const actionItemsData = this.weeklySummaryReport.ActionItems.map(
            (item: any) => {
              const { ActionItemID, SummaryID, isActive, ...rest } = item;
              const startDate = this.formateDate(
                this.weeklySummaryReport.Summary.CreatedOn
              );
              const etaDate = this.formateDate(rest.ETA);
              const completionDate =
              this.formateDate(rest.CompletionDate) === '01-01-1' ? '' : this.formateDate(rest.CompletionDate);
            return { ...rest, 'Start Date': startDate, ETA: etaDate,CompletionDate: completionDate};
            }
          );
          // Add data to worksheets
          summaryWorksheet.addRow(
            Object.values([
              this._summaryData.SummitLead,
              this._summaryData.CreatedBy,
              this._summaryData.CreatedOn,
              this._summaryData.UpdatedBy,
              this._summaryData.UpdatedOn,
              this._summaryData.Overall,
              this._summaryData.OverallStatus,
              this._summaryData.ScheduleStatus,
              this._summaryData.ResourceStatus,
              this._summaryData.Risk,
              this._summaryData.RiskStatus,
              this._summaryData.WeekEndingDate,
              this._summaryData.RiskMitigation,
            ])
          );

          //Applying colors to columns cells based on conditions
          const summaryoverallStatus = summaryWorksheet.getColumn('G');
          summaryoverallStatus.eachCell((cell, rowNumber) => {
            let sColor = this.getStatusColor(cell.value);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: sColor },
            };
          });
          const summaryscheduleStatus = summaryWorksheet.getColumn('H');
          summaryscheduleStatus.eachCell((cell, rowNumber) => {
            let sColor = this.getStatusColor(cell.value);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: sColor },
            };
          });
          const summaryresourceStatus = summaryWorksheet.getColumn('I');
          summaryresourceStatus.eachCell((cell, rowNumber) => {
            let sColor = this.getStatusColor(cell.value);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: sColor },
            };
          });
          const summaryrriskStatus = summaryWorksheet.getColumn('K');
          summaryrriskStatus.eachCell((cell, rowNumber) => {
            let sColor = this.getStatusColor(cell.value);
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: sColor },
            };
          });

          actionItemsData.forEach((item) => {
            const rowDate = [
              item.ActionItem,
              item.Owner,
              item['Start Date'],
              item.ETA,
              item.CompletionDate,
              item.Status,
              item.Remarks,
            ];
            actionItemsWorksheet.addRow(rowDate);
          });
          teamsData.forEach((item) => {
            teamsWorksheet.addRow(Object.values(item));
          });

          //set column width for all columns
          summaryWorksheet.columns.forEach((column) => {
            column.width = 15;
          });
          actionItemsWorksheet.columns.forEach((column) => {
            column.width = 15;
          });
          teamsWorksheet.columns.forEach((column) => {
            column.width = 15;
          });

          workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            FileSaver.saveAs(blob, this.allfilename);
          });
        } else {
          alert('Please choose correct Week End Date');
        }
      });
  }

  byDateExportToExcel(event: any) {
    this._weeklyReportService
      .getDateWeeklySummaryReport(this.startDate, this.weekEndDate)
      .subscribe((value: any) => {
        var _value = JSON.parse(value.data);
        if (_value.length != 0) {
          this.byweekSummaryReport = JSON.parse(value.data);

          const workbook = new Workbook();
          const summaryWorksheet = workbook.addWorksheet('Summary');
          const actionItemsWorksheet = workbook.addWorksheet('Action Items');
          const teamsWorksheet = workbook.addWorksheet('Teams');

          const headerStyle = {
            font: { bold: true, color: { argb: 'ffffff' } },
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: '00008B' }, // Dark Blue color
            } as any,
          };

          // Summary sheet
          summaryWorksheet.addRow([
            'SummitLead',
            'CreatedBy',
            'CreatedOn',
            'UpdatedBy',
            'UpdatedOn',
            'Overall',
            'OverallStatus',
            'ScheduleStatus',
            'ResourceStatus',
            'Risk',
            'RiskStatus',
            'WeekEndingDate',
            'RiskMitigation',
          ]).font = headerStyle.font;
          var fisrtRow = summaryWorksheet.getRow(1);
          fisrtRow.eachCell((cell, colNumber) => {
            cell.fill = headerStyle.fill;
          });
          // Action Items sheet
          const actionItemsData = [];
          for (let i = 0; i < this.byweekSummaryReport.length; i++) {
            const report = this.byweekSummaryReport[i];
            const items = report.ActionItems.map((item) => {
              const { ActionItemID, SummaryID, isActive, ...rest } = item;
              const startDate = this.formateDate(report.Summary.CreatedOn);
              const etaDate = this.formateDate(rest.ETA);
              const completionDate =
              this.formateDate(rest.CompletionDate) === '01-01-1' ? '' : this.formateDate(rest.CompletionDate);
            return { ...rest, 'Start Date': startDate, ETA: etaDate,CompletionDate: completionDate};
            });

            actionItemsData.push(...items);
          }
          actionItemsWorksheet.addRow([
            'ActionItem',
            'Owner',
            'Start Date',
            'ETA',
            'CompletionDate',
            'Status',
            'Remark',
          ]).font = headerStyle.font;
          fisrtRow = actionItemsWorksheet.getRow(1);
          fisrtRow.eachCell((cell, colNumber) => {
            cell.fill = headerStyle.fill;
          });

          // Teams sheet
          const teamsData = [];
          for (let i = 0; i < this.byweekSummaryReport.length; i++) {
            const report = this.byweekSummaryReport[i];
            const items = report.Teams.map((item) => {
              const { TeamID, SummaryID, ...rest } = item;
              return rest;
            });
            teamsData.push(...items);
          }
          teamsWorksheet.addRow([
            'TeamName',
            'LeadName',
            'TaskCompleted',
            'TaskInProgress',
            'CurrentWeekPlan',
          ]).font = headerStyle.font;
          fisrtRow = teamsWorksheet.getRow(1);
          fisrtRow.eachCell((cell, colNumber) => {
            cell.fill = headerStyle.fill;
          });

          for (let i = 0; i < this.byweekSummaryReport.length; i++) {
            const { SummaryID, ...report }: any =
              this.byweekSummaryReport[i].Summary;

            // Map the status values to the desired labels
            report.OverallStatus = this.getStatusLabel(report.OverallStatus);
            report.ScheduleStatus = this.getStatusLabel(report.ScheduleStatus);
            report.ResourceStatus = this.getStatusLabel(report.ResourceStatus);
            report.RiskStatus = this.getStatusLabel(report.RiskStatus);

            // Format dates and update the corresponding cells
            this._summaryData = this.formateDate(report.CreatedOn);
            report.CreatedOn = this._summaryData;
            this._summaryData = this.formateDate(report.WeekEndingDate);
            report.WeekEndingDate = this._summaryData;
            this._summaryData = this.formateDate(report.UpdatedOn);
            if (this._summaryData === '01-01-1') {
              this._summaryData = '';
              report.UpdatedOn = this._summaryData;
            } else {
              report.UpdatedOn = this._summaryData;
            }

            report['SummitLead'] = report['Name'];
            delete report['Name'];

            //Adding report to worksheet
            summaryWorksheet.addRow(
              Object.values([
                report.SummitLead,
                report.CreatedBy,
                report.CreatedOn,
                report.UpdatedBy,
                report.UpdatedOn,
                report.Overall,
                report.OverallStatus,
                report.ScheduleStatus,
                report.ResourceStatus,
                report.Risk,
                report.RiskStatus,
                report.WeekEndingDate,
                report.RiskMitigation,
              ])
            );

            //Applying colors to columns cells based on conditions
            const summaryoverallStatus = summaryWorksheet.getColumn('G');
            summaryoverallStatus.eachCell(
              // { includeEmpty: true },
              (cell, rowNumber) => {
                let sColor = this.getStatusColor(cell.value);
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: sColor },
                };
              }
            );
            const summaryscheduleStatus = summaryWorksheet.getColumn('H');
            summaryscheduleStatus.eachCell(
              // { includeEmpty: true },
              (cell, rowNumber) => {
                let sColor = this.getStatusColor(cell.value);
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: sColor },
                };
              }
            );
            const summaryresourceStatus = summaryWorksheet.getColumn('I');
            summaryresourceStatus.eachCell((cell, rowNumber) => {
              let sColor = this.getStatusColor(cell.value);
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: sColor },
              };
            });
            const summaryrriskStatus = summaryWorksheet.getColumn('K');
            summaryrriskStatus.eachCell((cell, rowNumber) => {
              let sColor = this.getStatusColor(cell.value);
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: sColor },
              };
            });
          }
          //add action data
          actionItemsData.forEach((item) => {
            const rowDate = [
              item.ActionItem,
              item.Owner,
              item['Start Date'],
              item.ETA,
              item.CompletionDate,
              item.Status,
              item.Remarks,
            ];
            actionItemsWorksheet.addRow(rowDate);
          });
          //add teams data
          teamsData.forEach((item) => {
            teamsWorksheet.addRow(Object.values(item));
          });

          //set column width for all columns
          summaryWorksheet.columns.forEach((column) => {
            column.width = 15;
          });
          actionItemsWorksheet.columns.forEach((column) => {
            column.width = 15;
          });
          teamsWorksheet.columns.forEach((column) => {
            column.width = 15;
          });

          // Convert the workbook to Excel file
          workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            FileSaver.saveAs(blob, this.datefilename);
          });
        } else {
          alert('Please choose correct Start Date and End Date');
        }
      });
  }

  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  formateDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  getStatusLabel(status: string) {
    if (status === 'g') {
      return 'Good';
    } else if (status === 'y') {
      return 'Medium';
    } else if (status === 'r') {
      return 'Critical';
    }
    return status;
  }

  getStatusColor(value: any) {
    if (value === 'Good') {
      return '00FF00';
    } else if (value === 'Medium') {
      return 'FFFF00';
    } else if (value === 'Critical') {
      return 'FF0000';
    } else if (
      value === 'OverallStatus' ||
      value === 'ScheduleStatus' ||
      value === 'ResourceStatus' ||
      value === 'RiskStatus'
    ) {
      return '00008B'; //dark blue
    }
    return '';
  }
}