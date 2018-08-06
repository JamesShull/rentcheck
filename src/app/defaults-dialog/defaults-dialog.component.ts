import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DefaultsDataInterface } from '../defaults-service/defaults.service';

@Component({
  selector: 'app-defaults-dialog',
  templateUrl: './defaults-dialog.component.html',
  styleUrls: ['./defaults-dialog.component.css']
})
export class DefaultsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DefaultsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {defaults: DefaultsDataInterface}
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }
}
