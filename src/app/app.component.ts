import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DefaultsService } from './defaults-service/defaults.service';
import { DefaultsDialogComponent } from './defaults-dialog/defaults-dialog.component';
import { LoadDialogComponent } from './load-dialog/load-dialog.component';
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [DefaultsService]
})
export class AppComponent implements OnInit {
  title = 'rentcheck';
  year = (new Date()).getFullYear().toString();
  appVersion = environment.version;
  showHelp = true;

  constructor(private _defaults: DefaultsService, public dialog: MatDialog) {}
  
  ngOnInit(){
    this.showHelp = (localStorage.getItem('showHelp')==='false')? false: true;
  }

  public addRental(){
    this._defaults.addRental();
  }

  public clearLocalStorage(){
    this.showHelp = true;
    let len = localStorage.length
    let removedItems = 0;
    for ( let i = 0; i < len; i++ ) {
      if (localStorage.key(i).substr(0,6) != 'google' ){
        localStorage.removeItem(localStorage.key(i-removedItems));
        removedItems++;
      }
    }
  }

  public closeHelp(){
    this.showHelp = false;
    localStorage.setItem('showHelp','false');
  }

  public defaultsDialog() : void {
    const dialogRef = this.dialog.open(DefaultsDialogComponent, {data: {defaults: this._defaults.getDefaults()}});
    dialogRef.afterClosed().subscribe(result => {if (result != undefined ){this._defaults.saveDefaults(result);}});
  }

  public loadRentals() : void {
    const loadDialogRef = this.dialog.open(LoadDialogComponent);
    loadDialogRef.afterClosed().subscribe(result =>{this.loadStorage(result);});
  }

  private loadStorage(result:any){
    console.log(result);
    let jsonFileRentals: any;
    // Try to parse result as JSON
    if (typeof result === "string"){
      try {
        jsonFileRentals = JSON.parse(result);
      } catch (e) {
        console.error(e);
        return;
      }
    }
    // Get current 'rentals' object (of rental ids)
    let rentalItem = localStorage.getItem('rentals');
    let tempRentals : Array<number> = (rentalItem) ? rentalItem.split(',').map(Number) : new Array();
    // Keep any that have rental data in local storage
    let updatedRentals = new Array<number>();
    for (let i=0;i<tempRentals.length;i++){
      if(localStorage.getItem(tempRentals[i].toString())){ updatedRentals.push(tempRentals[i]); }
    }
    // Add rentals from file import to 'rentals' array
    // Add full rental data from file import to local storage
    for (let i=0;i<jsonFileRentals.length;i++){
      let fileRentalId = Number(jsonFileRentals[i]["rentalId"]);
      updatedRentals.push(fileRentalId);
      localStorage.setItem(jsonFileRentals[i]["rentalId"], JSON.stringify(jsonFileRentals[i]));
    }
    // remove duplicate entries (overwrote working data with file data in localStorage)
    let uniqueUpdatedRentals = new Array<boolean>();
      updatedRentals.filter((item)=>{
        return uniqueUpdatedRentals.hasOwnProperty(item) ? false : (uniqueUpdatedRentals[item] = true);
      }
    );
    //Array.include(val) will search for element
    console.log(uniqueUpdatedRentals);

    // store rentals array in storage before reloading rental cards
    localStorage.setItem('rentals',updatedRentals.toString());
    // refresh and let deck.init() handle the UI
    this._defaults.initRentals();
  }
}