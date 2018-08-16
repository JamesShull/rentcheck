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
    let tempRentals = JSON.parse(localStorage.getItem('rentals'));
    this.rentals = new Array();

    // default first card
    this.rentals.push(new Date().getTime());
    if (tempRentals){
      console.log('rentals: ');
      console.log(tempRentals);
      this.rentals.push()
      for (let i=0;i<tempRentals.length;i++){
        this.rentals.push( Number(tempRentals[i]) );
      }
    }
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