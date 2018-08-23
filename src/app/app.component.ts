import { Component } from '@angular/core';
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
export class AppComponent {
  title = 'rentcheck';
  year = (new Date()).getFullYear().toString();
  appVersion = environment.version;
  showHelp = true;

  constructor(private _defaults: DefaultsService, public dialog: MatDialog) {}
  
  public addRental(){
    this._defaults.addRental();
  }

  public clearLocalStorage(){
    let len = localStorage.length
    for ( let i = 0; i < len; i++ ) {
      if (localStorage.key(i).substr(0,6) != 'google' ){
        localStorage.removeItem(localStorage.key(i));
      }
    }
  }

  public closeHelp(){
    this.showHelp = false;
  }

  public defaultsDialog() : void {
    const dialogRef = this.dialog.open(DefaultsDialogComponent, {data: {defaults: this._defaults.getDefaults()}});
    dialogRef.afterClosed().subscribe(result => {if (result != undefined ){this._defaults.saveDefaults(result);}});
  }

}