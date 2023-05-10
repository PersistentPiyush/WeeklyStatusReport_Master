import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  providers: [MessageService],
  styleUrls: ['./action-item.component.css']
})
export class ActionItemComponent {

  products: Product[] = [];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  constructor(private messageService: MessageService) { }

  cols: any[] | any;
  @Input() actionitem_form: FormGroup; 





  getval(val: any) {

    console.log(val)

  }

  clonedProducts: { [s: string]: Product; } = {};

  onRowReorders(val: any) {

    this.cols = val.columns;

  }

  onRowEditInit(product: Product) {

    this.clonedProducts[product.id as any] = { ...product } as any;

  }

  onRowEditSave(product: Product) {

    if (product.price as any > 0) {

      delete this.clonedProducts[product.id as any];

      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });

    }

    else {

      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });

    }

  }

  onRowEditCancel(product: Product, index: number) {

    this.products[index] = this.clonedProducts[product.id as any];

    delete this.products[product.id as any];

  }

}

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: string;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;

}
