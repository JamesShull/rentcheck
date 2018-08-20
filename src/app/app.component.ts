import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DefaultsService } from './defaults-service/defaults.service';
import { DefaultsDialogComponent } from './defaults-dialog/defaults-dialog.component';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [DefaultsService]
})
export class AppComponent implements OnInit {
  title = 'rent check';
  year = (new Date()).getFullYear().toString();
  appVersion = environment.version;
  //rentals : Array<number>;
  //showAbout = false;
  //showContact = false;
  //public defaultsGlobal : IDefaultsData;

  constructor(private _defaults: DefaultsService, public dialog: MatDialog) {}
  
  ngOnInit(){
    //this.initRentals();
  }

  /*
  public toggleAbout(){
    this.showAbout = !this.showAbout;
  }
  public toggleContact(){
    this.showContact = !this.showContact;
  }

  private initRentals(){
    let rentalItem = localStorage.getItem('rentals');
    let tempRentals : Array<number> = (rentalItem) ? rentalItem.split(',').map(Number) : new Array();
    this.rentals = new Array();
    for (let i=0;i<tempRentals.length;i++){this.rentals.push( Number(tempRentals[i]) );}
    if (tempRentals.length == 0){this.addRental();}
  }
  */
  public defaultsDialog() : void {
    const dialogRef = this.dialog.open(DefaultsDialogComponent, {data: {defaults: this._defaults.getDefaults()}});
    dialogRef.afterClosed().subscribe(result => {if (result != undefined ){this._defaults.saveDefaults(result);}});
  }
  /*
  public onDrop(rentalId : number) : void {
    this.rentals = this.rentals.filter(el=>{if(el!= rentalId){return el;}});
    let tempRentals = localStorage.getItem('rentals').split(',').map(Number);
    tempRentals = tempRentals.filter(el=>{if(el!= rentalId){return el;}});
    localStorage.setItem('rentals', tempRentals.toString());
  }
  
  public addRental() : void { 
    this.rentals.push(new Date().getTime());
    localStorage.setItem('rentals', this.rentals.toString());
  }
  */
}