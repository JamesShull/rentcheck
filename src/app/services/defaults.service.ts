import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DefaultsService {
  private interestRate = .04625;   // 4.625% default
  private loanTerm = 360;          // 30 yr default
  private downPayment = .20;       // 20% default
  private insuranceRate = .0020;   // 0.20% / yr default
  private maintenanceRate = .0018; // 0.18% / yr default
  private propertyTaxRate = .01095 // 1.09% / yr default
  private salaryTaxRate = 0.22     // 22% default

  constructor() { }

  public getDefaults() : any{
    return {
      "interestRate" :    this.interestRate,
      "loanTerm" :        this.loanTerm,
      "downPayment" :     this.downPayment,
      "insuranceRate" :   this.insuranceRate,
      "maintenanceRate" : this.maintenanceRate,
      "propertyTaxRate" : this.propertyTaxRate,
      "salaryTaxRate" :   this.salaryTaxRate
    }
  }

  //public setDefaults(name:string, value:number) : any {}
}
