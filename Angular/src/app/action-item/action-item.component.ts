import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { WSR_ActionItems } from '../model/wsr-action-items.model';
import { Output, EventEmitter } from '@angular/core';
class tempActionItems {
  tempid: string
  aItem: WSR_ActionItems
  ActionItemID: number
  SummaryID: number
  ActionItem: string
  Owner: string
  ETA: Date
  Status: string
  Remarks: string
  isActive: boolean
}

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  providers: [MessageService],
  styleUrls: ['./action-item.component.css']
})
export class ActionItemComponent {

  //added for testing
  // products: Product[] = [];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  isVisible: boolean = false;

  cols: any[] | any;
  @Input() actionitem_form: FormGroup;
  @Input() actionitems_: WSR_ActionItems[] = [];

  @Output() addActionItems = new EventEmitter<WSR_ActionItems>();

  actionitems: WSR_ActionItems[] = [];

  actionitem: WSR_ActionItems;
  newActionItemDialog: boolean;
  submitted: boolean;
  statuses: any[];
  index: number;
  tempActionObj: tempActionItems;
  tempActionObjArray: tempActionItems[] = [];

  constructor(private messageService: MessageService,
    public confirmationService: ConfirmationService) { }


  ngOnInit() {

    //this.actionitems_ = [];
    this.tempActionObj = new tempActionItems;
    //this.tempActionObjArray=new tempActionItems[];
    this.statuses = [
      { label: 'OPEN', value: 'open' },
      { label: 'CLOSE', value: 'close' }
      
    ];

    this.cols = [

      { field: 'ActionItem', header: 'Action Item' },

      { field: 'Owner', header: 'Owner' },

      { field: 'ETA', header: 'ETA' },

      { field: 'Status', header: 'Status' },

      { field: 'Remarks', header: 'Remarks' }

    ];

  }
  // addNewItem(value: string) {
  //   this.addActionItems.emit(value);
  // }
  saveActionItem() {
    debugger;
    this.addActionItems.emit(this.actionitem);
    this.submitted = true;
    debugger;
    console.log(this.actionitem);
    if (!this.actionitem.ActionItem || !this.actionitem.ETA || !this.actionitem.Remarks ||
      !this.actionitem.Owner) {
        this.newActionItemDialog = true;
    }
    else {

      if (this.actionitem.ActionItemID != null) {
        //update
        let index = -1;
        for (let i = 0; i < this.actionitems_.length; i++) {
          if (this.actionitems_[i].ActionItemID === this.actionitem.ActionItemID) {
            index = i;
            this.actionitems_[index] = this.actionitem;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action Item Updated', life: 3000 });
            break;
          }
        }
        // if (this.index != -1) {
        //   this.actionitems_[this.index] = this.actionitem;
        //   this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action Item Updated', life: 3000 });
        // }

      }
      else {
        //add
        this.actionitem.Status = "Open";
        this.actionitem.ActionItemID = this.actionitems_.length + 1;
        this.actionitems_.push(this.actionitem);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action item Created', life: 3000 });
      }

      this.newActionItemDialog = false;
    }

  }
  saveProduct() {
    this.addActionItems.emit(this.actionitem);
    this.submitted = true;
    debugger;
    console.log(this.actionitem);
    if (this.actionitem.ActionItem.trim()) {
      if (this.tempActionObj.tempid) {
        this.index = this.findIndexById(this.actionitem.ActionItem);
        if (this.index != -1) {
          this.actionitems_[this.index] = this.actionitem;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action Item Updated', life: 3000 });
        }
      }
      else {
        this.actionitem.Status = "Open";
        this.actionitem.ActionItemID = this.actionitems_.length+1;
        // this.actionitems_.push(this.actionitem);
        // this.tempActionObj.tempid = this.createId(),
        // this.tempActionObj.aItem = this.actionitem,
        // this.tempActionObjArray.push(this.tempActionObj);
        this.actionitems_.push(this.actionitem);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action item Created', life: 3000 });
      }

      this.tempActionObjArray = [...this.tempActionObjArray];
      //this.actionitems_ = [this.actionitem.ActionItemID, ...this.actionitems_];
      this.newActionItemDialog = false;

      const items = this.actionitems_.map((item) => {

        const { ActionItemID, ...rest } = item;

        return rest;
      });
      //this.actionitem = {};
    }
  }

  findIndexById(ActionItem: any): any {
    let index = -1;
    for (let i = 0; i < this.actionitems_.length; i++) {
      if (this.actionitems_[i].ActionItem === ActionItem) {
        index = i;
        break;
      }
    }
    return index;
  }
  findIndexByTempId(ActionItem: any): any {
    let index = -1;
    for (let i = 0; i < this.actionitems_.length; i++) {
      if (this.actionitems_[i].ActionItem === ActionItem) {
        index = i;
        break;
      }
    }
    return index;
  }
  // createId(): number {
  //   let id = 0;
  //   var chars = '0123456789';
  //   for (var i = 0; i < 5; i++) {
  //     id += Math.random();
  //   }
  //   return id;
  // }
  getActionItems() {
    if (this.actionitems)
      return this.actionitems;
    else return this.actionitems_;
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
  }

  editProduct(actionitem: WSR_ActionItems) {
    this.actionitem = { ...actionitem };
    this.newActionItemDialog = true;
    this.isVisible = true
  }
  deleteActionItem(actionitem: WSR_ActionItems) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete "' + actionitem.ActionItem + '" ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.actionitems_ = this.actionitems_.filter((val) => val.ActionItem !== actionitem.ActionItem);
        this.actionitem = new WSR_ActionItems;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });
  }


  getval(val: any) {

    console.log(val)

  }
}

//   clonedProducts: { [s: string]: Product; } = {};

//   onRowReorders(val: any) {

//     //this.cols = val.columns;

//   }

//   onRowEditInit(product: Product) {

//     this.clonedProducts[product.id as any] = { ...product } as any;

//   }

//   onRowEditSave(product: Product) {

//     if (product.price as any > 0) {

//       delete this.clonedProducts[product.id as any];

//       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });

//     }

//     else {

//       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });

//     }

//   }

//   onRowEditCancel(product: Product, index: number) {

//     // this.products[index] = this.clonedProducts[product.id as any];

//     // delete this.products[product.id as any];

//   }

// }