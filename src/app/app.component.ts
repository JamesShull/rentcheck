import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { DefaultsService } from './defaults-service/defaults.service';
import { DefaultsDialogComponent } from './defaults-dialog/defaults-dialog.component';
import { LoadDialogComponent } from './load-dialog/load-dialog.component';
import { environment } from '../environments/environment.prod';
import { HelpSnackbarComponent } from './help-snackbar/help-snackbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [DefaultsService]
})
export class AppComponent implements OnInit{
  title = 'rentcheck';
  year = (new Date()).getFullYear().toString();
  appVersion = environment.version;
  showHelp = true;

  constructor(
    private _defaults: DefaultsService, 
    public dialog: MatDialog, 
    public snackBar: MatSnackBar
  ) { 
    
   }
  
  ngOnInit(){
    this.showHelp = (localStorage.getItem('showHelp')==='false')? false: true;  //default to true
    window.setTimeout(()=>{
      this.helpSnackBar();
    }, 3000);
  }

  public helpSnackBar(){
    if (this.showHelp){
      this.snackBar.openFromComponent(HelpSnackbarComponent, {duration: 60000});
    }
  }
  public addRental(){
    this._defaults.addRental();
  }

  public clearLocalStorage(){
    this.showHelp = true;
    let len = localStorage.length
    let removedItems = 0;
    for ( let i = 0; i < len; i++ ) {
      localStorage.removeItem(localStorage.key(i-removedItems));
      removedItems++;
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
    let jsonFileRentals: any;
    // Try to parse result as JSON
    let resultString = '[' + result.toString() + ']';
    try {
      jsonFileRentals = JSON.parse(resultString);
    } catch (e) {
      console.error(e);
      return;
    }
    // Get current 'rentals' object (of rental ids)
    let rentalItem = localStorage.getItem('rentals');
    let updatedRentals = new Array<number>();
    if (rentalItem){
      let tempRentals : Array<number> = (rentalItem) ? rentalItem.split(',').map(Number) : new Array();
      // Keep any that have rental data in local storage
      for (let i=0;i<tempRentals.length;i++){
        if(localStorage.getItem(tempRentals[i].toString())){ updatedRentals.push(tempRentals[i]); }
      }
    }
    // Add rentals from file import to 'rentals' array
    // Add full rental data from file import to local storage
    if (jsonFileRentals){
      for (let i=0;i<jsonFileRentals.length;i++){
        let fileRentalId = Number(jsonFileRentals[i]["rentalId"]);
        updatedRentals.push(fileRentalId);
        localStorage.setItem(jsonFileRentals[i]["rentalId"], JSON.stringify(jsonFileRentals[i]));
      }
    }
    
    // remove duplicate entries (overwrote working data with file data in localStorage)
    let uniqueRentals = new Array<number>();
    updatedRentals.filter((item)=>{
        if (!uniqueRentals.includes(item)){ //Array.includes(val) will search for element
          uniqueRentals.push(item);
        }
      }
    );

    // store rentals array in storage before reloading rental cards
    localStorage.setItem('rentals',uniqueRentals.toString());
    // refresh and let deck.init() handle the UI
    this._defaults.initRentals();
  }
}