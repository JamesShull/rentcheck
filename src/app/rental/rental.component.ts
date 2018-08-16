import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { FormControl } from '@angular/forms';

import { DefaultsService, IRentalData } from '../defaults-service/defaults.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css'],
  providers : []
})

export class RentalComponent implements OnInit, OnDestroy {
  @Input('savedRentalID') rentalIdInput : number;

  // Globals from defaults.service
  private rentalData : IRentalData;
  private stateList : string[];

  // Performance Bar
  private monthlyIncome : number;
  private yield : number;
  private monthlyOutflow : number;

  // Calculation and Details
  public  purchaseDate = new FormControl(new Date());
  private monthlyPayment : number; 
  private monthlyInterest : number; 
  private monthlyPrincipal : number;
  private monthlyExpense : number;   
  private monthlyPropertyTax : number; 
  private monthlyTaxSavings : number;
  private monthlyInsurance : number; 
  private monthlyMaintenance : number;
  private ammortizationSchedule : Array<any>;
  private ammortizationColumns = ['term','interest','principal'];
  private showAmmortization = false;

  private subscription : Subscription;

  constructor(private _defaults: DefaultsService) { }

  ngOnInit() {
    this.subscription = this._defaults.obs$.subscribe( 
      (trigger) => { if (trigger){this.updatePerformance();}},
      (error) => {console.log(error);},
      ()=> {console.log('complete');}
    );

    let savedRental = JSON.parse(localStorage.getItem(this.rentalIdInput.toString()));
    if (savedRental){
      this.rentalData = savedRental;
      //this.rentalData = this._defaults.getNewRental();
      //this.restoreFromStorage(savedRental);
    }else{
      console.log('rental is loading defaults');
      //load defaults with current rentalIdInput
      this.rentalData = this._defaults.getNewRental();
      this.rentalData.rentalId = this.rentalIdInput;
      this.onSave();  // save for the future?
    }

    this.stateList = this._defaults.getStates();
    this.updatePerformance();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  private inputBlur(event: any){
    let name : string = event.target.name;
    (name!='loanTerm') ? 
      this.rentalData[name]=event.target.value/100 :
      this.rentalData[name]=event.target.value;
    let keyName = 'dirty'+name.substring(0,1).toUpperCase() + name.substring(1);
    this.rentalData[keyName] = true;
    this.updatePerformance();
  }
  // outside caller to update defaults
  public updateGlobals(){
    let tempDefaults = this._defaults.getDefaults();
    if(!this.rentalData.dirtySalaryTaxRate){this.rentalData.salaryTaxRate = tempDefaults.salaryTaxRate;}
    if(!this.rentalData.dirtyInterestRate){this.rentalData.interestRate = tempDefaults.interestRate;}
    if(!this.rentalData.dirtyLoanTerm){this.rentalData.loanTerm = tempDefaults.loanTerm;}
    if(!this.rentalData.dirtyDownPayment){this.rentalData.downPayment = tempDefaults.downPayment;}
    if(!this.rentalData.dirtyPropertyTaxRate){this.rentalData.propertyTaxRate = tempDefaults.propertyTaxRate;}
    if(!this.rentalData.dirtyInsuranceRate){this.rentalData.insuranceRate = tempDefaults.insuranceRate;}
    if(!this.rentalData.dirtyMaintenanceRate){this.rentalData.maintenanceRate = tempDefaults.maintenanceRate;}
  }
  public updatePerformance(){
    this.updateGlobals();
    // Loan
    let principal = (1-this.rentalData.downPayment)*this.rentalData.price;
    this.monthlyPayment = this.calcPayment(principal);
    this.monthlyPrincipal = this.calcPrincipal(principal, 1);
    this.monthlyInterest = this.calcInterest(principal, 1);
    // Other expenses
    this.monthlyInsurance = this.rentalData.price*(this.rentalData.insuranceRate/12);
    this.monthlyMaintenance = this.rentalData.price*(this.rentalData.maintenanceRate/12);
    this.monthlyPropertyTax = this.rentalData.price*(this.rentalData.propertyTaxRate/12);
    // Tax savings
    let propertyTaxCap = 10000/this.rentalData.salaryTaxRate;
    let taxBasis = (this.monthlyPropertyTax<=propertyTaxCap)? 
                      this.monthlyPropertyTax + this.monthlyInterest:
                      10000 + this.monthlyInterest;
    this.monthlyTaxSavings = this.rentalData.salaryTaxRate * taxBasis;
    // Monthly ouflow and expense
    this.monthlyOutflow = Number(this.rentalData.hoa)  + Number(this.rentalData.melloRoos) 
                          +this.monthlyInsurance + this.monthlyMaintenance
                          + this.monthlyPayment + this.monthlyPropertyTax;
    this.monthlyExpense = this.monthlyOutflow - this.monthlyTaxSavings - this.monthlyPrincipal;
    // Income
    this.monthlyIncome = this.rentalData.rent - this.monthlyExpense;
    this.yield = (this.monthlyIncome*12) /(this.rentalData.downPayment*this.rentalData.price);
  }
  private calcPayment(principal : number) : number{
    return principal * (this.rentalData.interestRate/12) 
            * (Math.pow(1 + (this.rentalData.interestRate/12), this.rentalData.loanTerm)) 
            / (Math.pow(1 + (this.rentalData.interestRate/12), this.rentalData.loanTerm) - 1);
  }
  private calcPrincipal(principal : number, period : number) : number{
    let previous = 0; let current = 0;
    let calcRate = 1 + (this.rentalData.interestRate/12); // (1+r)
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
  private generateAmmortizationSchedule() : void{
    this.updatePerformance();
    if (this.showAmmortization != true){
      let principal = (1-this.rentalData.downPayment)*this.rentalData.price;
      this.ammortizationSchedule = new Array();
      for(let i=0;i<this.rentalData.loanTerm;i++){
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

  //To Do: save with Rental ID instead of address
  public onDrop(){
    if(localStorage.getItem(this.rentalData.rentalId.toString()) !== null){
      localStorage.removeItem(this.rentalData.rentalId.toString());
    }
  }
  public onSave(){
    let rentalStorage = this.rentalData;
    localStorage.setItem(this.rentalData.rentalId.toString(), JSON.stringify(rentalStorage));
  }

  private restoreFromStorage(savedRental : IRentalData){
    this.rentalData.rentalId = savedRental.rentalId;

  }
}
