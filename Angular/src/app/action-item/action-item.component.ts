import { Component, Input } from '@angular/core';
import { ConfirmationService,MessageService } from 'primeng/api';
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

  //added for testing
  // products: Product[] = [];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  isVisible : boolean =false;

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

  constructor(private messageService: MessageService ,
    public confirmationService:ConfirmationService) { }


  ngOnInit() {
    //this.actionitems_ = [];
    this.statuses = [
      { label: 'CLOSE', value: 'close' },
      { label: 'OPEN', value: 'open' }
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

  saveProduct() {
    this.addActionItems.emit(this.actionitem);
    this.submitted = true;
    debugger;
    console.log(this.actionitem);
    if (this.actionitem.ActionItem.trim()) {
      this.index = this.findIndexById(this.actionitem.ActionItem);
      if (this.index != -1) {
        this.actionitems_[this.index] = this.actionitem;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action Item Updated', life: 3000 });
      }
      else {
        this.actionitem.Status="Open";
        this.actionitems_.push(this.actionitem);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Action item Created', life: 3000 });
      }

      //this.actionitem = [...this.actionitem];
      this.newActionItemDialog = false;
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
    this.isVisible=true
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