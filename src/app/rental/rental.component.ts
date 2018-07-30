import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  // Globals from app-component
  @Input('interestRate') interestRateInput : number;
  @Input('loanTerm') loanTermInput : number;
  @Input('downPayment') downPaymentInput : number;
  @Input('insuranceRate') insuranceRateInput : number;
  @Input('maintenanceRate') maintenanceRateInput : number;
  @Input('propertyTaxRate') propertyTaxRateInput : number;
  @Input('salaryTaxRate') salaryTaxRateInput : number;

  // investor inputs
  public streetAddress : string; 
  public cityAddress :string; 
  public stateAddress : string;
  public zipAddress : string;
  public price : number;
  //private priceControl = new FormControl();
  public hoa : number;
  public melloRoos : number;
  public rent : number;
  // store in cookies for re-use, avoiding necessity of user accounts
  private cookies = false;

  // outputs
  public monthlyIncome : number;
  public monthlyInterest : number; public monthlyPrincipal : number;
  public yield : number;
  public monthlyPayment : number;

  // calculation
  private monthlyExpense : number;  //=outflow - taxSavings - principal
  private monthlyOutflow : number; 
  private monthlyTaxSavings : number;
  private monthlyPropertyTax : number;
  private monthlyInsurance : number;
  private monthlyMaintenance : number;

  constructor() { }

  ngOnInit() {
    if (this.cookies){
      //get from cookies
    } else {
      //defaults
      this.streetAddress = '12345 Street';
      this.cityAddress = 'San Diego';
      this.stateAddress = 'CA';
      this.zipAddress = '92101';
      this.price = 544000; 
      this.hoa = 250; 
      this.melloRoos = 0; 
      this.rent = 2500;
      
      /*  inherited 
      downPaymentInput
      loanTermInput
      interestRateInput
      insuranceRateInput
      maintenanceRateInput
      propertyTaxRateInput
      salaryTaxRateInput
      */
    }
    this.updatePerformance();
  }

  public updatePerformance(){
    // Loan calculations
    let principal = (1-this.downPaymentInput)*this.price;
    let period = 1; // get # months from loan start if your smart
    this.monthlyPayment = this.calcPayment(principal);
    this.monthlyPrincipal = this.calcPrincipal(principal, period);
    this.monthlyInterest = this.calcInterest(principal, period);

    // Expense Calculations
    this.monthlyInsurance = principal*(this.insuranceRateInput/12);
    this.monthlyMaintenance = principal*(this.maintenanceRateInput/12);
    this.monthlyPropertyTax = principal*(this.propertyTaxRateInput/12);
    let propertyTaxCap = 10000/this.salaryTaxRateInput;
    this.monthlyTaxSavings = this.salaryTaxRateInput*( (this.monthlyPropertyTax<=propertyTaxCap)?this.monthlyPrincipal:10000 
                                                      + this.monthlyInterest);
    this.monthlyOutflow = Number(this.hoa)  + Number(this.melloRoos) 
                          +this.monthlyInsurance + this.monthlyMaintenance
                          + this.monthlyPayment + this.monthlyPropertyTax;
    this.monthlyExpense = this.monthlyOutflow - this.monthlyTaxSavings - this.monthlyPrincipal;

    // Results
    this.monthlyIncome = this.rent - this.monthlyExpense;
    this. yield = (this.monthlyIncome*12) /(this.downPaymentInput*this.price);
  }
  private calcPayment(principal : number) : number{
    return principal * (this.interestRateInput/12) * (Math.pow(1 + (this.interestRateInput/12), this.loanTermInput)) / (Math.pow(1 + (this.interestRateInput/12), this.loanTermInput) - 1);
  }
  private calcPrincipal(principal : number, period : number) : number{
    let previous = 0; let current = 0;
    let calcRate = 1 + (this.interestRateInput/12); // (1+r)
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

}
