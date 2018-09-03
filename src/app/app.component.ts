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
    console.log(len);
    for ( let i = 0; i < len; i++ ) {
      console.log(localStorage.key(i));
      if (localStorage.key(i).substr(0,6) != 'google' ){
        localStorage.removeItem(localStorage.key(i));
      }
    }
    //window.location.replace('home');
  }

  public closeHelp(){
    this.showHelp = false;
    localStorage.setItem('showHelp','false');
  }

  public defaultsDialog() : void {
    const dialogRef = this.dialog.open(DefaultsDialogComponent, {data: {defaults: this._defaults.getDefaults()}});
    dialogRef.afterClosed().subscribe(result => {if (result != undefined ){this._defaults.saveDefaults(result);}});
  }

}