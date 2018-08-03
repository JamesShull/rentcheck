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
  public interestRate = .04625;   // 4.625% default
  public loanTerm = 360;          // 30 yr default
  public downPayment = .20;       // 20% default
  public insuranceRate = .0020;   // 0.20% / yr default
  public maintenanceRate = .0018; // 0.18% / yr default
  public propertyTaxRate = .01095 // 1.09% / yr default
  public salaryTaxRate = 0.22     // 22% default
  public defaults : any;

  constructor(private _defaults: DefaultsService) { } 
  
  ngOnInit(){
    this.defaults = this._defaults.getDefaults();
  }
}
