import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  MatToolbarModule, 
          MatInputModule,
          MatCardModule,
          MatTabsModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule
  ],
  exports: [
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule
  ],
  declarations: []
})
export class MatImportsModule { }
