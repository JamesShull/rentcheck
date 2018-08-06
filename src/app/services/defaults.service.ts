import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultsService {
  private defaults = {
    'interestRate': .04625,
    'loanTerm' : 360,
    'downPayment' : .20,
    'insuranceRate' : .0020,
    'maintenanceRate' : .0018,
    'propertyTaxRate' : .01095,
    'salaryTaxRate' : 0.22
  };

  constructor() { }

  public getDefaults() : any {
    return this.defaults;
  }

  public setDefaults(name:string, value:number) : boolean {
   return true;
  }
}
