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
    window.setTimeout(()=>{this.helpSnackBar();}, 3000);
  }

  public helpSnackBar(){
    if (this.showHelp){
      this.snackBar.openFromComponent(HelpSnackbarComponent, {duration: 30000});
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

    console.log(jsonFileRentals);
    // jsonFileRentals["showHelp"] is undefined for some reason
    if (jsonFileRentals["showHelp"]){
      localStorage.setItem('showHelp', jsonFileRentals["showHelp"])
    }

    // Get current 'rentals' from localStorage (of rental ids)
    let rentalItem = localStorage.getItem('rentals');
    let updatedRentals = new Array<number>();
    if (rentalItem){
      let tempRentals : Array<number> = (rentalItem) ? rentalItem.split(',').map(Number) : new Array();
      // Keep any that have rental data in local storage
      for (let i=0;i<tempRentals.length;i++){
        if(localStorage.getItem(tempRentals[i].toString())){ updatedRentals.push(tempRentals[i]); }
      }
    }
    
    if (jsonFileRentals["rentalData"]){
      // Add full rental data from file import to local storage
      for (let i=0;i<jsonFileRentals["rentalData"].length;i++){
        let fileRentalId = Number(jsonFileRentals["rentalData"][i]["rentalId"]);
        updatedRentals.push(fileRentalId); 
        localStorage.setItem(jsonFileRentals["rentalData"][i]["rentalId"], JSON.stringify(jsonFileRentals["rentalData"][i]));
      }
      // Add rentals from file import to 'rentals' array (without rental data)
      let fileRentals = jsonFileRentals["rentals"];
      let tempRentals : Array<number> = (fileRentals) ? fileRentals.split(',').map(Number) : undefined;
      if (tempRentals){
        for (let i=0;i<tempRentals.length;i++){
          updatedRentals.push(tempRentals[i]);
        }
      }
    }

    // remove duplicate entries
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

  public saveAll(){
    let file = {};
    if (localStorage.getItem('rentals')){file["rentals"]=localStorage.getItem('rentals');}
    if(localStorage.getItem('showHelp')){file["showHelp"]=localStorage.getItem('showHelp');}
    
    let dataArray = new Array();
    let tempRentalData = '';
    let tempRentalRecord = {};
    let rentalsNumbers : number[] = file["rentals"].split(',').map(Number);
    rentalsNumbers.forEach(rental =>{
      tempRentalData = localStorage.getItem(rental.toString());
      if (tempRentalData){
        tempRentalRecord = {};
        tempRentalRecord[rental.toString()] = tempRentalData.toString();
        dataArray.push(tempRentalRecord);
      }
    });
    file["rentalData"] = dataArray;
    
    // Download File
    let fileLink = document.createElement('a');
    fileLink.setAttribute('href','data:text/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(file)));
    fileLink.setAttribute('download','rentcheck_all_'
        + (new Date()).toLocaleDateString('en-US',{year:'numeric', month:'2-digit', day:'2-digit'}).replace('/','_')
        +'.json');
    fileLink.style.display = 'none';
    document.body.appendChild(fileLink);
    fileLink.click();
    document.body.removeChild(fileLink);
  }
}