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

  private states : string[] = 
          [ 'AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE',
            'FL','FM','GA','GU','HI','IA','ID','IL','IN','KS',
            'KY','LA','MA','MD','ME','MH','MI','MN','MO','MP',
            'MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY',
            'OH','OK','OR','PA','PR','PW','RI','SC','SD','TN',
            'TX','UT','VA','VI','VT','WA','WI','WV','WY'];

  constructor() { }

  public getDefaults() : DefaultsDataInterface {
    if ( localStorage.getItem("defaults") !== null ) {
      this.defaults = JSON.parse(localStorage.getItem("defaults"));
    }
    return this.defaults;
  }

  public saveDefaults(dialogResult : DefaultsDataInterface) : void {
    this.defaults = dialogResult;
    localStorage.setItem("defaults", JSON.stringify(this.defaults));
  }

  public getNewRental() : RentalDataInterface {
    let newRental : RentalDataInterface = {
      editAddress: true,
      streetAddress: undefined,
      cityAddress: undefined,
      stateAddress: undefined,
      zipAddress: undefined,
      price: 544000,
      rent: 3000,
      hoa: 250,
      melloRoos: 0,
      interestRate: .04625,
      loanTerm: 360,
      downPayment: 0.20,
      insuranceRate: .0020,
      maintenanceRate: .0018,
      propertyTaxRate: .01095,
      salaryTaxRate: .22,
      dirtySalaryTaxRate: false,
      dirtyInterestRate: false,
      dirtyLoanTerm: false,
      dirtyDownPayment: false,
      dirtyPropertyTaxRate: false,
      dirtyInsuranceRate: false,
      dirtyMaintenanceRate: false
    }
    return newRental;
  }

  public getStates() : string[] {
    return this.states;
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

export interface RentalDataInterface {
  editAddress: boolean,
  streetAddress: string,
  cityAddress: string,
  stateAddress: string,
  zipAddress: string,
  price: number,
  rent: number,
  hoa: number,
  melloRoos: number,
  interestRate: number,
  loanTerm: number,
  downPayment: number,
  insuranceRate: number,
  maintenanceRate: number,
  propertyTaxRate: number,
  salaryTaxRate: number,
  dirtySalaryTaxRate: boolean,
  dirtyInterestRate: boolean,
  dirtyLoanTerm: boolean,
  dirtyDownPayment: boolean,
  dirtyPropertyTaxRate: boolean,
  dirtyInsuranceRate: boolean,
  dirtyMaintenanceRate: boolean
}
