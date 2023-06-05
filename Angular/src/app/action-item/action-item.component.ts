import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { WSR_ActionItems } from '../model/wsr-action-items.model';
import { Output, EventEmitter } from '@angular/core';
import { ActionitemList } from '../model/weekly-summary-report.model';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  providers: [MessageService],
  styleUrls: ['./action-item.component.css']
})
export class ActionItemComponent {
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  isVisible: boolean = false;
  dialogHeader:string;

  cols: any[] | any;
  @Input() actionitem_form: FormGroup;
  // @Input() allActionItems: WSR_ActionItems[] = [];
  // @Input() filteredActionItems: WSR_ActionItems[] = [];

  @Input() allActionItems: ActionitemList[] = [];
  @Input() filteredActionItems: ActionitemList[] = [];
  @Input() ActionItemMaxID: number;

  @Output() addActionItems = new EventEmitter<WSR_ActionItems>();
  @Output() addActionItemMaxID = new EventEmitter<number>();

  actionitems: ActionitemList[] = [];
  actionitem: ActionitemList;
  newActionItemDialog: boolean;
  submitted: boolean;
  statuses: any[];
  index: number;

  constructor(private messageService: MessageService,
    public confirmationService: ConfirmationService) { }


  ngOnInit() {
    this.statuses = [
      { label: 'OPEN', value: 'open' },
      { label: 'CLOSE', value: 'close' }
    ];

    this.cols = [

      { field: 'ActionItem', header: 'Action Item' },

      { field: 'Owner', header: 'Owner' },

      { field: 'CreatedOn', header: 'Created On' },

      { field: 'ETA', header: 'ETA' },

      { field: 'Status', header: 'Status' },

      { field: 'Remarks', header: 'Remarks' }
    ];

    this.filteredActionItems=this.allActionItems.filter(x=>x.Status=='Open' && x.isActive == true);

  }
  saveActionItem() {
    debugger;
    this.addActionItems.emit(this.actionitem);
    this.submitted = true;
    if (!this.actionitem.ActionItem || !this.actionitem.ETA || !this.actionitem.Remarks ||
      !this.actionitem.Owner) {
      this.newActionItemDialog = true;
    }
    else {

      if (this.actionitem.ActionItemID != null) {
        //update
        debugger;
        let index = -1;
        let filterIndex=this.filteredActionItems.findIndex(x=>x.ActionItemID==this.actionitem.ActionItemID)
        this.filteredActionItems[filterIndex] = this.actionitem;
        let allItemsIndex=this.allActionItems.findIndex(x=>x.ActionItemID==this.actionitem.ActionItemID)
        this.allActionItems[allItemsIndex] = this.actionitem;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action Item Updated', life: 3000 });

      }
      else {
        this.ActionItemMaxID = this.ActionItemMaxID + 1
        this.addActionItemMaxID.emit(this.ActionItemMaxID);
        //add
        debugger;
        this.actionitem.Status = "Open";        
        this.actionitem.ActionItemID = this.ActionItemMaxID;
        

        this.filteredActionItems.push(this.actionitem);
        this.allActionItems.push(this.actionitem);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action item Created', life: 3000 });
      }
      this.newActionItemDialog = false;
    }
  }

getActionItems() {
  if (this.actionitems)
    return this.actionitems;
  else return this.filteredActionItems;
}
hideDialog() {
  this.newActionItemDialog = false;
  this.submitted = false;
}

getSeverity(status: string) {
  switch (status) {
    case 'CLOSE':
      return 'success';
      break;
    case 'OPEN':
      return 'danger';
      break;
    default:
      return '';
      break;
  }
}

openNew() {
  this.actionitem = new ActionitemList;
  this.submitted = false;
  this.newActionItemDialog = true;
  this.dialogHeader="Add New Action Item details";
}

editActionItem(actionitem: ActionitemList) {
  this.actionitem = { ...actionitem };
  this.newActionItemDialog = true;
  this.isVisible = true
  this.dialogHeader="Update Action Item details";
}
deleteActionItem(actionitem: WSR_ActionItems) {
  actionitem.isActive=false;
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete "' + actionitem.ActionItem + '" ?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.filteredActionItems = this.filteredActionItems.filter((val) => val.ActionItem !== actionitem.ActionItem);
      this.allActionItems = this.allActionItems.filter((val) => val.ActionItem !== actionitem.ActionItem);
      this.actionitem = new ActionitemList;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }
  });
}

}
