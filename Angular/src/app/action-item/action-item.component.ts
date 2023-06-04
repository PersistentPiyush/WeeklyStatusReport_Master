import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { WSR_ActionItems } from '../model/wsr-action-items.model';
import { Output, EventEmitter } from '@angular/core';

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
  @Input() allActionItems: WSR_ActionItems[] = [];
  @Input() filteredActionItems: WSR_ActionItems[] = [];
  @Input() ActionItemMaxID: number;

  @Output() addActionItems = new EventEmitter<WSR_ActionItems>();
  @Output() addActionItemMaxID = new EventEmitter<number>();

  actionitems: WSR_ActionItems[] = [];
  actionitem: WSR_ActionItems;
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

    this.filteredActionItems=this.allActionItems.filter(x=>x.Status=='Open'&& x.isActive == true);
    debugger;
    console.log("ActionItemMaxID "+ this.ActionItemMaxID);

  }
  saveActionItem() {
    debugger;
    this.addActionItems.emit(this.actionitem);
    this.submitted = true;
    console.log(this.actionitem);
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

        // for (let i = 0; i < this.filteredActionItems.length; i++) {
        //   if (this.filteredActionItems[i].ActionItemID === this.actionitem.ActionItemID) {
        //     index = i;
        //     this.filteredActionItems[index] = this.actionitem;
        //     this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action Item Updated', life: 3000 });
        //     break;
        //   }
        // }
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
        console.log("actionitem ts file line 103 : "+ this.actionitem);
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
  this.actionitem = new WSR_ActionItems;
  this.submitted = false;
  this.newActionItemDialog = true;
  this.dialogHeader="Add New Action Item details";
}

editActionItem(actionitem: WSR_ActionItems) {
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
      this.actionitem = new WSR_ActionItems;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }
  });
}


getval(val: any) {

  console.log(val)

}
}
