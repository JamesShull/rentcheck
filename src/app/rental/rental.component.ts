import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.css']
})
export class RentalComponent implements OnInit {
  // Globals from app-component
  @Input('interestRate') interstRateInput : number;
  @Input('loanTerm') loanTermInput : number;
  @Input('downPayment') downPaymentInput : number;

  // investor inputs
  public streetAddress : string; 
  public cityAddress :string; 
  public stateAddress : string;
  public zipAddress : string;
  public price : number;
  public hoa : number;
  public melloRoos : number;
  public rent : number;
  // store in cookies for re-use, avoiding necessity of user accounts
  private cookies = false;

  // outputs
  public monthlyIncome : number;
  public yield : number;

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
    }
    this.updatePerformance();
  }

  updatePerformance(){
    this.monthlyIncome = 100;
    this. yield = .10
  }

}
