import { Component, OnInit, Input } from '@angular/core';
import { DefaultsDataInterface } from '../defaults-service/defaults.service';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  // Globals from app-component
  @Input('defaultsGlobal') defaultsInput : DefaultsDataInterface;
  private defaultsOverride : DefaultsDataInterface;
  private dirtyDefaults = {
    salaryTaxRate: false,
    interestRate: false,
    loanTerm: false,
    downPayment: false,
    propertyTaxRate: false,
    insuranceRate: false,
    maintenanceRate: false
  };

  public stateList = [ 'AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE',
                        'FL','FM','GA','GU','HI','IA','ID','IL','IN','KS',
                        'KY','LA','MA','MD','ME','MH','MI','MN','MO','MP',
                        'MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY',
                        'OH','OK','OR','PA','PR','PW','RI','SC','SD','TN',
                        'TX','UT','VA','VI','VT','WA','WI','WV','WY' ];
  // Market Info
  private editAddress : boolean;
  private streetAddress : string; 
  private cityAddress :string; public stateAddress : string; public zipAddress : string;
  private price : number; public rent : number;
  private hoa : number; public melloRoos : number;

  // Performance Bar
  private monthlyIncome : number;
  private yield : number;

  // Calculation and Details
  private monthlyPayment : number; public monthlyInterest : number; public monthlyPrincipal : number;
  private monthlyExpense : number;  private monthlyOutflow : number; 
  private monthlyPropertyTax : number; private monthlyTaxSavings : number;
  private monthlyInsurance : number; private monthlyMaintenance : number;

  public ammortizationSchedule : Array<any>;
  public ammortizationColumns = ['term','interest','principal'];
  public showAmmortization = false;

  constructor() { }

  ngOnInit() {
      // card defaults
      this.editAddress = true; 
      this.price = 544000; this.rent = 3000;
      this.hoa = 250; this.melloRoos = 0; 

      /* User Overrides */
      this.defaultsOverride = Object.assign({},this.defaultsInput);
      this.updatePerformance();
  }

  public inputBlur(event: any){
    (event.target.name!='loanTerm') ? 
      this.defaultsOverride[event.target.name]=event.target.value/100 :
      this.defaultsOverride[event.target.name]=event.target.value;
    this.dirtyDefaults[event.target.name] = true;
    this.updatePerformance();
  }

  public updateGlobals(){
    if(!this.dirtyDefaults.salaryTaxRate){this.defaultsOverride.salaryTaxRate = this.defaultsInput.salaryTaxRate;}
    if(!this.dirtyDefaults.interestRate){this.defaultsOverride.interestRate = this.defaultsInput.interestRate;}
    if(!this.dirtyDefaults.loanTerm){this.defaultsOverride.loanTerm = this.defaultsInput.loanTerm;}
    if(!this.dirtyDefaults.downPayment){this.defaultsOverride.downPayment = this.defaultsInput.downPayment;}
    if(!this.dirtyDefaults.propertyTaxRate){this.defaultsOverride.propertyTaxRate = this.defaultsInput.propertyTaxRate;}
    if(!this.dirtyDefaults.insuranceRate){this.defaultsOverride.insuranceRate = this.defaultsInput.insuranceRate;}
    if(!this.dirtyDefaults.maintenanceRate){this.defaultsOverride.maintenanceRate = this.defaultsInput.maintenanceRate;}
  }

  public updatePerformance(){
    // Loan calculations
    let principal = (1-this.defaultsOverride.downPayment)*this.price;
    this.monthlyPayment = this.calcPayment(principal);
    this.monthlyPrincipal = this.calcPrincipal(principal, 1);
    this.monthlyInterest = this.calcInterest(principal, 1);

    // Expense Calculations
    this.monthlyInsurance = principal*(this.defaultsOverride.insuranceRate/12);
    this.monthlyMaintenance = principal*(this.defaultsOverride.maintenanceRate/12);
    this.monthlyPropertyTax = principal*(this.defaultsOverride.propertyTaxRate/12);
    let propertyTaxCap = 10000/this.defaultsOverride.salaryTaxRate;
    this.monthlyTaxSavings = this.defaultsOverride.salaryTaxRate
                                *( (this.monthlyPropertyTax<=propertyTaxCap)?this.monthlyPrincipal:10000 
                                    + this.monthlyInterest);
    this.monthlyOutflow = Number(this.hoa)  + Number(this.melloRoos) 
                          +this.monthlyInsurance + this.monthlyMaintenance
                          + this.monthlyPayment + this.monthlyPropertyTax;
    this.monthlyExpense = this.monthlyOutflow - this.monthlyTaxSavings - this.monthlyPrincipal;

    // Results
    this.monthlyIncome = this.rent - this.monthlyExpense;
    this. yield = (this.monthlyIncome*12) /(this.defaultsOverride.downPayment*this.price);
  }
  private calcPayment(principal : number) : number{
    return principal * (this.defaultsOverride.interestRate/12) 
            * (Math.pow(1 + (this.defaultsOverride.interestRate/12), this.defaultsOverride.loanTerm)) 
            / (Math.pow(1 + (this.defaultsOverride.interestRate/12), this.defaultsOverride.loanTerm) - 1);
  }
  private calcPrincipal(principal : number, period : number) : number{
    let previous = 0; let current = 0;
    let calcRate = 1 + (this.defaultsOverride.interestRate/12); // (1+r)
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

  public generateAmmortizationSchedule() : void{
    this.updatePerformance();
    if (this.showAmmortization != true){
      let principal = (1-this.defaultsOverride.downPayment)*this.price;
      this.ammortizationSchedule = new Array();
      for(let i=0;i<this.defaultsOverride.loanTerm;i++){
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
