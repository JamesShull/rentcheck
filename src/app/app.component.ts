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
  rentals : Array<string>;
  public defaultsGlobal : IDefaultsData;
  //@ViewChild(RentalComponent) private rental: RentalComponent;  // update to ViewChildren?

  constructor(private _defaults: DefaultsService, public dialog: MatDialog) {}
  
  ngOnInit(){
    let count = Number(localStorage.getItem("card-count"));
    if( count == NaN || count == 0 ){
      count = 1;
    } 
    localStorage.setItem("card-count",count.toString());
    this.rentalCount = count;
    this.rentals = new Array();
    for (let i=0; i<count; i++){this.rentals.push('rental-'+(count+1).toString());}
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
    this.rentalCount++;
    this.rentals.push('rental-'+this.rentalCount.toString());
    localStorage.setItem("card-count",this.rentalCount.toString());
  }
}