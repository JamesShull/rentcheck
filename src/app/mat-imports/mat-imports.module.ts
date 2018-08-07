import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  MatToolbarModule, 
          MatInputModule,
          MatCardModule,
          MatTabsModule,
          MatFormFieldModule,
          MatButtonModule,
          MatTooltipModule,
          MatSelectModule,
          MatSlideToggleModule,
          MatTableModule,
          MatDialogModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatDialogModule
  ],
  exports: [
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatDialogModule
  ],
  declarations: []
})
export class MatImportsModule { }
