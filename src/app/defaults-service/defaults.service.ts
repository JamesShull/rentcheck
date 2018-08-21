import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DefaultsService {
  private defaults : IDefaultsData = {
    interestRate: .04625,
    loanTerm : 360,
    downPayment : .20,
    insuranceRate : .0020,
    maintenanceRate : .0018,
    vacancyRate : .042,
    propertyTaxRate : .015,
    salaryTaxRate : 0.22,
    managementRate : 0.1
  };

  private states : string[] = [ 'AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE',
            'FL','FM','GA','GU','HI','IA','ID','IL','IN','KS',
            'KY','LA','MA','MD','ME','MH','MI','MN','MO','MP',
            'MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY',
            'OH','OK','OR','PA','PR','PW','RI','SC','SD','TN',
            'TX','UT','VA','VI','VT','WA','WI','WV','WY'];
  
  
  private source = new Subject<boolean>();
  obs$ = this.source.asObservable();

  constructor() { }

  public getDefaults() : IDefaultsData {
    if ( localStorage.getItem("defaults") !== null ) {
      this.defaults = JSON.parse(localStorage.getItem("defaults"));
    }
    return this.defaults;
  }

  public saveDefaults(dialogResult : IDefaultsData) : void {
    this.defaults = dialogResult; // save in memory
    localStorage.setItem("defaults", JSON.stringify(this.defaults));  // save in localStorage
    this.source.next(true); // notify rentals to update
  }

  public getNewRental() : IRentalData {
    let newRental : IRentalData = {
      rentalId: undefined,
      editAddress: true,
      streetAddress: undefined,
      cityAddress: undefined,
      stateAddress: undefined,
      zipAddress: undefined,
      price: 544000,
      rent: 3000,
      hoa: 250,
      melloRoos: 0,
      purchaseDate: undefined,
      interestRate: .04625,
      loanTerm: 360,
      downPayment: 0.20,
      insuranceRate: .0020,
      maintenanceRate: .0018,
      vacancyRate: .042,
      propertyTaxRate: .015,
      salaryTaxRate: .22,
      managementRate: .1,
      dirtyPurchaseDate: false,
      dirtySalaryTaxRate: false,
      dirtyInterestRate: false,
      dirtyLoanTerm: false,
      dirtyDownPayment: false,
      dirtyPropertyTaxRate: false,
      dirtyInsuranceRate: false,
      dirtyMaintenanceRate: false,
      dirtyVacancyRate: false,
      dirtyManagementRate: false
    }
    return newRental;
  }

  public getStates() : string[] {
    return this.states;
  }
}

export interface IDefaultsData {
  interestRate: number;
  loanTerm: number;
  downPayment: number;
  insuranceRate: number;
  maintenanceRate: number;
  vacancyRate: number;
  propertyTaxRate: number;
  salaryTaxRate: number;
  managementRate: number;
}

export interface IRentalData {
  rentalId: number,
  editAddress: boolean,
  streetAddress: string,
  cityAddress: string,
  stateAddress: string,
  zipAddress: string,
  price: number,
  rent: number,
  hoa: number,
  melloRoos: number,
  purchaseDate: number,
  interestRate: number,
  loanTerm: number,
  downPayment: number,
  insuranceRate: number,
  maintenanceRate: number,
  vacancyRate: number,
  propertyTaxRate: number,
  salaryTaxRate: number,
  managementRate: number,
  dirtyPurchaseDate: boolean,
  dirtySalaryTaxRate: boolean,
  dirtyInterestRate: boolean,
  dirtyLoanTerm: boolean,
  dirtyDownPayment: boolean,
  dirtyPropertyTaxRate: boolean,
  dirtyInsuranceRate: boolean,
  dirtyMaintenanceRate: boolean,
  dirtyVacancyRate: boolean,
  dirtyManagementRate: boolean
}
