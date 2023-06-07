import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { WriteVarExpr } from '@angular/compiler';

interface ichartdata {
  SprintUID: string
  SprintNumber: string,
  SprintName: string,
  PlannedWorkItems: number,
  CompletedWorkItems: number,
  IncompleteWorkItems: number,
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  @Input() summary_form: FormGroup;
  resultJson: ichartdata[] = []
  barChartOptions: any;
  //sprints: any[] = [];
  // selectedSprints: any[] = [];
  pointsPerStory: any[] = [];
  workItemsByStatus: any[] = [];
  TotalStoryPoints: number = 0;
  result: any[] = []
  barChartData: any = {
    labels: [],
    datasets: [
      {
        label: '',
        backgroundColor: [],
        borderColor: [],
        data: []
      },
      {
        label: '',
        backgroundColor: [],
        borderColor: [],
        data: []
      },
      {
        label: '',
        backgroundColor: [],
        borderColor: [],
        data: []
      },
    ]
  };
  pieChartData: any = {
    labels: ['Sprint10', 'Sprint11', 'Sprint57'],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: []
      }
    ]
  };
  pieChartOptions: any;
  default_colors: string[] = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
  '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E',
  '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC',
  '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC']

  ngOnInit(): void {

    this.bindChartWorkItemsByStatus();
    this.bindChartPointsPerSprint();
  }
  bindChartWorkItemsByStatus() {
    // var sprintUIDs = this.selectedSprints.map(x => x.sprintUID);
    // this.workItemsByStatus = [];

    // this.chartVelocityService.getSprintWorkItemsCountByStatus(sprintUIDs).subscribe((result) => {
    //   for (let i = 0; i < this.selectedSprints.length; i++) {
  
    this.getResult();
    

      this.resultJson = [{
        "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",

        "SprintNumber": "Sprint57",

        "SprintName": "Sprint57",

        "PlannedWorkItems": 158,

        "CompletedWorkItems": 56,

        "IncompleteWorkItems": 102 }
      ]

      

    
    //this.resultJson = this.result;
    for (let i = 0; i < this.resultJson.length; i++) {
      //this.result[Object.keys(result)[i]];

      this.workItemsByStatus.push({
        sprintUID: this.resultJson[i].SprintUID,
        sprintNumber: this.resultJson[i].SprintNumber,
        sprintName: this.resultJson[i].SprintName,
        planned: this.resultJson[i].PlannedWorkItems,
        completed: this.resultJson[i].CompletedWorkItems,
        incomplete: this.resultJson[i].IncompleteWorkItems,
      });
    }

    this.plotBarChart();
    //}
    // }, (error) => {
    //   console.log(error);
    // },
    // () => {
    //   this.plotBarChart();
    // });
  }
  plotBarChart() {
    this.configureBarChart();
    // let labels = ["test"];
    // let planned = [100];
    // let completed = [40];
    // let incomplete = [60];

    let labels = this.workItemsByStatus.map(x => x.sprintNumber);
    let planned = this.workItemsByStatus.map(x => x.planned);
    let completed = this.workItemsByStatus.map(x => x.completed);
    let incomplete = this.workItemsByStatus.map(x => x.incomplete);

    let temp: any = this.barChartData;
    temp.labels = labels;
    temp.datasets[0].data = planned;
    temp.datasets[1].data = completed;
    temp.datasets[2].data = incomplete;
    this.barChartData = Object.assign({}, temp);
  }

  configureBarChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barChartData = {
      labels: ['Planned', 'Completed', 'Incomplete'],
      datasets: [
        {
          label: 'Planned',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: []
        },
        {
          label: 'Completed',
          backgroundColor: documentStyle.getPropertyValue('--green-500'),
          borderColor: documentStyle.getPropertyValue('--green-500'),
          data: []
        },
        {
          label: 'Incomplete',
          backgroundColor: documentStyle.getPropertyValue('--red-500'),
          borderColor: documentStyle.getPropertyValue('--red-500'),
          data: []
        },
      ]
    };
    this.barChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Count of Work Items",
            font: {
              size: 18
            }
          },
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
            text: "Tasks",
            font: {
              size: 18
            }
          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Count of Work Items',
            fontColor: '#757575',
            fontSize: 12
          }
        }

      }
    };
  }
  bindChartPointsPerSprint() {
    // var sprintUIDs = this.selectedSprints.map(x => x.sprintUID);
    // this.pointsPerStory = [];
    // this.TotalStoryPoints = 0;

   // this.chartVelocityService.getTotalPointsPerStory(sprintUIDs).subscribe((result) => {
     // for (let i = 0; i < this.selectedSprints.length; i++) {
        // var storyPointsForSprint = result[Object.keys(result)[i]];
        // this.TotalStoryPoints += storyPointsForSprint.TotalPoints;

        
         var storyPointsForSprint = [{
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
  
          "SprintNumber": "Sprint57",
  
          "SprintName": "Sprint57",
  
          "PlannedWorkItems": 158,
  
          "CompletedWorkItems": 56,
  
          "IncompleteWorkItems": 102 }
        ]

        var temmp=[
          {
              "itemType": "Bug",
              "new": 2,
              "active": 1,
              "prReview": 0,
              "resolved": 67,
              "deliveredToQA": 0,
              "closed": 14,
              "removed": 0,
              "total": 84
          },
          {
              "itemType": "User Story",
              "new": 0,
              "active": 5,
              "prReview": 1,
              "resolved": 15,
              "deliveredToQA": 9,
              "closed": 42,
              "removed": 2,
              "total": 74
          },  
          {
              "itemType": "Total",
              "new": 2,
              "active": 6,
              "prReview": 1,
              "resolved": 82,
              "deliveredToQA": 9,
              "closed": 56,
              "removed": 2,
              "total": 158
          }
      
  ]
        this.pointsPerStory.push({
          sprintUID: storyPointsForSprint[0].SprintUID,
          sprintNumber: storyPointsForSprint[0].SprintNumber,
          sprintName: storyPointsForSprint[0].SprintName,
          totalPoints:[15,10,8,5],
        });
     // }
    // }, (error) => {
    //   console.log(error);
    // },
    //   () => {
        //this.plotDoughChart();
      // });
      this.plotDoughChart();
  }
  plotDoughChart() {
    this.pieChartData = {
      labels: ['Story','Completed Story' ,'Resolved Bugs','Bugs'],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: []
        }
      ]
    };

     //let labels = this.pointsPerStory.map(x => x.sprintNumber);
     let chartData = this.pointsPerStory.map(x => x.totalPoints);

    let pieColors = this.configureDefaultColours(chartData);
    this.configurePieChart(pieColors);
    let temp: any = this.pieChartData;
   // temp.labels = ["total","qwe","qwerty"];
  //  temp.datasets[0].data = chartData;
    this.pieChartData = Object.assign({}, temp);
  }

  configureDefaultColours(data: number[]): string[] {
    let customColours: string[] = [];
    if (data.length) {
      customColours = data.map((element, idx) => {
        return this.default_colors[idx % this.default_colors.length];
      });
    }
    return customColours;
  }

  configurePieChart(pieColors: string[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.pieChartData = {

      labels: ['Story','Completed Story' ,'Resolved Bugs','Bugs'],

      datasets: [

          {

              data: [15,10,8,5],

              backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],

              hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]

          }

      ]

  };

    this.pieChartOptions = {
      plugins: {
        legend: {
          position: "right",
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }
  getResult() {
    this.result =
      [
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 29786,
          "ItemType": "User Story",
          "Title": "Additional US: Testing for Bulk Emails & Notification Parsers- Part 1 ",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 29789,
          "TaskName": "Testing",
          "EmpName": "Saket Jha",
          "TaskDate": "2023-03-30T10:53:19",
          "TaskStatus": "Closed",
          "DurationInHrs": 19.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31368,
          "ItemType": "User Story",
          "Title": "System setup and Onboarding",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30212,
          "TaskName": "Icon retention and add delete option for uploaded image",
          "EmpName": "Sahaj Preet Singh Grover",
          "TaskDate": "2023-04-05T21:54:08",
          "TaskStatus": "Closed",
          "DurationInHrs": 15
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 28376,
          "ItemType": "Bug",
          "Title": "Automation>>NTP_B036>>MSSQL & MYSQL>>Notfication Designer>> Unable to Enter Text in Description field and Unable to edit existing notification element",
          "Points": 0,
          "WorkItemStatus": "Resolved",
          "TaskId": 30230,
          "TaskName": "After drag any Field or Grid, if I press delete key or back space close to the item, then chip is not saving properly so replication is creating issue.",
          "EmpName": "Roshankumar Shah",
          "TaskDate": "2023-04-06T10:16:51",
          "TaskStatus": "Closed",
          "DurationInHrs": 8
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30383,
          "ItemType": "User Story",
          "Title": "Verifying & Fixing Date Time Format",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 30385,
          "TaskName": "Development",
          "EmpName": "Shreyash Mahendra Pawar",
          "TaskDate": "2023-04-09T19:03:04",
          "TaskStatus": "Closed",
          "DurationInHrs": 14
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30351,
          "ItemType": "User Story",
          "Title": "Soft Delete Scheduler Tracker",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30386,
          "TaskName": "Update the is_active from 1 to 0 and hence make the scheduler inactive when it is changed to maintenance.",
          "EmpName": "Garima Srivastav",
          "TaskDate": "2023-04-09T19:38:28",
          "TaskStatus": "Closed",
          "DurationInHrs": 7
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30387,
          "ItemType": "User Story",
          "Title": "PRD Validations (Workflow Designer) - Part 1",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 30388,
          "TaskName": "Analysis",
          "EmpName": "Pooja Narwade",
          "TaskDate": "2023-04-09T20:30:35",
          "TaskStatus": "Closed",
          "DurationInHrs": 24
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30389,
          "ItemType": "User Story",
          "Title": "Additional US: Testing Application Studio MsSql Insertions and Updations for Data Sync: PART 2",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30390,
          "TaskName": "Testing and Updating Document",
          "EmpName": "Himanshu Chaudhary",
          "TaskDate": "2023-04-09T21:31:12",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30400,
          "ItemType": "User Story",
          "Title": "Api modifications to get status of workflow",
          "Points": 1,
          "WorkItemStatus": "Resolved",
          "TaskId": 30402,
          "TaskName": "Analysis",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-10T09:55:19",
          "TaskStatus": "Closed",
          "DurationInHrs": 3
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30400,
          "ItemType": "User Story",
          "Title": "Api modifications to get status of workflow",
          "Points": 1,
          "WorkItemStatus": "Resolved",
          "TaskId": 30403,
          "TaskName": "Development",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-10T09:55:55",
          "TaskStatus": "Closed",
          "DurationInHrs": 5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30424,
          "ItemType": "User Story",
          "Title": "Additional US: PR for DB Changes for Notification Parser ",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30425,
          "TaskName": "Development",
          "EmpName": "Saket Jha",
          "TaskDate": "2023-04-10T10:21:58",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30428,
          "ItemType": "User Story",
          "Title": "Additional US: Mailbox Change History Changes",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30430,
          "TaskName": "Development",
          "EmpName": "Saket Jha",
          "TaskDate": "2023-04-10T10:25:45",
          "TaskStatus": "Closed",
          "DurationInHrs": 8
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30428,
          "ItemType": "User Story",
          "Title": "Additional US: Mailbox Change History Changes",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30431,
          "TaskName": "Testing",
          "EmpName": "Saket Jha",
          "TaskDate": "2023-04-10T10:26:02",
          "TaskStatus": "Closed",
          "DurationInHrs": 3.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30427,
          "ItemType": "User Story",
          "Title": "[Part II]Testing,Code cleanup activity and Elint issues",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30432,
          "TaskName": "Sonar Lint issues For UI",
          "EmpName": "Nikita Mukund Kulkarni",
          "TaskDate": "2023-04-10T10:26:25",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30437,
          "ItemType": "User Story",
          "Title": "Resolving UI PR Issues",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30438,
          "TaskName": "Resolving UI PR Issues",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-10T10:36:21",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30449,
          "ItemType": "User Story",
          "Title": "resolve sonar qube issues for UI",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30450,
          "TaskName": "resolve sonar qube issues for UI",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-10T11:11:13",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30490,
          "ItemType": "User Story",
          "Title": "Additional US: Holiday Calendar Location information message functionality",
          "Points": 1,
          "WorkItemStatus": "PR Review",
          "TaskId": 30491,
          "TaskName": "Development",
          "EmpName": "Joydeep Rana",
          "TaskDate": "2023-04-10T16:02:24",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30512,
          "ItemType": "User Story",
          "Title": "User_story:Validation for Publish Stepper",
          "Points": 2,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30515,
          "TaskName": "Validation For save /Update data Basis on Publish_To field",
          "EmpName": "Nikita Mukund Kulkarni",
          "TaskDate": "2023-04-10T17:03:12",
          "TaskStatus": "Closed",
          "DurationInHrs": 11
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30516,
          "ItemType": "User Story",
          "Title": "Additional US: Fixing insertion method for Tables doesn't have ID columns",
          "Points": 1,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30518,
          "TaskName": "Fixing issue and Unit Testing",
          "EmpName": "Himanshu Chaudhary",
          "TaskDate": "2023-04-10T17:04:21",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30511,
          "ItemType": "User Story",
          "Title": "Service Portal Numerical widget icon positioning",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 30520,
          "TaskName": "Code changes to implement position change",
          "EmpName": "Sahaj Preet Singh Grover",
          "TaskDate": "2023-04-10T17:06:26",
          "TaskStatus": "Closed",
          "DurationInHrs": 0
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30526,
          "ItemType": "User Story",
          "Title": "User_story:Navigation for Report in Quick Menu",
          "Points": 3,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30527,
          "TaskName": "Report Should be Linked to EndUserDashboard from Quick Menu",
          "EmpName": "Nikita Mukund Kulkarni",
          "TaskDate": "2023-04-10T17:29:26",
          "TaskStatus": "Closed",
          "DurationInHrs": 17
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30528,
          "ItemType": "User Story",
          "Title": "Additional US: Testing Application Studio MySql Insertions and Updations for Data Sync",
          "Points": 4,
          "WorkItemStatus": "Closed",
          "TaskId": 30533,
          "TaskName": "Testing and Updating Document",
          "EmpName": "Himanshu Chaudhary",
          "TaskDate": "2023-04-10T17:34:04",
          "TaskStatus": "Closed",
          "DurationInHrs": 19.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30543,
          "ItemType": "User Story",
          "Title": "As an app designer, I should be able to fix all button related UI_UX issues as per mockup",
          "Points": 2,
          "WorkItemStatus": "Resolved",
          "TaskId": 30544,
          "TaskName": "Analysis",
          "EmpName": "Suharta Banerjee",
          "TaskDate": "2023-04-10T18:15:11",
          "TaskStatus": "Closed",
          "DurationInHrs": 2
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30543,
          "ItemType": "User Story",
          "Title": "As an app designer, I should be able to fix all button related UI_UX issues as per mockup",
          "Points": 2,
          "WorkItemStatus": "Resolved",
          "TaskId": 30545,
          "TaskName": "Coding",
          "EmpName": "Suharta Banerjee",
          "TaskDate": "2023-04-10T18:16:05",
          "TaskStatus": "Closed",
          "DurationInHrs": 15
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30575,
          "ItemType": "User Story",
          "Title": "Additional Dev US: Working on new User Detail functionality-2",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 30576,
          "TaskName": "UI Task #30575",
          "EmpName": "Tushar Shukla",
          "TaskDate": "2023-04-11T08:36:10",
          "TaskStatus": "Closed",
          "DurationInHrs": 19.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30579,
          "ItemType": "User Story",
          "Title": "Api and ui modifications in Workflow History",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 30580,
          "TaskName": "Analysis",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-11T09:27:57",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30579,
          "ItemType": "User Story",
          "Title": "Api and ui modifications in Workflow History",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 30581,
          "TaskName": "Development",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-11T09:28:46",
          "TaskStatus": "Closed",
          "DurationInHrs": 9
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30579,
          "ItemType": "User Story",
          "Title": "Api and ui modifications in Workflow History",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 30582,
          "TaskName": "UI Task",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-11T09:30:42",
          "TaskStatus": "Closed",
          "DurationInHrs": 10
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30594,
          "ItemType": "User Story",
          "Title": "Custom script Analysis",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30597,
          "TaskName": "Analyze the implementation and documents",
          "EmpName": "Ravi Pinjarkar",
          "TaskDate": "2023-04-11T10:25:51",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30275,
          "ItemType": "Bug",
          "Title": "NTP_B038 : Notification Designer:  We are not getting inline message ",
          "Points": 0,
          "WorkItemStatus": "Resolved",
          "TaskId": 30604,
          "TaskName": "Service portal general stepper tenant field is not mapped properly while first time creating.",
          "EmpName": "Tanishq Valyal",
          "TaskDate": "2023-04-11T10:28:28",
          "TaskStatus": "Closed",
          "DurationInHrs": 7
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30606,
          "ItemType": "User Story",
          "Title": "Coded widget issues and Fixes",
          "Points": 2,
          "WorkItemStatus": "Resolved",
          "TaskId": 30607,
          "TaskName": "Pushed changes to Dev from Group branch and verified the merge.",
          "EmpName": "Ravi Pinjarkar",
          "TaskDate": "2023-04-11T10:30:56",
          "TaskStatus": "Closed",
          "DurationInHrs": 3
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30652,
          "ItemType": "User Story",
          "Title": "Minor fixes and PR raising",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30653,
          "TaskName": "PR raising for Theme UI changes",
          "EmpName": "Snehal Nyayadhis",
          "TaskDate": "2023-04-11T14:36:49",
          "TaskStatus": "Closed",
          "DurationInHrs": 3
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 28376,
          "ItemType": "Bug",
          "Title": "Automation>>NTP_B036>>MSSQL & MYSQL>>Notfication Designer>> Unable to Enter Text in Description field and Unable to edit existing notification element",
          "Points": 0,
          "WorkItemStatus": "Resolved",
          "TaskId": 30662,
          "TaskName": "Fixing Dotwalk on Edit for Notification Designer Grid",
          "EmpName": "Roshankumar Shah",
          "TaskDate": "2023-04-11T17:13:50",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30680,
          "ItemType": "User Story",
          "Title": "Grooming session on Notification Designer",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30681,
          "TaskName": "Analysis of Notification designer and Form Designer",
          "EmpName": "Garima Srivastav",
          "TaskDate": "2023-04-11T18:32:08",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30701,
          "ItemType": "User Story",
          "Title": "Additional US: SLA Rule - SLA Rule message display functionality.",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30702,
          "TaskName": "Development",
          "EmpName": "Joydeep Rana",
          "TaskDate": "2023-04-11T19:58:11",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30606,
          "ItemType": "User Story",
          "Title": "Coded widget issues and Fixes",
          "Points": 2,
          "WorkItemStatus": "Resolved",
          "TaskId": 30712,
          "TaskName": "Fixed all ESLint Warnings",
          "EmpName": "Ravi Pinjarkar",
          "TaskDate": "2023-04-12T09:23:03",
          "TaskStatus": "Closed",
          "DurationInHrs": 3
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30737,
          "ItemType": "User Story",
          "Title": "Carousel Issue in Dashboard/Report on clicking of last item from the List from End User Dashboard.",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30739,
          "TaskName": "UI Changes",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-12T10:47:11",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30736,
          "ItemType": "User Story",
          "Title": "Additional US: Reporting Known Issues",
          "Points": 2,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30815,
          "TaskName": "Stepper Issue on next",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-12T18:56:17",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30824,
          "ItemType": "User Story",
          "Title": "User_Story_Content_Select_Column_77",
          "Points": 3,
          "WorkItemStatus": "Active",
          "TaskId": 30825,
          "TaskName": "Create sub form widget",
          "EmpName": "Garima Srivastav",
          "TaskDate": "2023-04-12T22:10:29",
          "TaskStatus": "Closed",
          "DurationInHrs": 9.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30830,
          "ItemType": "User Story",
          "Title": "PRD Validations (Workflow Designer) - Part 2",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 30831,
          "TaskName": "Analysis",
          "EmpName": "Pooja Narwade",
          "TaskDate": "2023-04-12T23:20:13",
          "TaskStatus": "Closed",
          "DurationInHrs": 25
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30656,
          "ItemType": "Bug",
          "Title": "NTP_B038: Notification Designer: Observed UI issue.",
          "Points": 0,
          "WorkItemStatus": "Active",
          "TaskId": 30838,
          "TaskName": "Consumer page and End user dashboard page showing stepper items.",
          "EmpName": "Tanishq Valyal",
          "TaskDate": "2023-04-13T09:39:04",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30656,
          "ItemType": "Bug",
          "Title": "NTP_B038: Notification Designer: Observed UI issue.",
          "Points": 0,
          "WorkItemStatus": "Active",
          "TaskId": 30839,
          "TaskName": "Inconsistency in Stepper when press on cancel and again click on Add new Service Portal",
          "EmpName": "Tanishq Valyal",
          "TaskDate": "2023-04-13T09:44:06",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30427,
          "ItemType": "User Story",
          "Title": "[Part II]Testing,Code cleanup activity and Elint issues",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30849,
          "TaskName": "Sanity Testing on ITSM",
          "EmpName": "Nikita Mukund Kulkarni",
          "TaskDate": "2023-04-13T10:05:27",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30848,
          "ItemType": "User Story",
          "Title": "Additional US:  Bearer Token Generation from UserContext in Notification Parser - Part 1 ",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30851,
          "TaskName": "Development",
          "EmpName": "Saket Jha",
          "TaskDate": "2023-04-13T10:06:30",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30848,
          "ItemType": "User Story",
          "Title": "Additional US:  Bearer Token Generation from UserContext in Notification Parser - Part 1 ",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30852,
          "TaskName": "Testing",
          "EmpName": "Saket Jha",
          "TaskDate": "2023-04-13T10:06:54",
          "TaskStatus": "Removed",
          "DurationInHrs": 0
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30853,
          "ItemType": "User Story",
          "Title": "Spike US: Old Exchange URL's Excecution in Notification Parser",
          "Points": 1,
          "WorkItemStatus": "Removed",
          "TaskId": 30854,
          "TaskName": "Analysis",
          "EmpName": "Saket Jha",
          "TaskDate": "2023-04-13T10:08:19",
          "TaskStatus": "Removed",
          "DurationInHrs": 0
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30856,
          "ItemType": "User Story",
          "Title": "User Story Approver Action in Notification Designer",
          "Points": 5,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30857,
          "TaskName": "Analysis of Implementing Approver Actions in Notification Grid",
          "EmpName": "Roshankumar Shah",
          "TaskDate": "2023-04-13T10:17:14",
          "TaskStatus": "Closed",
          "DurationInHrs": 1
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30856,
          "ItemType": "User Story",
          "Title": "User Story Approver Action in Notification Designer",
          "Points": 5,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30859,
          "TaskName": "Implementation of UI related to Approver Action",
          "EmpName": "Roshankumar Shah",
          "TaskDate": "2023-04-13T10:21:49",
          "TaskStatus": "Closed",
          "DurationInHrs": 19
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30856,
          "ItemType": "User Story",
          "Title": "User Story Approver Action in Notification Designer",
          "Points": 5,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30861,
          "TaskName": "DB and API side changes related to Approver Actions.",
          "EmpName": "Roshankumar Shah",
          "TaskDate": "2023-04-13T10:23:36",
          "TaskStatus": "Closed",
          "DurationInHrs": 12.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30856,
          "ItemType": "User Story",
          "Title": "User Story Approver Action in Notification Designer",
          "Points": 5,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30862,
          "TaskName": "Unit Testing",
          "EmpName": "Roshankumar Shah",
          "TaskDate": "2023-04-13T10:24:39",
          "TaskStatus": "Closed",
          "DurationInHrs": 1
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30863,
          "ItemType": "User Story",
          "Title": "Resolving Issues for Development Branch in UI & API, ITSM Deployment Changes",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30864,
          "TaskName": "Resolving Issues for Development Branch in UI & API, ITSM Deployment Changes",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-13T10:29:19",
          "TaskStatus": "Closed",
          "DurationInHrs": 8
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30652,
          "ItemType": "User Story",
          "Title": "Minor fixes and PR raising",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30866,
          "TaskName": "Sanity Testing for changes on ITSM",
          "EmpName": "Snehal Nyayadhis",
          "TaskDate": "2023-04-13T11:02:52",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30736,
          "ItemType": "User Story",
          "Title": "Additional US: Reporting Known Issues",
          "Points": 2,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30890,
          "TaskName": "Issue for loading dashboard and Report list in ITSM",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-13T17:18:38",
          "TaskStatus": "Closed",
          "DurationInHrs": 2
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30736,
          "ItemType": "User Story",
          "Title": "Additional US: Reporting Known Issues",
          "Points": 2,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30894,
          "TaskName": "Resolution issue for end user and Designer in report/ Dashboard",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-13T18:03:07",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30898,
          "ItemType": "User Story",
          "Title": "Additional US: Enable or Disable Data sync in Summit App & Check Source and Target DBs to block or Allow Data Synching",
          "Points": 2,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30899,
          "TaskName": "Development & Testing",
          "EmpName": "Himanshu Chaudhary",
          "TaskDate": "2023-04-13T18:56:17",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30906,
          "ItemType": "User Story",
          "Title": "As an app designer, I should be able to validate all controls as per mockup",
          "Points": 2,
          "WorkItemStatus": "Resolved",
          "TaskId": 30908,
          "TaskName": "Analysis",
          "EmpName": "Suharta Banerjee",
          "TaskDate": "2023-04-13T20:13:34",
          "TaskStatus": "Closed",
          "DurationInHrs": 3.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30906,
          "ItemType": "User Story",
          "Title": "As an app designer, I should be able to validate all controls as per mockup",
          "Points": 2,
          "WorkItemStatus": "Resolved",
          "TaskId": 30909,
          "TaskName": "Coding",
          "EmpName": "Suharta Banerjee",
          "TaskDate": "2023-04-13T20:14:17",
          "TaskStatus": "Closed",
          "DurationInHrs": 15
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30911,
          "ItemType": "User Story",
          "Title": "Review points localStorage",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30912,
          "TaskName": "Analysis",
          "EmpName": "Shreyash Mahendra Pawar",
          "TaskDate": "2023-04-13T20:21:06",
          "TaskStatus": "Closed",
          "DurationInHrs": 2
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30911,
          "ItemType": "User Story",
          "Title": "Review points localStorage",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 30913,
          "TaskName": "Development",
          "EmpName": "Shreyash Mahendra Pawar",
          "TaskDate": "2023-04-13T20:22:45",
          "TaskStatus": "Closed",
          "DurationInHrs": 11
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30917,
          "ItemType": "User Story",
          "Title": "SLA Value - Issue while saving criteria",
          "Points": 3,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30918,
          "TaskName": "Development",
          "EmpName": "Komal Khatkole",
          "TaskDate": "2023-04-14T07:25:50",
          "TaskStatus": "Closed",
          "DurationInHrs": 8
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30917,
          "ItemType": "User Story",
          "Title": "SLA Value - Issue while saving criteria",
          "Points": 3,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30919,
          "TaskName": "Analysis",
          "EmpName": "Komal Khatkole",
          "TaskDate": "2023-04-14T07:26:20",
          "TaskStatus": "Closed",
          "DurationInHrs": 5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30917,
          "ItemType": "User Story",
          "Title": "SLA Value - Issue while saving criteria",
          "Points": 3,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30920,
          "TaskName": "Unit Testing",
          "EmpName": "Komal Khatkole",
          "TaskDate": "2023-04-14T07:26:39",
          "TaskStatus": "Closed",
          "DurationInHrs": 7
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30652,
          "ItemType": "User Story",
          "Title": "Minor fixes and PR raising",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 30922,
          "TaskName": "System theme clone functionality",
          "EmpName": "Snehal Nyayadhis",
          "TaskDate": "2023-04-14T09:47:26",
          "TaskStatus": "Closed",
          "DurationInHrs": 6
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30932,
          "ItemType": "User Story",
          "Title": "Spike US: Subject and Body with Column values in report/Dashboard",
          "Points": 5,
          "WorkItemStatus": "Closed",
          "TaskId": 30933,
          "TaskName": "Understand Subject and Body with Column values from Notification Designer",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-14T10:36:58",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30921,
          "ItemType": "User Story",
          "Title": "Custom Script - Find and add missing elements  or controls in custom widget",
          "Points": 3,
          "WorkItemStatus": "Active",
          "TaskId": 30934,
          "TaskName": "Check if not followed coding standard while adding elements.",
          "EmpName": "Ravi Pinjarkar",
          "TaskDate": "2023-04-14T10:42:49",
          "TaskStatus": "Closed",
          "DurationInHrs": 15
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30941,
          "ItemType": "User Story",
          "Title": "Additional Dev US: Working on new User Detail functionality-3",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 30942,
          "TaskName": "UI Task#30941",
          "EmpName": "Tushar Shukla",
          "TaskDate": "2023-04-14T12:47:22",
          "TaskStatus": "Closed",
          "DurationInHrs": 19.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30916,
          "ItemType": "Bug",
          "Title": "NTP_B038: Notification Designer: Description field is not accepting 2000 characters (only accepting 1993 characters)",
          "Points": 0,
          "WorkItemStatus": "Resolved",
          "TaskId": 30955,
          "TaskName": "Inconsistency in stepper, on alternate clicks on existing service portal stepper was not turning to green color.",
          "EmpName": "Tanishq Valyal",
          "TaskDate": "2023-04-14T16:23:52",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30921,
          "ItemType": "User Story",
          "Title": "Custom Script - Find and add missing elements  or controls in custom widget",
          "Points": 3,
          "WorkItemStatus": "Active",
          "TaskId": 30956,
          "TaskName": "Go through session on Implementation and documents of Custom script.",
          "EmpName": "Ravi Pinjarkar",
          "TaskDate": "2023-04-14T16:27:38",
          "TaskStatus": "Closed",
          "DurationInHrs": 5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30606,
          "ItemType": "User Story",
          "Title": "Coded widget issues and Fixes",
          "Points": 2,
          "WorkItemStatus": "Resolved",
          "TaskId": 30959,
          "TaskName": "Null reference error at core, when we save widget with Code but not Coded widget.",
          "EmpName": "Ravi Pinjarkar",
          "TaskDate": "2023-04-14T17:13:15",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30898,
          "ItemType": "User Story",
          "Title": "Additional US: Enable or Disable Data sync in Summit App & Check Source and Target DBs to block or Allow Data Synching",
          "Points": 2,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 30969,
          "TaskName": "Updating code changes related to Data sync",
          "EmpName": "Himanshu Chaudhary",
          "TaskDate": "2023-04-15T01:47:30",
          "TaskStatus": "Closed",
          "DurationInHrs": 3.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30824,
          "ItemType": "User Story",
          "Title": "User_Story_Content_Select_Column_77",
          "Points": 3,
          "WorkItemStatus": "Active",
          "TaskId": 30975,
          "TaskName": "Create SubFormWidget Mapper",
          "EmpName": "Garima Srivastav",
          "TaskDate": "2023-04-16T14:14:53",
          "TaskStatus": "Active",
          "DurationInHrs": 10
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30526,
          "ItemType": "User Story",
          "Title": "User_story:Navigation for Report in Quick Menu",
          "Points": 3,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 31001,
          "TaskName": "Navigation of Reports On Menu bar and css issues",
          "EmpName": "Nikita Mukund Kulkarni",
          "TaskDate": "2023-04-17T10:06:00",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30737,
          "ItemType": "User Story",
          "Title": "Carousel Issue in Dashboard/Report on clicking of last item from the List from End User Dashboard.",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 31002,
          "TaskName": "Dynamic Graph, Changing Tab for Dashboard/Reports instead of Buttons, Changes as per mockup",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-17T10:11:53",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30974,
          "ItemType": "User Story",
          "Title": "Add custom columns in available/default columns list based on the selected sla types in widget of form designer 3rd stepper",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 31010,
          "TaskName": "Development",
          "EmpName": "Komal Khatkole",
          "TaskDate": "2023-04-17T10:32:03",
          "TaskStatus": "Closed",
          "DurationInHrs": 10
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30974,
          "ItemType": "User Story",
          "Title": "Add custom columns in available/default columns list based on the selected sla types in widget of form designer 3rd stepper",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 31011,
          "TaskName": "Analysis",
          "EmpName": "Komal Khatkole",
          "TaskDate": "2023-04-17T10:33:24",
          "TaskStatus": "Closed",
          "DurationInHrs": 6
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30974,
          "ItemType": "User Story",
          "Title": "Add custom columns in available/default columns list based on the selected sla types in widget of form designer 3rd stepper",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 31012,
          "TaskName": "Unit Testing",
          "EmpName": "Komal Khatkole",
          "TaskDate": "2023-04-17T10:33:40",
          "TaskStatus": "Closed",
          "DurationInHrs": 5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31008,
          "ItemType": "User Story",
          "Title": "Additional US: SLA-Rule - SLA Criteria is not matched to the selected Table in General Stepper.",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31013,
          "TaskName": "Development",
          "EmpName": "Joydeep Rana",
          "TaskDate": "2023-04-17T10:35:18",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31057,
          "ItemType": "User Story",
          "Title": "Dynamically binding Report/Dashboard Type in End User Dashboard",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 31058,
          "TaskName": "Dynamically binding Report/Dashboard Type in List End User Dashboard",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-18T00:19:38",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31327,
          "ItemType": "User Story",
          "Title": "Creation of Custom Widget dropdown for saving Widget in service portal",
          "Points": 0,
          "WorkItemStatus": "Closed",
          "TaskId": 31062,
          "TaskName": "Analysis, approach and documentation for custom widget feature in service portal",
          "EmpName": "Tanishq Valyal",
          "TaskDate": "2023-04-18T09:51:44",
          "TaskStatus": "Closed",
          "DurationInHrs": 16
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30932,
          "ItemType": "User Story",
          "Title": "Spike US: Subject and Body with Column values in report/Dashboard",
          "Points": 5,
          "WorkItemStatus": "Closed",
          "TaskId": 31070,
          "TaskName": "Implement Subject and Body with Column values in report/Dashboard",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-18T10:07:03",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30932,
          "ItemType": "User Story",
          "Title": "Spike US: Subject and Body with Column values in report/Dashboard",
          "Points": 5,
          "WorkItemStatus": "Closed",
          "TaskId": 31071,
          "TaskName": "Analyze how to replace Subject and Body while send Email",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-18T10:07:52",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31102,
          "ItemType": "User Story",
          "Title": "Custom Script Functionality",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 31104,
          "TaskName": "Analysis",
          "EmpName": "Suharta Banerjee",
          "TaskDate": "2023-04-18T17:48:46",
          "TaskStatus": "Closed",
          "DurationInHrs": 21
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31107,
          "ItemType": "User Story",
          "Title": "As a System, when a child Master Type is selected as Data Source before Parent Master Type, display error message as ‘Create a field Parent Master Type ‘<Master Type Name>’ before selecting Child Master Type ‘<Master Type Name>’’. ",
          "Points": 3,
          "WorkItemStatus": "Active",
          "TaskId": 31108,
          "TaskName": "Analysis Task #31107",
          "EmpName": "Tushar Shukla",
          "TaskDate": "2023-04-18T18:18:05",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31107,
          "ItemType": "User Story",
          "Title": "As a System, when a child Master Type is selected as Data Source before Parent Master Type, display error message as ‘Create a field Parent Master Type ‘<Master Type Name>’ before selecting Child Master Type ‘<Master Type Name>’’. ",
          "Points": 3,
          "WorkItemStatus": "Active",
          "TaskId": 31120,
          "TaskName": "UI Task #31107",
          "EmpName": "Tushar Shukla",
          "TaskDate": "2023-04-18T20:23:24",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31128,
          "ItemType": "User Story",
          "Title": "Spike US: Validated Notes and tooltip messages.",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31129,
          "TaskName": "Analysis",
          "EmpName": "Joydeep Rana",
          "TaskDate": "2023-04-19T00:55:59",
          "TaskStatus": "Closed",
          "DurationInHrs": 2
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31134,
          "ItemType": "User Story",
          "Title": "Showing activities in workflow history and if workflow attached for first time showing it in workflow history",
          "Points": 1,
          "WorkItemStatus": "Resolved",
          "TaskId": 31135,
          "TaskName": "Analysis",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-19T09:33:56",
          "TaskStatus": "Closed",
          "DurationInHrs": 3
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31134,
          "ItemType": "User Story",
          "Title": "Showing activities in workflow history and if workflow attached for first time showing it in workflow history",
          "Points": 1,
          "WorkItemStatus": "Resolved",
          "TaskId": 31136,
          "TaskName": "Development",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-19T09:34:44",
          "TaskStatus": "Closed",
          "DurationInHrs": 7
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31138,
          "ItemType": "User Story",
          "Title": "Addiitonal US: Notification Parser Execution Codebase Walkthrough Points",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 31140,
          "TaskName": "Development",
          "EmpName": "Saket Jha",
          "TaskDate": "2023-04-19T09:59:41",
          "TaskStatus": "Closed",
          "DurationInHrs": 11
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31138,
          "ItemType": "User Story",
          "Title": "Addiitonal US: Notification Parser Execution Codebase Walkthrough Points",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 31142,
          "TaskName": "Testing",
          "EmpName": "Saket Jha",
          "TaskDate": "2023-04-19T10:00:10",
          "TaskStatus": "Closed",
          "DurationInHrs": 10.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31155,
          "ItemType": "User Story",
          "Title": "Spike: Mega Menu issue",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31158,
          "TaskName": "Help Nikita For resolving mega menu Most used menu action issue",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-19T10:14:26",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31160,
          "ItemType": "User Story",
          "Title": "ITSM Dashboard/Report Changes",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31161,
          "TaskName": "ITSM Dashboard/Report Changes",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-19T10:21:21",
          "TaskStatus": "Closed",
          "DurationInHrs": 2
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30856,
          "ItemType": "User Story",
          "Title": "User Story Approver Action in Notification Designer",
          "Points": 5,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 31164,
          "TaskName": "Handling copying of Widget according to Medium as well as Language.",
          "EmpName": "Roshankumar Shah",
          "TaskDate": "2023-04-19T10:27:31",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30932,
          "ItemType": "User Story",
          "Title": "Spike US: Subject and Body with Column values in report/Dashboard",
          "Points": 5,
          "WorkItemStatus": "Closed",
          "TaskId": 31197,
          "TaskName": "analyze how to Add Element related to Report/Dashboard to the Report/Dashboard screen",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-19T18:13:17",
          "TaskStatus": "Closed",
          "DurationInHrs": 11
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31195,
          "ItemType": "User Story",
          "Title": "Search control in coded widget with API call",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 31206,
          "TaskName": "Analyze and add the control for Search functionality",
          "EmpName": "Ravi Pinjarkar",
          "TaskDate": "2023-04-19T19:52:43",
          "TaskStatus": "Closed",
          "DurationInHrs": 16
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31224,
          "ItemType": "User Story",
          "Title": "Workflow notification functionality",
          "Points": 3,
          "WorkItemStatus": "Active",
          "TaskId": 31226,
          "TaskName": "Analysis",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-20T09:19:58",
          "TaskStatus": "Closed",
          "DurationInHrs": 7
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31224,
          "ItemType": "User Story",
          "Title": "Workflow notification functionality",
          "Points": 3,
          "WorkItemStatus": "Active",
          "TaskId": 31227,
          "TaskName": "Development",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-20T09:20:50",
          "TaskStatus": "Closed",
          "DurationInHrs": 14
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30512,
          "ItemType": "User Story",
          "Title": "User_story:Validation for Publish Stepper",
          "Points": 2,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 31229,
          "TaskName": "Issue resolved with save/Update data on publish stepper when status is Designed/Maintenance/Retired",
          "EmpName": "Nikita Mukund Kulkarni",
          "TaskDate": "2023-04-20T09:53:36",
          "TaskStatus": "Closed",
          "DurationInHrs": 3.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31239,
          "ItemType": "User Story",
          "Title": "ITSM Dashboard/Report Modifications - Binding images based on chart configured",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 31241,
          "TaskName": "ITSM Dashboard/Report Modifications - Binding images based on chart configured",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-20T10:19:31",
          "TaskStatus": "Closed",
          "DurationInHrs": 10
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30528,
          "ItemType": "User Story",
          "Title": "Additional US: Testing Application Studio MySql Insertions and Updations for Data Sync",
          "Points": 4,
          "WorkItemStatus": "Closed",
          "TaskId": 31289,
          "TaskName": "Fixing Issues related to MySql Data Sync",
          "EmpName": "Himanshu Chaudhary",
          "TaskDate": "2023-04-20T19:49:26",
          "TaskStatus": "Closed",
          "DurationInHrs": 3
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31297,
          "ItemType": "User Story",
          "Title": "Workflow Designer: Fix Button, Switch, Radio Button, Checkboxes, Icons and Chips related UI_UX issues as per mockup.",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 31298,
          "TaskName": "Analysis",
          "EmpName": "Pooja Narwade",
          "TaskDate": "2023-04-20T21:17:42",
          "TaskStatus": "Closed",
          "DurationInHrs": 2.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31297,
          "ItemType": "User Story",
          "Title": "Workflow Designer: Fix Button, Switch, Radio Button, Checkboxes, Icons and Chips related UI_UX issues as per mockup.",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 31299,
          "TaskName": "Development",
          "EmpName": "Pooja Narwade",
          "TaskDate": "2023-04-20T21:18:28",
          "TaskStatus": "Closed",
          "DurationInHrs": 24
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31305,
          "ItemType": "User Story",
          "Title": "User_Story_Data_Source_Tab_5 ",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 31306,
          "TaskName": "UI Task #31305",
          "EmpName": "Tushar Shukla",
          "TaskDate": "2023-04-21T09:08:00",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31195,
          "ItemType": "User Story",
          "Title": "Search control in coded widget with API call",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 31312,
          "TaskName": "Access public API for search control.",
          "EmpName": "Ravi Pinjarkar",
          "TaskDate": "2023-04-21T10:08:15",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30427,
          "ItemType": "User Story",
          "Title": "[Part II]Testing,Code cleanup activity and Elint issues",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 31315,
          "TaskName": "Testing,Elint Issues,Raising PR",
          "EmpName": "Nikita Mukund Kulkarni",
          "TaskDate": "2023-04-21T10:09:29",
          "TaskStatus": "Closed",
          "DurationInHrs": 3
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31318,
          "ItemType": "User Story",
          "Title": "custom columns in available/default columns list should save/update with all details while save form",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 31319,
          "TaskName": "Analysis",
          "EmpName": "Komal Khatkole",
          "TaskDate": "2023-04-21T10:19:04",
          "TaskStatus": "Closed",
          "DurationInHrs": 3.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31318,
          "ItemType": "User Story",
          "Title": "custom columns in available/default columns list should save/update with all details while save form",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 31320,
          "TaskName": "Development",
          "EmpName": "Komal Khatkole",
          "TaskDate": "2023-04-21T10:19:46",
          "TaskStatus": "Closed",
          "DurationInHrs": 10
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31318,
          "ItemType": "User Story",
          "Title": "custom columns in available/default columns list should save/update with all details while save form",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 31321,
          "TaskName": "Unit Testing",
          "EmpName": "Komal Khatkole",
          "TaskDate": "2023-04-21T10:20:11",
          "TaskStatus": "Closed",
          "DurationInHrs": 7
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31327,
          "ItemType": "User Story",
          "Title": "Creation of Custom Widget dropdown for saving Widget in service portal",
          "Points": 0,
          "WorkItemStatus": "Closed",
          "TaskId": 31328,
          "TaskName": "Creation of database table and Save As button functionality on UI",
          "EmpName": "Tanishq Valyal",
          "TaskDate": "2023-04-21T10:31:15",
          "TaskStatus": "Closed",
          "DurationInHrs": 13.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31325,
          "ItemType": "User Story",
          "Title": "Spike US: Documented errors in Notes & Tooltip messages.",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31329,
          "TaskName": "Analysis",
          "EmpName": "Joydeep Rana",
          "TaskDate": "2023-04-21T10:31:26",
          "TaskStatus": "Closed",
          "DurationInHrs": 2
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30528,
          "ItemType": "User Story",
          "Title": "Additional US: Testing Application Studio MySql Insertions and Updations for Data Sync",
          "Points": 4,
          "WorkItemStatus": "Closed",
          "TaskId": 31339,
          "TaskName": "Code clean up, Raising PR & Fixing SonarQube Issues",
          "EmpName": "Himanshu Chaudhary",
          "TaskDate": "2023-04-21T12:41:41",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31348,
          "ItemType": "User Story",
          "Title": "Custom Script Functionality - (Part-2)",
          "Points": 1,
          "WorkItemStatus": "Resolved",
          "TaskId": 31349,
          "TaskName": "Analysis",
          "EmpName": "Suharta Banerjee",
          "TaskDate": "2023-04-21T14:31:23",
          "TaskStatus": "Closed",
          "DurationInHrs": 8
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31359,
          "ItemType": "User Story",
          "Title": "Handling Nullable in Application",
          "Points": 1,
          "WorkItemStatus": "Resolved",
          "TaskId": 31360,
          "TaskName": "Development",
          "EmpName": "Suharta Banerjee",
          "TaskDate": "2023-04-21T18:09:27",
          "TaskStatus": "Closed",
          "DurationInHrs": 9
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31368,
          "ItemType": "User Story",
          "Title": "System setup and Onboarding",
          "Points": 2,
          "WorkItemStatus": "Closed",
          "TaskId": 31369,
          "TaskName": "Analysis",
          "EmpName": "Fatema Kapadia",
          "TaskDate": "2023-04-21T19:49:40",
          "TaskStatus": "Closed",
          "DurationInHrs": 13
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31389,
          "ItemType": "User Story",
          "Title": "Handling Null in application.",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31390,
          "TaskName": "Development",
          "EmpName": "Pooja Narwade",
          "TaskDate": "2023-04-24T09:43:33",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31327,
          "ItemType": "User Story",
          "Title": "Creation of Custom Widget dropdown for saving Widget in service portal",
          "Points": 0,
          "WorkItemStatus": "Closed",
          "TaskId": 31399,
          "TaskName": "Creation of API for inserting data into newly created table",
          "EmpName": "Tanishq Valyal",
          "TaskDate": "2023-04-24T10:13:43",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31398,
          "ItemType": "User Story",
          "Title": "Configuring Dashboards in ITSM, UI Changes related to Animation & Legends in Dashboard",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31400,
          "TaskName": "Configuring Dashboards in ITSM, UI Changes, Raising PR",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-24T10:14:21",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31403,
          "ItemType": "User Story",
          "Title": "Disable SLA Rule in Published State",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31406,
          "TaskName": "Analysis",
          "EmpName": "Shreyash Mahendra Pawar",
          "TaskDate": "2023-04-24T10:20:47",
          "TaskStatus": "Closed",
          "DurationInHrs": 3
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31403,
          "ItemType": "User Story",
          "Title": "Disable SLA Rule in Published State",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31407,
          "TaskName": "Development",
          "EmpName": "Shreyash Mahendra Pawar",
          "TaskDate": "2023-04-24T10:22:01",
          "TaskStatus": "Closed",
          "DurationInHrs": 3.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31416,
          "ItemType": "User Story",
          "Title": "Additional US: Create Data for Platform & Design Studio to be used for Reporting Configuration: Part 1",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31417,
          "TaskName": "Create Data for Reporting",
          "EmpName": "Himanshu Chaudhary",
          "TaskDate": "2023-04-24T10:51:06",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31428,
          "ItemType": "User Story",
          "Title": "Additional US: Corrected the Notes and Tooltip messages as per Mockup",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31431,
          "TaskName": "Development",
          "EmpName": "Joydeep Rana",
          "TaskDate": "2023-04-24T11:41:53",
          "TaskStatus": "Closed",
          "DurationInHrs": 3
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31464,
          "ItemType": "User Story",
          "Title": "Showing role based attributes in notification",
          "Points": 1,
          "WorkItemStatus": "Active",
          "TaskId": 31465,
          "TaskName": "Analysis",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-24T15:36:47",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31464,
          "ItemType": "User Story",
          "Title": "Showing role based attributes in notification",
          "Points": 1,
          "WorkItemStatus": "Active",
          "TaskId": 31466,
          "TaskName": "Development",
          "EmpName": "Swapnil Sakhare",
          "TaskDate": "2023-04-24T15:37:04",
          "TaskStatus": "Closed",
          "DurationInHrs": 6
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31476,
          "ItemType": "User Story",
          "Title": "Additional US : Issue on next in reporting scheduler if status is Published",
          "Points": 1,
          "WorkItemStatus": "Delivered To QA",
          "TaskId": 31478,
          "TaskName": "Issue on next in reporting scheduler if status is Published",
          "EmpName": "Deeksha Kailas Yelbhar",
          "TaskDate": "2023-04-24T17:28:02",
          "TaskStatus": "Closed",
          "DurationInHrs": 6.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 30652,
          "ItemType": "User Story",
          "Title": "Minor fixes and PR raising",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31522,
          "TaskName": "Topbar changes for font color as per configured theme",
          "EmpName": "Snehal Nyayadhis",
          "TaskDate": "2023-04-24T21:50:32",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31523,
          "ItemType": "User Story",
          "Title": "UI Changes - Dashboard/Report Description CSS Changes in List, Randomly showing Images sequentially",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31524,
          "TaskName": "Dashboard/Report Description CSS Changes in List on End USer Consumer View,  Randomly showing Images sequentially",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-24T22:12:10",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31525,
          "ItemType": "User Story",
          "Title": "Hosting issues in Sensa Environment, Raising PRs till Development",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31526,
          "TaskName": "Hosting issues in Sensa Environment, Raising PRs till Development",
          "EmpName": "Kausha Chandarana",
          "TaskDate": "2023-04-24T22:15:45",
          "TaskStatus": "Closed",
          "DurationInHrs": 2.5
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31389,
          "ItemType": "User Story",
          "Title": "Handling Null in application.",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31530,
          "TaskName": "Analysis",
          "EmpName": "Pooja Narwade",
          "TaskDate": "2023-04-24T23:44:24",
          "TaskStatus": "Closed",
          "DurationInHrs": 2
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31195,
          "ItemType": "User Story",
          "Title": "Search control in coded widget with API call",
          "Points": 3,
          "WorkItemStatus": "Resolved",
          "TaskId": 31575,
          "TaskName": "Integrate search page provided by team in iFrame",
          "EmpName": "Ravi Pinjarkar",
          "TaskDate": "2023-04-25T10:35:40",
          "TaskStatus": "Closed",
          "DurationInHrs": 14
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31626,
          "ItemType": "User Story",
          "Title": "Critical Module issue in Dev Branch BVT script",
          "Points": 1,
          "WorkItemStatus": "Resolved",
          "TaskId": 31627,
          "TaskName": "Add module button needs to be added for empty DB case.",
          "EmpName": "Darshan Nath",
          "TaskDate": "2023-04-25T15:31:58",
          "TaskStatus": "Closed",
          "DurationInHrs": 4
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31231,
          "ItemType": "User Story",
          "Title": "Spike User_story :dashboard height adjustment RnD",
          "Points": 3,
          "WorkItemStatus": "Closed",
          "TaskId": 31804,
          "TaskName": "Adjust Dashboard Height as per basis on dashboard control",
          "EmpName": "Nikita Mukund Kulkarni",
          "TaskDate": "2023-04-26T16:00:36",
          "TaskStatus": "Closed",
          "DurationInHrs": 9
        },
        {
          "SprintUID": "d491d4b1-ace4-45b5-9437-6090a9be6ecf",
          "CreatedDate": "2023-05-16T15:35:45.287",
          "WorkItemId": 31428,
          "ItemType": "User Story",
          "Title": "Additional US: Corrected the Notes and Tooltip messages as per Mockup",
          "Points": 1,
          "WorkItemStatus": "Closed",
          "TaskId": 31897,
          "TaskName": "Development",
          "EmpName": "Joydeep Rana",
          "TaskDate": "2023-04-27T16:20:11",
          "TaskStatus": "Closed",
          "DurationInHrs": 8
        }
      ]
  }
}

