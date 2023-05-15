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
  
  ngOnInit(): void { 
    this.TeamsNames = [
      { name: 'NTP Team 1', code: 'NTP Team 1' },
      { name: 'NTP Team 2', code: 'NTP Team 2' },
      { name: 'NTP Team 3', code: 'NTP Team 3' },
      { name: 'NTP Team 4', code: 'NTP Team 4' }      
  ]; 
}
  CallParent(){
  this.OnTeamSelection.emit();
  }}

