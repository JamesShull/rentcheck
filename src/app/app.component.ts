import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DefaultsService, DefaultsDataInterface } from './defaults-service/defaults.service';
import { DefaultsDialogComponent } from './defaults-dialog/defaults-dialog.component';
import { RentalComponent } from './rental/rental.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [DefaultsService]
})
export class AppComponent{
  title = 'Rent Check';
  public defaultsGlobal : DefaultsDataInterface;
  @ViewChild(RentalComponent) private rental: RentalComponent;  // update to ViewChildren?

  constructor(private _defaults: DefaultsService, public dialog: MatDialog) {} 

  public defaultsDialog() : void {
    const dialogRef = this.dialog.open(DefaultsDialogComponent, {data: {defaults: this._defaults.getDefaults()}});

    dialogRef.afterClosed().subscribe(
      result => {
        if (result != undefined ){
          this._defaults.saveDefaults(result);
          //this.rental.updateGlobals();
          //this.rental.updatePerformance();
        }
      }
    );
  }
  
  //public addRental() : void { alert("ToDo: add another rental card.");}
}