import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  // Globals from app-component
  @Input('interestRate') interestRateInput : number;
  public interestRateOverride : number;
  @Input('loanTerm') loanTermInput : number;
  public loanTermOverride : number;
  @Input('downPayment') downPaymentInput : number;
  public downPaymentOverride : number;
  @Input('insuranceRate') insuranceRateInput : number;
  public insuranceRateOverride : number;
  @Input('maintenanceRate') maintenanceRateInput : number;
  public maintenanceRateOverride : number;
  @Input('propertyTaxRate') propertyTaxRateInput : number;
  public propertyTaxRateOverride : number;
  @Input('salaryTaxRate') salaryTaxRateInput : number;
  public salaryTaxRateOverride : number;

  // Market Info
  public streetAddress : string; 
  public cityAddress :string; 
  public stateAddress : string;
  public zipAddress : string;
  public price : number;
  public hoa : number;
  public melloRoos : number;
  public rent : number;

  // Performance Bar
  public monthlyIncome : number;
  public yield : number;

  // Calculation and Details
  public monthlyPayment : number;
  public monthlyInterest : number; 
  public monthlyPrincipal : number;
  private monthlyExpense : number; 
  private monthlyOutflow : number; 
  private monthlyTaxSavings : number;
  private monthlyPropertyTax : number;
  private monthlyInsurance : number;
  private monthlyMaintenance : number;

  private showGlobal : boolean;

  constructor() { }

  ngOnInit() {
      // card defaults
      this.streetAddress = '12345 Street';
      this.cityAddress = 'San Diego';
      this.stateAddress = 'CA';
      this.zipAddress = '92101';
      this.price = 544000; 
      this.hoa = 250; 
      this.melloRoos = 0; 
      this.rent = 2500;
      this.showGlobal = false;

      /* User Overrides */
      this.downPaymentOverride = this.downPaymentInput;
      this.loanTermOverride = this.loanTermInput;
      this.interestRateOverride = this.interestRateInput;
      this.maintenanceRateOverride = this.maintenanceRateInput;
      this.insuranceRateOverride = this.insuranceRateInput;
      this.propertyTaxRateOverride = this.propertyTaxRateInput;
      this.salaryTaxRateOverride = this.salaryTaxRateInput;

      this.updatePerformance();
  }

  public updatePerformance(){
    let log = {
      'price' : this.price,
      'hoa' : this.hoa,
      'melloRoos' : this.melloRoos,
      'rent' : this.rent,
      'interestRateOverride' : this.interestRateOverride,
      'loanTermOverride' : this.loanTermOverride,
      'downPaymentOverride' : this.downPaymentOverride,
      'insuranceRateOverride' : this.insuranceRateOverride,
      'maintenanceRateOverride' : this.maintenanceRateOverride,
      'propertyTaxRateOverride' : this.propertyTaxRateOverride,
      'salaryTaxRateOverride' : this.salaryTaxRateOverride
    };
    console.log(log);
    // Loan calculations
    let principal = (1-this.downPaymentOverride)*this.price;
    let period = 1; // get # months from loan start if your smart
    this.monthlyPayment = this.calcPayment(principal);
    this.monthlyPrincipal = this.calcPrincipal(principal, period);
    this.monthlyInterest = this.calcInterest(principal, period);

    // Expense Calculations
    this.monthlyInsurance = principal*(this.insuranceRateOverride/12);
    this.monthlyMaintenance = principal*(this.maintenanceRateOverride/12);
    this.monthlyPropertyTax = principal*(this.propertyTaxRateOverride/12);
    let propertyTaxCap = 10000/this.salaryTaxRateOverride;
    this.monthlyTaxSavings = this.salaryTaxRateOverride
                                *( (this.monthlyPropertyTax<=propertyTaxCap)?this.monthlyPrincipal:10000 
                                    + this.monthlyInterest);
    this.monthlyOutflow = Number(this.hoa)  + Number(this.melloRoos) 
                          +this.monthlyInsurance + this.monthlyMaintenance
                          + this.monthlyPayment + this.monthlyPropertyTax;
    this.monthlyExpense = this.monthlyOutflow - this.monthlyTaxSavings - this.monthlyPrincipal;

    // Results
    this.monthlyIncome = this.rent - this.monthlyExpense;
    this. yield = (this.monthlyIncome*12) /(this.downPaymentOverride*this.price);
  }
  private calcPayment(principal : number) : number{
    return principal * (this.interestRateOverride/12) * (Math.pow(1 + (this.interestRateOverride/12), this.loanTermOverride)) / (Math.pow(1 + (this.interestRateOverride/12), this.loanTermOverride) - 1);
  }
  private calcPrincipal(principal : number, period : number) : number{
    let previous = 0; let current = 0;
    let calcRate = 1 + (this.interestRateOverride/12); // (1+r)
    if ( period > 0 ){
      previous = principal*Math.pow(calcRate, period-1)  - this.monthlyPayment*((Math.pow(calcRate, period-1) - 1)/(calcRate - 1));
      current = principal*Math.pow(calcRate, period)  - this.monthlyPayment*((Math.pow(calcRate, period) - 1)/(calcRate - 1));
    }else{
      current = principal;
    }
    return previous - current;
  }
  private calcInterest(principal : number, period : number) : number{
    let localPrincipal = this.calcPrincipal(principal, period);
    return this.calcPayment(principal) - localPrincipal;
  }

  public editGlobal(){
    this.showGlobal = true;
  }

  public updateGlobal(){
    this.showGlobal = false;
    // call global service to reflect to other rental cards
  }

  public sanitizeInput(event:any) : number {
    return Number(new String(event).replace('%',''));
  }
}
