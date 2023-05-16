import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {
  @Input() team_form:FormGroup;
  TeamsNames :any=[];
  @Output() OnTeamSelection: EventEmitter<any> = new EventEmitter();
  
  //oldTeamName:string;
  
  ngOnInit(): void { 
    this.TeamsNames = [
      { TeamName: 'NTP Team 1', TeamID: 1 },
      { TeamName: 'NTP Team 2', TeamID: 2 },
      { TeamName: 'NTP Team 3', TeamID: 3 },
      { TeamName: 'NTP Team 4', TeamID: 4 }      
  ]; 
}
  CallParent(){

  this.OnTeamSelection.emit();
  }}

