import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DefaultsService {
  private startingInterestRate = 0.055;

  private defaults : IDefaultsData = {
    state : 'CA',
    interestRate: this.startingInterestRate,
    loanTerm : 360,
    downPayment : .20,
    insuranceRate : .0020,
    maintenanceRate : .0018,
    vacancyRate : .042,
    propertyTaxRate : .0118,
    salaryTaxRate : 0.22,
    managementRate : 0.1
  };

  private states : string[] = [ 
            'AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL',
            'GA','HI','IA','ID','IL','IN','KS','KY','LA','MA',
            'MD','ME','MI','MN','MO','MS','MT','NC','ND','NE',
            'NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI',
            'SC','SD','TN','TX','UT','VA','VT','WA','WI','WV',
            'WY'];
  
  
  private source = new Subject<boolean>();
  private addSource = new Subject<any>();
  private initSource = new Subject<any>();
  obs$ = this.source.asObservable();
  addObs$ = this.addSource.asObservable();
  initObs$ = this.initSource.asObservable();

  constructor() { }

  public initRentals(){
    this.initSource.next(); // notify rentals to reinitialize (based on localStorage)
  }

  public addRental() {
    this.addSource.next();
  }

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
      price: 500000,
      rent: 3200,
      hoa: 250,
      melloRoos: 0,
      purchaseDate: undefined,
      interestRate: this.startingInterestRate,
      loanTerm: 360,
      downPayment: 0.20,
      insuranceRate: .0020,
      maintenanceRate: .0018,
      vacancyRate: .042,
      propertyTaxRate: .0118,
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
  state: string;
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
