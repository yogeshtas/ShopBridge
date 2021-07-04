import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { UtilsModule } from 'src/app/shared/utils/utils.module';
import { InventoryComponent } from './inventory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipe } from './data-filter.pipe'
import { FilterPipe } from './Filter.pipe'
import { OrderBy } from './orderby.pipe'

@NgModule({
  declarations: [InventoryComponent, DataFilterPipe, FilterPipe, OrderBy],
  imports: [
    CommonModule,
    AlertModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    RouterModule.forChild([
      {path: '', component: InventoryComponent},
    ]),
    UtilsModule
  ]
})
export class InventoryModule { }