import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DefaultsService, IDefaultsData } from './defaults-service/defaults.service';
import { DefaultsDialogComponent } from './defaults-dialog/defaults-dialog.component';
//import { RentalComponent } from './rental/rental.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [DefaultsService]
})
export class AppComponent implements OnInit {
  title = 'Rent Check';
  rentalCount = 1;
  rentals : Array<number>;
  public defaultsGlobal : IDefaultsData;
  //@ViewChild(RentalComponent) private rental: RentalComponent;  // update to ViewChildren?

  constructor(private _defaults: DefaultsService, public dialog: MatDialog) {}
  
  ngOnInit(){
    this.initRentals();
  }

  private initRentals(){
    let rentalItem = localStorage.getItem('rentals');
    let tempRentals : Array<number> = (rentalItem) ? rentalItem.split(',').map(Number) : new Array();
    this.rentals = new Array();
    for (let i=0;i<tempRentals.length;i++){this.rentals.push( Number(tempRentals[i]) );}
    if (tempRentals.length == 0){this.addRental();}
    //if (tempRentals){
    //  for (let i=0;i<tempRentals.length;i++){
    //    this.rentals.push( Number(tempRentals[i]) );
    //  }
    //} else {
    //  this.addRental();
    //}
  }

  public defaultsDialog() : void {
    const dialogRef = this.dialog.open(DefaultsDialogComponent, {data: {defaults: this._defaults.getDefaults()}});

    dialogRef.afterClosed().subscribe(
      result => {
        if (result != undefined ){this._defaults.saveDefaults(result);}
      }
    );
  }
  
  public addRental() : void { 
    this.rentals.push(new Date().getTime());
    localStorage.setItem('rentals', this.rentals.toString());
  }
}