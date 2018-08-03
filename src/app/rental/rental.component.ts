import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  // Globals from app-component
  @Input('defaults') defaultsGlobal : any;


  @Input('interestRate') interestRateDefault : number;
  public interestRateOverride : number;
  public interestRateOriginal : number;
  @Input('loanTerm') loanTermDefault : number;
  public loanTermOverride : number;
  public loanTermOriginal : number;
  @Input('downPayment') downPaymentDefault : number;
  public downPaymentOverride : number;
  public downPaymentOriginal : number;
  @Input('insuranceRate') insuranceRateDefault : number;
  public insuranceRateOverride : number;
  public insuranceRateOriginal : number;
  @Input('maintenanceRate') maintenanceRateDefault : number;
  public maintenanceRateOverride : number;
  public maintenanceRateOriginal : number;
  @Input('propertyTaxRate') propertyTaxRateDefault : number;
  public propertyTaxRateOverride : number;
  public propertyTaxRateOriginal : number;
  @Input('salaryTaxRate') salaryTaxRateDefault : number;
  public salaryTaxRateOverride : number;
  public salaryTaxRateOriginal : number;

  public stateList = [ 'AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE',
                        'FL','FM','GA','GU','HI','IA','ID','IL','IN','KS',
                        'KY','LA','MA','MD','ME','MH','MI','MN','MO','MP',
                        'MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY',
                        'OH','OK','OR','PA','PR','PW','RI','SC','SD','TN',
                        'TX','UT','VA','VI','VT','WA','WI','WV','WY' ];

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
  private editAddress : boolean;

  public ammortizationSchedule : Array<any>;
  public ammortizationColumns = ['term','interest','principal'];
  public showAmmortization = false;

  constructor() { }

  ngOnInit() {
      // card defaults
      this.editAddress = true;
      //this.streetAddress = '12345 Street';
      //this.cityAddress = 'San Diego';
      //this.stateAddress = 'CA';
      //this.zipAddress = '92101';
      this.price = 544000; 
      this.hoa = 250; 
      this.melloRoos = 0; 
      this.rent = 2500;
      this.showGlobal = false;

      /* User Overrides */
      this.downPaymentOverride = this.downPaymentDefault;
      this.loanTermOverride = this.loanTermDefault;
      this.interestRateOverride = this.interestRateDefault;
      this.maintenanceRateOverride = this.maintenanceRateDefault;
      this.insuranceRateOverride = this.insuranceRateDefault;
      this.propertyTaxRateOverride = this.propertyTaxRateDefault;
      this.salaryTaxRateOverride = this.salaryTaxRateDefault;

      /* Original Defaults */
      this.downPaymentOriginal = this.downPaymentDefault;
      this.loanTermOriginal = this.loanTermDefault;
      this.interestRateOriginal = this.interestRateDefault;
      this.maintenanceRateOriginal = this.maintenanceRateDefault;
      this.insuranceRateOriginal = this.insuranceRateDefault;
      this.propertyTaxRateOriginal = this.propertyTaxRateDefault;
      this.salaryTaxRateOriginal = this.salaryTaxRateDefault;

      this.updatePerformance();
  }

  public updatePerformance(){
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
    this.showGlobal = !this.showGlobal;
  }

  public updateGlobal(){
    this.showGlobal = false;
    // call global service to reflect to other rental cards
  }

  public generateAmmortizationSchedule() : void{
    this.updatePerformance();
    if (this.showAmmortization != true){
      let principal = (1-this.downPaymentOverride)*this.price;
      this.ammortizationSchedule = new Array();
      for(let i=0;i<this.loanTermOverride;i++){
        this.ammortizationSchedule.push({
          'term':i,
          'interest': this.calcInterest(principal,i+1),
          'principal': this.calcPrincipal(principal, i+1)
        });
      }
      this.showAmmortization = true;
    }else{
      this.ammortizationSchedule = new Array();
      this.showAmmortization = false;
    }
    
    
  }
}
