import { Component, OnInit, ViewChild } from '@angular/core';
import { DefaultsService, DefaultsDataInterface } from './defaults-service/defaults.service';
import { DefaultsDialogComponent } from './defaults-dialog/defaults-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RentalComponent } from './rental/rental.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [DefaultsService]
})
export class AppComponent implements OnInit{
  title = 'Rent Check';
  public defaults : DefaultsDataInterface;
  @ViewChild(RentalComponent) private rental: RentalComponent;


  constructor(private _defaults: DefaultsService, public dialog: MatDialog) { } 
  
  ngOnInit(){
    this.defaults = this._defaults.getDefaults();
  }

  public defaultsDialog() : void {
    //const dialogRef = this.dialog.open(DefaultsDialogComponent, {data: this.defaults});
    const dialogRef = this.dialog.open(DefaultsDialogComponent, {data: {defaults: this.defaults}});

    dialogRef.afterClosed().subscribe(
      result => {
        this.defaults = result;
        this.rental.updatePerformance();
      // trigger updates to all cards
      });
  }
}

export interface DefaultsDataInterface {
  interestRate: number;
  loanTerm: number;
  downPayment: number;
  insuranceRate: number;
  maintenanceRate: number;
  propertyTaxRate: number;
  salaryTaxRate: number;
}