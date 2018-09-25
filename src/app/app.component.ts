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
  private loadStorage(result: any){
    let jsonFileRentals: any;
    let validKeys = ['defaults', 'rentals', 'showHelp','dataVersion','rentalData'];
    // Validate and convert JSON to object
    try {
      jsonFileRentals = JSON.parse(result);
    } catch (e) {
      console.error(e);
      return;
    }
    // Filter keys from JSON for valid storage entries
    let keys = Object.keys(jsonFileRentals);
    let filteredKeys = keys.filter((key)=>{
      let isValid = false;
      if (validKeys.includes(key)){
        isValid = true;
      }
      let keyNumber = Number(key);
      let isNum = keyNumber !== undefined && typeof(keyNumber) === 'number' && !isNaN(keyNumber);
      return isNum || isValid;
    });
    // Store to localStorage
    let len = filteredKeys.length;
    if (filteredKeys[0] != 'rentalData'){
      // Clear existing localStorage if restoring from Save All
      localStorage.clear();
      for (let i=0;i<len;i++){
        localStorage.setItem(filteredKeys[i], jsonFileRentals[filteredKeys[i]]);
      }
    } else {
      // Otherwise just add 1 rental to existing localStorage 'rentals' and '<rentalId>'
      let rentalsStorage = localStorage.getItem('rentals');
      let rentalId= jsonFileRentals['rentalData']['rentalId'];
      if (rentalId){
        localStorage.setItem('rentals',rentalsStorage+','+rentalId);
        localStorage.setItem(rentalId.toString(), JSON.stringify(jsonFileRentals['rentalData']));
      }
    }
    // Call service to reinit the rentals
    this._defaults.initRentals();
  }

  public saveAll(){
    let file = {};
    for (let i=0, len=localStorage.length;i<len;i++){
      file[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
    }

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