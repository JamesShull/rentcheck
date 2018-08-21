import { Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
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
  @Output() drop = new EventEmitter<number>();

  // Globals from defaults.service
  public rentalData : IRentalData;
  private stateList : string[];

  // Performance Bar
  public monthlyIncome : number;
  public yield : number;
  public monthlyOutflow : number;

  // Calculation and Details
  public purchaseDate = new FormControl(new Date());
  public cost : number;
  public term: number;
  public depreciationPercentage = 0.5;
  public feesPercentage = 0.0125;
  public pmiPercentage = 0.009;
  public monthlyPayment : number; 
  public monthlyInterest : number; 
  public monthlyPrincipal : number;
  public monthlyExpense : number;   
  public monthlyPropertyTax : number;
  public monthlyDepreciation : number; 
  public monthlyTaxSavings : number;
  public monthlyInsurance : number; 
  public monthlyPMI : number;
  public monthlyMaintenance : number;
  public monthlyVacancy : number;
  public ammortizationSchedule : Array<any>;
  public ammortizationColumns = ['term','interest','principal'];
  public showAmmortization = false;

  private subscription : Subscription;

  constructor(private _defaults: DefaultsService) { }

  ngOnInit() {
    // Get ready for updates from the defaults menu by subscribing to default service subject (as observable)
    this.subscription = this._defaults.obs$.subscribe( 
      (trigger) => { if (trigger){this.updatePerformance();}},
      (error) => {console.log(error);},
      ()=> {console.log('complete');}
    );

    let savedRental = JSON.parse(localStorage.getItem(this.rentalIdInput.toString()));
    if (savedRental){
      this.rentalData = savedRental; // Pull in saved rental data
      this.purchaseDate = new FormControl(new Date(savedRental.purchaseDate));
    }else{
      this.rentalData = this._defaults.getNewRental();  // initialize with defaults
      this.rentalData.rentalId = this.rentalIdInput;
    }

    // Update views
    this.stateList = this._defaults.getStates();
    this.updatePerformance();
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  public inputBlur(event: any){  // Called by input fields during editing
    let name : string = event.target.name;
    (name!='loanTerm' && name!='purchaseDate') ? 
      this.rentalData[name]=event.target.value/100 :
      this.rentalData[name]=event.target.value;
    let keyName = 'dirty'+name.substring(0,1).toUpperCase() + name.substring(1);
    this.rentalData[keyName] = true;
    this.updatePerformance();
  }
  public datePurchased(): void {
    this.rentalData.purchaseDate = (new Date(this.purchaseDate.value)).getTime();
    this.rentalData.dirtyPurchaseDate = true;
    this.updatePerformance();
  }
  // outside caller to update defaults
  private updateGlobals(){
    let tempDefaults = this._defaults.getDefaults();
    if(!this.rentalData.dirtySalaryTaxRate){this.rentalData.salaryTaxRate = tempDefaults.salaryTaxRate;}
    if(!this.rentalData.dirtyInterestRate){this.rentalData.interestRate = tempDefaults.interestRate;}
    if(!this.rentalData.dirtyLoanTerm){this.rentalData.loanTerm = tempDefaults.loanTerm;}
    if(!this.rentalData.dirtyDownPayment){this.rentalData.downPayment = tempDefaults.downPayment;}
    if(!this.rentalData.dirtyPropertyTaxRate){this.rentalData.propertyTaxRate = tempDefaults.propertyTaxRate;}
    if(!this.rentalData.dirtyInsuranceRate){this.rentalData.insuranceRate = tempDefaults.insuranceRate;}
    if(!this.rentalData.dirtyMaintenanceRate){this.rentalData.maintenanceRate = tempDefaults.maintenanceRate;}
    if(!this.rentalData.dirtyVacancyRate){this.rentalData.vacancyRate = tempDefaults.vacancyRate;}
  }
  public updatePerformance(){
    this.updateGlobals();
    // Loan
    let principal = (1-this.rentalData.downPayment)*this.rentalData.price;
    this.monthlyPayment = this.calcPayment(principal);
    let date : Date = this.purchaseDate.value; let today : Date = new Date();
    this.term = (today.getFullYear() - date.getFullYear())*12 + (today.getMonth() - date.getMonth()) + 1;
    this.monthlyPrincipal = this.calcPrincipal(principal, this.term);
    this.monthlyInterest = this.calcInterest(principal, this.term);
    // Other expenses
    this.monthlyPMI = (this.rentalData.downPayment<0.20)? principal*this.pmiPercentage: 0;
    this.monthlyInsurance = this.rentalData.price*(this.rentalData.insuranceRate/12);
    this.monthlyMaintenance = this.rentalData.price*(this.rentalData.maintenanceRate/12);
    this.monthlyVacancy = this.rentalData.rent*(this.rentalData.vacancyRate);
    this.monthlyPropertyTax = this.rentalData.price*(this.rentalData.propertyTaxRate/12);
    this.monthlyDepreciation = ((this.rentalData.price * this.depreciationPercentage) / (27.5*12));
    this.cost = (this.rentalData.price*this.rentalData.downPayment) + (this.rentalData.price*this.feesPercentage);
    // Tax savings
    let propertyTaxCap = 10000/this.rentalData.salaryTaxRate;
    /* //Investment properties maybe don't fall victim to SALT cap
    let taxBasis = (this.monthlyPropertyTax<=propertyTaxCap)? 
                      this.monthlyPropertyTax + this.monthlyInterest:
                      10000 + this.monthlyInterest;
    taxBasis += this.monthlyDepreciation;
    */
    let taxBasis =  this.monthlyPropertyTax + this.monthlyInterest + this.monthlyDepreciation;
    this.monthlyTaxSavings = this.rentalData.salaryTaxRate * taxBasis;
    // Monthly ouflow and expense
    this.monthlyOutflow = Number(this.rentalData.hoa)  + Number(this.rentalData.melloRoos) 
                          +this.monthlyInsurance + this.monthlyPMI + this.monthlyMaintenance 
                          + this.monthlyPayment + this.monthlyPropertyTax
                          + this.monthlyVacancy;
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
  public generateAmmortizationSchedule() : void{
    this.updatePerformance();
    if (this.showAmmortization != true){
      let principal = (1-this.rentalData.downPayment)*this.rentalData.price;
      this.ammortizationSchedule = new Array();
      for(let i=0;i<=this.rentalData.loanTerm;i++){
        if ( (i>0 && i <= 12) || i == 60 || i == 120 || i == 240 || i == 360){
          this.ammortizationSchedule.push({
            'term':i,
            'interest': this.calcInterest(principal,i+1),
            'principal': this.calcPrincipal(principal, i+1)
          });
        }
      }
      this.showAmmortization = true;
    }else{
      this.ammortizationSchedule = new Array();
      this.showAmmortization = false;
    }
  }
  public onDrop(){
    if(localStorage.getItem(this.rentalData.rentalId.toString()) !== null){
      localStorage.removeItem(this.rentalData.rentalId.toString());
    }
    this.drop.emit(this.rentalIdInput);
  }
  public onSave(){
    localStorage.setItem(this.rentalData.rentalId.toString(), JSON.stringify(this.rentalData));
  }
}
