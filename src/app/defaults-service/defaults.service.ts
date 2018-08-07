import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DefaultsService {
  private defaults : DefaultsDataInterface = {
    interestRate: .04625,
    loanTerm : 360,
    downPayment : .20,
    insuranceRate : .0020,
    maintenanceRate : .0018,
    propertyTaxRate : .01095,
    salaryTaxRate : 0.22
  };

  constructor() { }

  public getDefaults() : DefaultsDataInterface {
    if ( localStorage.getItem("defaults") !== null ) {
      this.defaults = JSON.parse(localStorage.getItem("defaults"));
    }
    return this.defaults;
  }

  public saveDefaults() : void {
    localStorage.setItem("defaults", JSON.stringify(this.defaults));
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
