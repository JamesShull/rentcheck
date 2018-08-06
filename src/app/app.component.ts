import { Component, OnInit } from '@angular/core';
import { DefaultsService } from './services/defaults.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers : [DefaultsService]
})
export class AppComponent {
  title = 'Rent Check';
  public defaults : any;

  constructor(private _defaults: DefaultsService) { } 
  
  ngOnInit(){
    this.defaults = this._defaults.getDefaults();
  }
}
