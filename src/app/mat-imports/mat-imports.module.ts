import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  MatToolbarModule, 
          MatInputModule,
          MatCardModule,
          MatTabsModule,
          MatFormFieldModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule
  ],
  exports: [
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule
  ],
  declarations: []
})
export class MatImportsModule { }
