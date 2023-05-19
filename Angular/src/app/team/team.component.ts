import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  @Input() team_form: FormGroup;
  @Input()  teamData: any[];

  TeamsNames: any = [];

  @Output() OnTeamSelection: EventEmitter<any> = new EventEmitter();


  ngOnInit(): void {
    this.TeamsNames = [
      { TeamName: 'NTP Team 1', TeamID: 1 },
      { TeamName: 'NTP Team 2', TeamID: 2 },
      { TeamName: 'NTP Team 3', TeamID: 3 },
      { TeamName: 'NTP Team 4', TeamID: 4 }
    ];

    // this.teamData = [

    //   {

    //     "id": 1,

    //     "name": "Reporting Team",

    //     "cliLead": "VP – Vasudev Pandurang Nayak",

    //     "perLead": "Nandakumaran Muniswamy",

    //     "scrumMaster": "Nandakumaran Muniswamy",

    //     "projectName": "Reporting Dashboard",

    //     "totalSize": 5,

    //     "status": 0,

    //     "tdTeamMembers": 5

    //   },

    //   {

    //     "id": 2,

    //     "name": "NTP Team 1",

    //     "cliLead": "VP – Vasudev Pandurang Nayak",

    //     "perLead": "Ramamohan Reddy ",

    //     "scrumMaster": "Ramamohan Reddy ",

    //     "projectName": "NTP Product Development",

    //     "totalSize": 10,

    //     "status": 0,

    //     "tdTeamMembers": 8

    //   },
    //   {

    //     "id": 3,

    //     "name": "NTP Team 2",

    //     "cliLead": "VP – Vasudev Pandurang Nayak",

    //     "perLead": "Gunasekar Ganapathi ",

    //     "scrumMaster": "Gunasekar Ganapathi ",

    //     "projectName": "NTP Product Development",

    //     "totalSize": 20,

    //     "status": 0,

    //     "tdTeamMembers": 10

    //   },
    //   {

    //     "id": 4,

    //     "name": "NTP Team 3",

    //     "cliLead": "VP – Vasudev Pandurang Nayak",

    //     "perLead": "John Pengattethu Thomas ",

    //     "scrumMaster": "John Pengattethu Thomas ",

    //     "projectName": "NTP Product Development",

    //     "totalSize": 10,

    //     "status": 0,

    //     "tdTeamMembers": 3

    //   },
    //   {

    //     "id": 5,

    //     "name": "NTP Team 4",

    //     "cliLead": "VP – Vasudev Pandurang Nayak",

    //     "perLead": "Nandakumaran Muniswamy ",

    //     "scrumMaster": "Nandakumaran Muniswamy ",

    //     "projectName": "NTP Product Development",

    //     "totalSize": 100,

    //     "status": 0,

    //     "tdTeamMembers": 8

    //   },

    // ]
  }
  CallParent() {
    this.OnTeamSelection.emit();
  }
}

